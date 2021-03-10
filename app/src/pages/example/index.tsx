import React from 'react';
import { Typography, Box, Button } from 'lib-react-components';
import microFps from 'micro-fps';
import PropTypes from 'prop-types';
import * as gm from 'gammacv';
import { IntlContext } from 'lib-pintl';
import LazyUpdate from '../../utils/lazy_update';
import { getMaxAvailableSize } from '../../utils/ratio';
import getExampleName from '../../utils/prepare_example_name';
import { ParamsWrapper, ISlideParamProps, ISelectParamProps, IExampleParams } from './params';

interface IExampleParam {
  name: string;
  [key: string]: string | ISlideParamProps | ISelectParamProps;
}
export interface IExamplePageProps {
  data: {
    op?: (input: gm.InputType, params?: {}, context?: any) => gm.Operation,
    tick?: (frame: any, params: {}) => void,
    init?: Function,
    params?: {
      [key: string]: IExampleParam;
    };
  };
  exampleName: string;
}

interface IExamplePageState {
  isPlaying: boolean;
  exampleInitialized: boolean,
  canvas: {
    width: number;
    height: number;
  };
  params: IExampleParams;
  error: string;
}

interface IContextType {
  intl: IntlContext;
  device: {
    type: string;
    width: number;
    height: number;
  };
}

export default class ExamplePage extends React.Component<IExamplePageProps, IExamplePageState> {
  static contextTypes = {
    intl: PropTypes.object,
    device: PropTypes.object,
  };

  constructor(props: IExamplePageProps, context: IContextType) {
    super(props);

    this.state = {
      isPlaying: false,
      exampleInitialized: false,
      canvas: this.getSize(context),
      params: this.getInitialState(),
      error: '',
    };

    this.lazyUpdate = new LazyUpdate(500, this.onResizeEnd);

    this.prepareParams = this.handlePreparePreference();
    this.init(props);
    this.frame = 0;
    this.loading = false;

    const fpsTick = microFps((info) => {
      if (this.refFps.current) {
        this.refFps.current.innerHTML = info.fps.toFixed(0);
      }
    }, 3);
    const tick = typeof props.data.tick === 'function' ? props.data.tick : this.tick;

    this.tick = () => {
      fpsTick();
      if (!this.state.exampleInitialized) {
        this.setState({
          exampleInitialized: true,
        });
      }

      this.stream.getImageBuffer(this.imgInput);

      if (
        this.loading
        && !this.checkRerender(this.imgInput.data)
      ) {
        this.loading = false;
      } else if (!this.loading && this.canvasRef.current) {
        tick.apply(this, [this.frame, {
          canvas: this.canvasRef.current,
          params: this.prepareParams,
          operation: this.op,
          session: this.sess,
          input: this.imgInput,
          output: this.outputTensor,
          context: this.opContext,
        }]);

        this.frame += 1;
      }

      this.timeoutRequestAnimation = window.requestAnimationFrame(this.tick);
    };
  }

