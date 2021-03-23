import React from 'react';
import {
  Typography, Box, Button, CircularProgress,
} from 'lib-react-components';
import clx from 'classnames';
import microFps from 'micro-fps';
import PropTypes from 'prop-types';
import * as gm from 'gammacv';
import { IntlContext } from 'lib-pintl';
import LazyUpdate from '../../utils/lazy_update';
import { getMaxAvailableSize } from '../../utils/ratio';
import ParamsWrapper from './params';
import s from './index.module.sass';

interface IExamplePageProps {
  data: {
    op?: (input: gm.InputType, params?: {}, context?: any) => gm.Operation,
    tick?: (frame: any, params: {}) => void,
    init?: Function,
    params?: TParams;
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
  params: TParamsValue;
  error: string;
  isCameraAccess: boolean;
  isLoading: boolean;
  showParams: boolean;
  isParamsChanged: boolean;
}

interface IContextType {
  intl: IntlContext;
  device: {
    type: string;
    width: number;
    height: number;
  };
}

export default class ExamplePage
  extends React.Component<IExamplePageProps, IExamplePageState> {
  timeout = null;

  timeoutRequestAnimation = null;

  lazyUpdate: LazyUpdate;

  stream: gm.CaptureVideo;

  sess: gm.Session;

  op: gm.Operation;

  imgInput: gm.Tensor;

  outputTensor: gm.Tensor<gm.TensorDataView>;

  frame: number;

  opContext: Function;

  loading: boolean;

  params: TParamsValue;

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  refFps: React.RefObject<HTMLElement> = React.createRef();

  refStopStartButton: React.RefObject<HTMLButtonElement> = React.createRef();

  constructor(props: IExamplePageProps, context: IContextType) {
    super(props);

    this.params = this.handlePrepareParams();

    this.state = {
      isPlaying: false,
      exampleInitialized: false,
      canvas: this.getSize(context),
      params: this.params,
      error: '',
      isCameraAccess: false,
      isLoading: true,
      showParams: context.device.type !== 'mobile',
      isParamsChanged: false,
    };

    this.lazyUpdate = new LazyUpdate(500, this.onResizeEnd);
    // prepare params from state to set in gammacv op
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
      const { exampleInitialized } = this.state;

      if (!exampleInitialized) {
        this.setState({
          exampleInitialized: true,
        });
      }
      // Read current in to the tensor
      this.stream.getImageBuffer(this.imgInput);

      if (
        this.loading
        && !this.checkRerender(this.imgInput.data)
      ) {
        this.setState({
          isLoading: false,
        });
        this.loading = false;
      } else if (!this.loading && this.canvasRef.current) {
        tick.apply(this, [this.frame, {
          canvas: this.canvasRef.current,
          params: this.params,
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

  UNSAFE_componentWillMount() {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true },
        () => this.setState({ isCameraAccess: true }),
        () => this.setState({ error: 'PermissionDenied' }),
      );
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    const { error } = this.state;

    if (!error) {
      this.start();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    const { error } = this.state;

    if (!error) {
      this.stop();
    }
  }

  handlePrepareParams() {
    /**
     * this method need to prepare incoming params from format
     * { nameExample : { nameParam1: { name, type, min, max, step, default }, nameParam2... }}
     * to format { nameExample: { nameParam1: value, nameParam2: value...} }
     */
    const resultPreference = {};
    const { data } = this.props;
    const { params } = data;

    if (!params) {
      return resultPreference;
    }

    const blockNames = Object.keys(params);

    for (let i = 0; i < blockNames.length; i += 1) {
      const blockName = blockNames[i];
      const paramBlock = params[blockName];
      const paramNames = Object.keys(paramBlock);

      for (let j = 0; j < paramNames.length; j += 1) {
        const paramName = paramNames[j];
        const nameBlock = paramBlock[paramName];

        if (paramName !== 'name') {
          let paramValue: string | number = (nameBlock as ISlideParamProps).default;

          if (typeof paramValue !== 'number') {
            paramValue = (nameBlock as ISelectParamProps).values[0].value;
          }

          resultPreference[blockName] = {
            ...resultPreference[blockName],
            [paramName]: paramValue,
          };
        }
      }
    }

    return resultPreference;
  }

  onResize = () => {
    const { device } = this.context;

    this.setState({
      showParams: device.type !== 'mobile',
    });
    this.lazyUpdate.activate();
  };

  onResizeEnd = () => {
    this.stop(false);
    this.setState({ canvas: this.getSize() }, () => {
      this.init(this.props);
      this.start();
    });
  };

  getSize = (context = this.context) => {
    const { device: { type, width, height } } = context;

    if (type === 'mobile') {
      const res = getMaxAvailableSize(
        width / (height - 60),
        Math.min(width, 600),
        Math.min(height, 600),
      );

      return {
        width: Math.floor(res.width),
        height: Math.floor(res.height),
      };
    }

    return {
      width: 500,
      height: 384,
    };
  };

  init = (props: IExamplePageProps) => {
    const { canvas } = this.state;
    const { width, height } = canvas;

    try {
      // initialize WebRTC stream and session for runing operations on GPU
      this.imgInput = new gm.Tensor('uint8', [height, width, 4]);
      this.sess = new gm.Session();
      this.stream = new gm.CaptureVideo(width, height);
      if (props.data.init) {
        this.opContext = props.data.init(this.op, this.sess, this.params);
      }

      this.op = props.data.op(this.imgInput, this.params, this.opContext);

      if (!(this.op instanceof gm.Operation)) {
        throw new Error(`Error in ${props.exampleName} example: function <op> must return Operation`);
      }

      // initialize graph
      this.sess.init(this.op);
      this.outputTensor = gm.tensorFrom(this.op);
    } catch (err) {
      this.setState({ error: 'NotSupported' });
    }
  };

  tick = (frame: number) => {
    // final run operation on GPU and then write result in to output tensor
    this.sess.runOp(this.op, frame, this.outputTensor);

    if (this.canvasRef.current) {
      // draw result into canvas
      gm.canvasFromTensor(this.canvasRef.current, this.outputTensor);
    }
  };

  start = () => {
    // start capturing a camera and run loop
    this.stream.start().catch(() => {
      this.stop();
      this.setState({
        error: 'PermissionDenied',
      });
    });

    this.timeoutRequestAnimation = window.requestAnimationFrame(this.tick);
    this.setState({
      isPlaying: true,
    });
    if (
      !this.loading
      && this.checkRerender(this.stream.getImageBuffer('uint8'))
    ) {
      this.setState({
        isLoading: true,
      });
      this.loading = true;
    }
  };

  stop = (destroy = true) => {
    this.stream.stop();

    const { isPlaying } = this.state;

    if (destroy && isPlaying) {
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
  };

  onChangeParams = () => {
    const { params } = this.state;

    this.params = params;
    this.stop(false);
    this.init(this.props);
    this.start();
  };

  handleStartStop = () => {
    const { isPlaying, params } = this.state;

    if (isPlaying) {
      this.stop(false);
    } else {
      this.params = params;
      // this.init(this.props);
      this.start();
    }
  };

  trottleUpdate = () => {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.onChangeParams();
    }, 1000);
  };

  handleChangeState = (paramName: string, key: string, value: string | number) => {
    this.setState((prevState) => {
      const { params } = prevState;

      return {
        params: {
          ...params,
          [paramName]: {
            ...params[paramName],
            [key]: value,
          },
        },
        isParamsChanged: true,
      };
    });

    const { data } = this.props;
    const { type } = data.params[paramName][key];

    // need to run trottle or live update param
    if (type === 'constant') {
      this.trottleUpdate();
    } else {
      const { params } = this.state;
      const { operation } = this.sess as any;
      const sessOperations = Object.keys(operation);

      this.params = params;
      for (let i = 0; i < sessOperations.length; i += 1) {
        const sessOperationName = sessOperations[i];

        if (operation[sessOperationName].uniform) {
          const sessUniforms = Object.keys(operation[sessOperationName].uniform);

          for (let j = 0; j < sessUniforms.length; j += 1) {
            const sessUniformName = sessUniforms[j];

            if (sessUniformName === key) {
              operation[sessOperationName].uniform[sessUniformName].set(value);
            }
          }
        }
      }
    }
  };

  handleReset = () => {
    this.setState({
      params: this.handlePrepareParams(),
      isParamsChanged: false,
    }, this.onChangeParams);
  };

  renderStartStopButton() {
    const { isPlaying } = this.state;
    const { device } = this.context;
    const icon = isPlaying
      ? <img src="/static/images/pause_icon.svg" alt="Pause icon" />
      : <img src="/static/images/play_icon.svg" alt="Play icon" />;

    return (
      <span
        ref={this.refStopStartButton}
        className={s.stop_play_button}
        style={{ visibility: isPlaying && device.type === 'mobile' ? 'hidden' : 'visible' }}
      >
        <div className={s.stop_play_icon}>
          {icon}
        </div>
      </span>
    );
  }

  render() {
    const { exampleName, data } = this.props;
    const {
      error, isCameraAccess, canvas, params, isPlaying, isLoading, showParams, isParamsChanged,
    } = this.state;
    const { device, intl } = this.context;
    const isMobile = device.type === 'mobile';

    if (!error && !isCameraAccess) {
      return (
        <div className={s.root_example}>
          <CircularProgress
            size={100}
            className={s.loading}
          />
        </div>
      );
    }

    if (error) {
      const icon = <img src="/static/images/Error_icon.svg" alt="Error icon" />;

      return (
        <div className={s.root_example}>
          <div className={s.error_wrapper}>
            <div className={s.error_icon}>
              {icon}
            </div>
            <div className={s.error_text}>
              <Typography
                type="h3"
                color="black"
                align="center"
              >
                {intl.getText('example.noAccess')}
              </Typography>
            </div>
            <Button
              href={window.location.href}
              size="large"
              color="primary"
              className={s.error_button}
            >
              {intl.getText('example.tryAgain')}
            </Button>
          </div>
        </div>
      );
    }

    if (isMobile && device.height < device.width) {
      return (
        <Box
          fill="primary"
          className={s.to_portrait}
        >
          <Typography
            type="h4"
            color="light_grey"
          >
            {intl.getText('actions.toPortrait')}
          </Typography>
        </Box>
      );
    }

    const showFps = isMobile ? !showParams : true;

    return (
      <div className={s.root_example}>
        <div className={s.example_wrapper}>
          {showFps && (
            <div className={s.top_title_wrapper}>
              <Typography
                type="h3"
                mobileType="h4"
                color="black"
                className={s.top_title_text}
              >
                {intl.getText('operations', undefined, exampleName)}
              </Typography>
              <Typography
                type="h3"
                mobileType="h4"
                color="grey"
                className={clx({
                  [s.top_title_fps]: true,
                  [s.hidden_fps]: !isPlaying,
                })}
              >
                FPS:
                {' '}
                <span ref={this.refFps} />
              </Typography>
            </div>
          )}
          <div className={s.content_wrapper}>
            <Box
              borderRadius={isMobile ? 0 : 8}
              stroke={isMobile ? '' : 'grey_2'}
              fill="light_grey"
              className={s.canvas_wrapper}
            >
              <canvas
                ref={this.canvasRef}
                width={canvas.width}
                height={canvas.height}
                className={s.canvas}
              />
              <div
                className={clx({
                  [s.loading_wrapper]: true,
                  [s.show_loading]: isLoading,
                })}
              >
                <CircularProgress
                  size={40}
                  className={s.loading}
                />
              </div>
              <button
                type="button"
                aria-label="Overlay"
                onClick={this.handleStartStop}
                onMouseEnter={() => { this.refStopStartButton.current.style.visibility = 'visible'; }}
                onMouseLeave={() => { this.refStopStartButton.current.style.visibility = 'hidden'; }}
                className={clx(s.canvas_overlay, 'fill_black')}
              />
              {this.renderStartStopButton()}
            </Box>
            {isMobile && (
              <Button
                onClick={() => this.setState({ showParams: !showParams })}
                bgType="clear"
                size="small"
                className={s.show_params}
              >
                <div className={s.show_params_icon}>
                  {showParams ? (
                    <img src="/static/images/cross_icon.svg" alt="Cross icon" className={s.cross_icon} />
                  ) : (
                    <img src="/static/images/params_icon.svg" alt="Params icon" className={s.params_icon} />
                  )}
                </div>
                <Typography type="b1" color="light_grey">
                  {showParams ? 'Close' : 'Params'}
                </Typography>
              </Button>
            )}
            {showParams && (
              <ParamsWrapper
                params={data.params}
                onReset={this.handleReset}
                handleChangeState={this.handleChangeState}
                paramsValue={{ ...params }}
                isMobile={isMobile}
                isParamsChanged={isParamsChanged}
              />
            )}

          </div>
        </div>
      </div>
    );
  }
}

ExamplePage.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
  device: PropTypes.shape({
    type: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};
