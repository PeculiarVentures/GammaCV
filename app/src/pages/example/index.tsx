import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';
import microFps from 'micro-fps';
import PropTypes from 'prop-types';
import * as gm from 'gammacv';
import { IntlContext } from 'lib-pintl';
import LazyUpdate from '../../utils/lazy_update';
import { getMaxAvailableSize } from '../../utils/ratio';
import getExampleName from '../../utils/prepare_example_name';

interface ISlideParamProps {
  name: string;
  type: number;
  min: number;
  max: number;
  step: number;
  default: number;
}

interface ISelectParamProps {
  name: string;
  type: number;
  values: {
    name: string;
    value: string;
  }[];
}

interface IExampleParam {
  name: string;
  [key: string]: string | ISlideParamProps | ISelectParamProps;
}
export interface IExamplePageProps {
  op?: (input: gm.InputType, params?: {}, context?: any) => gm.Operation,
  tick?: (frame: any, params: {}) => void,
  init?: Function,
  params?: {
    [key: string]: IExampleParam;
  };
  exampleName: string;
}

interface IExampleParams {
  [key: string]: {
    value: string | number;
  };
}

interface IExamplePageState {
  isPlaying: boolean;
  exampleInitialized: boolean,
  canvas: {
    width: number;
    height: number;
  };
  params: IExampleParams;
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

    this.initialState = this.getInitialState();
    this.state = {
      isPlaying: false,
      exampleInitialized: false,
      canvas: this.getSize(context),
      params: this.getInitialState(),
    };

    this.lazyUpdate = new LazyUpdate(500, this.onResizeEnd);

    this.prepareParams = this.handlePreparePreference();
    this.init(props);
    this.frame = 0;
    this.loading = false;

    const fpsTick = microFps((info) => { this.refFps.current.innerHTML = info.fps.toFixed(0); }, 3);
    const tick = typeof props.tick === 'function' ? props.tick : this.tick;

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
      } else if (!this.loading) {
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

  getInitialState = () => {
    const result = {};
    const params = this.props.params;

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
    this.start();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    window.removeEventListener('resize', this.onResize);
    this.stop();
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

  getParamsName = () => {
    const result = [];

    // eslint-disable-next-line guard-for-in
    for (const blockName in this.props.params) {
      result.push(blockName);
    }

    return result;
  }

  getParams = () => {
    const params = this.props.params;
    const result = [];

    // eslint-disable-next-line guard-for-in
    for (const blockName in params) {
      result.push(params[blockName]);
    }

    return result;
  }

  getParamName = (param: IExampleParam) => {
    if (param.name) {
      return param.name;
    }

    // eslint-disable-next-line guard-for-in
    for (const blockName in this.props.params) {
      return blockName;
    }

    return undefined;
  }

  init = (props: IExamplePageProps) => {
    const { width, height } = this.state.canvas;

    try {
      this.imgInput = new gm.Tensor('uint8', [height, width, 4]);
      this.sess = new gm.Session();
      this.stream = new gm.CaptureVideo(width, height);

      if (props.init) {
        this.opContext = props.init(this.op, this.sess, this.prepareParams);
      }

      this.op = props.op(this.imgInput, this.prepareParams, this.opContext);

      if (!(this.op instanceof gm.Operation)) {
        throw new Error(`Error in ${props} example: function <op> must return Operation`);
      }

      this.sess.init(this.op);
      this.outputTensor = gm.tensorFrom(this.op);
    } catch (err) {
      console.log(err);
    }
  }

  tick(frame) {
    this.sess.runOp(this.op, frame, this.outputTensor);

    gm.canvasFromTensor(this.canvasRef.current, this.outputTensor);
  }

  start = () => {
    this.stream.start();

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

  checkRerender = (arr) => {
    let dark = true;

    for (let i = 0; i < arr.length; i += 16) {
      if (arr[i] !== 0) {
        dark = false;
      }
    }

    return dark;
  }

  onChangeParams() { //eslint-disable-line
    this.stop();
    this.init(this.props);
    this.start();
  }

  timeout = null;
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

  trottleUpdateCanvas = () => {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.prepareParams = this.handlePreparePreference();
      this.onChangeParams();
    }, 1000);
  };

  handleChangeState = (key: string, value: string | number) => {
    this.setState({
      params: {
        ...this.state.params,
        [key]: { value },
      },
    });

    this.trottleUpdateCanvas();
  }

  handleResetParams = () => {
    this.setState({ params: this.initialState });

    this.trottleUpdateCanvas();
  }

  handlePreparePreference = () => {
    const resultPreference = {};
    const params = this.props.params;

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

  renderParam = (param: IExampleParam) => {
    const result = [];
    const stateElement = this.state.params;

    for (const key in param) {
      if (key !== 'name') {
        const column = param[key];
        const isSelect = !!column['values'];

        if (!isSelect) {
          result.push(
            // eslint-disable-next-line react/jsx-filename-extension
            <Box key={column['name']}>
              <Box>{column['type'][0]}</Box>
              <Typography>
                {column['name']}
              </Typography>
              <Slider
                value={+stateElement[key].value}
                step={column['step']}
                defaultValue={column['default']}
                min={column['min']}
                max={column['max']}
                onChange={(_e, value) => this.handleChangeState(key, value)}
              />
              <Typography>
                {stateElement[key].value}
              </Typography>
            </Box>,
          );
        }

        if (isSelect) {
          result.push(
            // eslint-disable-next-line react/jsx-filename-extension
            <Box key={column['name']}>
              <Box>{column['type'][0]}</Box>
              <Typography>
                {column['name']}
              </Typography>
              <Select
                value={stateElement[key].value}
                onChange={(event) => this.handleChangeState(key, event.target.value)}
                defaultValue={column['values'][0]['value']}
                options={column['values'].map(({ name, value }) => ({ label: name, value }))}
              />
            </Box>,
          );
        }
      }
    }

    return result;
  }


  render() {
    const { exampleName } = this.props;
    const listParams = this.getParams();

    console.log(this.state.isPlaying);

    return (
      <div>
        <Box>
          <div>
            {getExampleName(exampleName)}
          </div>
          <div>
            FPS: <span ref={this.refFps}>Inf.</span>
          </div>
          <canvas
            ref={this.canvasRef}
            width={this.state.canvas.width}
            height={this.state.canvas.height}
          />
          <button type="button" onClick={this.handleStartStop}>Stop|Start</button>
        </Box>
        <Box>
          <div>
            <div>Params</div>
            <Button
              onClick={this.handleResetParams}
            >
              reset
            </Button>
          </div>

          {listParams.map((param) => {
            const name = this.getParamName(param);

            return (
              <Box key={name}>
                <div>
                  <Typography>
                    {name}
                  </Typography>
                </div>
                {this.renderParam(param)}
              </Box>
            );
          })}
        </Box>
      </div>
    );
  }
}