  getInitialState() {
    const result = {};
    const params = this.props.data.params;

    // eslint-disable-next-line guard-for-in
    for (const blockName in params) {
      const block = params[blockName];

      for (const param in block) {
        if (param !== 'name') {
          const value = block[param]['default'];

          if (typeof value === 'number') {
            result[param] = {
              value,
            };
          } else {
            const selectValue = block[param]['values'][0].value;

            result[param] = {
              value: selectValue,
            };
          }
        }
      }
    }

    return result;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    if (!this.state.error) {
      this.start();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (!this.state.error) {
      this.stop();
    }
  }

  onChangeParams = (newParams: IExampleParams) => {
    this.setState({ params: newParams }, () => {
      this.prepareParams = this.handlePreparePreference();
      this.stop(false);
      this.init(this.props);
      this.start();
    });
  }

  onResize = () => {
    this.lazyUpdate.activate();
  }

  onResizeEnd = () => {
    this.stop(false);
    this.setState({ canvas: this.getSize() }, () => {
      this.init(this.props);
      this.start();
    });
  }

  getSize = (context = this.context) => {
    if (context.device.type === 'mobile') {
      const el = document.getElementById('__next');
      const res = getMaxAvailableSize(
        el.offsetWidth / (el.offsetHeight - 60),
        Math.min(el.offsetWidth, 600),
        Math.min(el.offsetHeight, 600),
      );

      return {
        width: ~~res.width,
        height: ~~res.height,
      };
    }

    return {
      width: 500,
      height: 384,
    };
  }

  init = (props: IExamplePageProps) => {
    const { width, height } = this.state.canvas;

    try {
      this.imgInput = new gm.Tensor('uint8', [height, width, 4]);
      this.sess = new gm.Session();
      this.stream = new gm.CaptureVideo(width, height);

      if (props.data.init) {
        this.opContext = props.data.init(this.op, this.sess, this.prepareParams);
      }

      this.op = props.data.op(this.imgInput, this.prepareParams, this.opContext);

      if (!(this.op instanceof gm.Operation)) {
        throw new Error(`Error in ${props.exampleName} example: function <op> must return Operation`);
      }

      this.sess.init(this.op);
      this.outputTensor = gm.tensorFrom(this.op);
    } catch (err) {
      this.setState({ error: 'NotSupported' });
    }
  }

  tick(frame) {
    this.sess.runOp(this.op, frame, this.outputTensor);

    if (this.canvasRef.current) {
      gm.canvasFromTensor(this.canvasRef.current, this.outputTensor);
    }
  }

  start = () => {
    this.stream.start().catch(() => {
      this.stop();
      this.setState({ error: 'PermissionDenied' });
    });


    this.timeoutRequestAnimation = window.requestAnimationFrame(this.tick);
    this.setState({
      isPlaying: true,
    });
    if (
      !this.loading
      && this.checkRerender(this.stream.getImageBuffer('uint8'))
    ) {
      this.loading = true;
    }
  }

  stop = (destroy = true) => {
    this.stream.stop();
    if (destroy) {
      this.sess.destroy();
    }
    window.cancelAnimationFrame(this.timeoutRequestAnimation);

    this.setState({ isPlaying: false });
  };

  checkRerender = (arr: any) => {
    let dark = true;

    for (let i = 0; i < arr.length; i += 16) {
      if (arr[i] !== 0) {
        dark = false;
      }
    }

    return dark;
  }

  timeoutRequestAnimation = null;
  initialState: IExampleParams;
  lazyUpdate: LazyUpdate;
  stream: gm.CaptureVideo;
  sess: gm.Session;
  op: gm.Operation;
  imgInput: gm.Tensor;
  outputTensor: gm.Tensor<gm.TensorDataView>;
  prepareParams: IExampleParams;
  frame: number;
  opContext: Function;
  loading: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  refFps: React.RefObject<HTMLElement> = React.createRef();

  handlePreparePreference() {
    const resultPreference = {};
    const params = this.props.data.params;

    // eslint-disable-next-line guard-for-in
    for (const blockName in params) {
      for (const paramName in params[blockName]) {
        if (paramName !== 'name') {
          resultPreference[blockName] = {
            ...resultPreference[blockName],
            [paramName]: this.state.params[paramName].value,
          };
        }
      }
    }

    return resultPreference;
  }

  handleStartStop = () => {
    const isPlay = this.state.isPlaying;

    if (isPlay) {
      this.stop();
    } else {
      this.init(this.props);
      this.start();
    }
  }

  render() {
    const { exampleName, data } = this.props;
    const { error, isPlaying, params } = this.state;

    console.log(isPlaying, error);

    if (!error) {
      return (
        <div style={{ padding: '110px 0' }}>
          <Box>
            <div>
              {getExampleName(exampleName)}
            </div>
            <div>
              FPS: <span ref={this.refFps}>Inf.</span>
            </div>
            <div
              // styles added to test resize
              style={{
                width: '50%',
                margin: '0 auto',
              }}
            >
              <canvas
                // styles added to test resize
                style={{ width: '100%' }}
                ref={this.canvasRef}
                width={this.state.canvas.width}
                height={this.state.canvas.height}
              />
            </div>
            <Button
              onClick={this.handleStartStop}
            >
              Stop|Start
            </Button>
          </Box>
          <ParamsWrapper
            params={data.params}
            initialState={params}
            onChangeParams={this.onChangeParams}
          />
        </div>
      );
    }

    return (
      <div style={{ padding: '110px 0' }}>
        <div>
          <Typography
            type="h3"
            mobileType="h4"
            color="black"
            align="center"
          >
            {error}
          </Typography>
        </div>
      </div>
    );
  }
}
