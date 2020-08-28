import React, { Component } from 'react';
import PropTypes from 'prop-types';
import microFps from 'micro-fps';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Typography, Button } from 'lib-react-components';
import ErrorIcon from '../../assets/svg/example_error';
import getPath from '../../utils/get_build_path';
import * as gm from '../../../../lib';
import VideoStreamComponent from '../../components/example/stream';
import Controls from '../../components/example/controls';
import CrossIcon from '../../assets/svg/basic/cross';
import SettingsIcon from '../../assets/svg/basic/settings';
import LazyUpdate from '../../utils/lazy_update';
import EXAMPLES from '../../examples/index.json';
import { getMaxAvailableSize } from '../../utils/ratio';
import reportError from '../../controllers/errors';
import checkExample from '../../utils/check_example_params';
import s from './styles/index.sass';

const PrepareExampleName = (key) => {
  for (let i = 0; i < EXAMPLES.length; i += 1) {
    for (let j = 0; j < EXAMPLES[i].examples.length; j += 1) {
      if (EXAMPLES[i].examples[j].path === key) {
        return EXAMPLES[i].examples[j].name;
      }
    }
  }
  return 'Undefined';
};

export default class ExampleContainer extends Component {
  static generateParams(op) {
    const result = {};
    const components = [];

    if (typeof op.params === 'object') {
      for (const key in op.params) {
        const comp = { name: key, items: [] };

        result[key] = {};
        if (typeof op.params[key] === 'object') {
          for (const param in op.params[key]) {
            const origin = op.params[key][param];
            result[key][param] = typeof origin.default !== 'undefined'
              ? origin.default
              : (
                origin.min
                || (origin.values ? origin.values[0].value : 0)
              );

            comp.items.push(origin);
          }
        }

        components.push(comp);
      }
    }

    return {
      params: result,
      components,
    };
  }

  static propTypes = {
    example: PropTypes.shape({
      op: PropTypes.func,
      params: PropTypes.object, // eslint-disable-line
      tick: PropTypes.func,
      init: PropTypes.func,
    }),
    exampleName: PropTypes.string,
  };

  static contextTypes = {
    device: PropTypes.object,
    intl: PropTypes.object,
  }

  static defaultProps = {
    example: {},
    exampleName: '',
  };

  constructor(props, context) {
    super(props);

    this.state = {
      loading: true,
      playing: true,
      error: '',
      showParams: true,
      exampleInitialized: false,
      ...this.getSize(context),
    };

    this.lazyUpdate = new LazyUpdate(500, this.onResizeEnd);

    const { params, components } = ExampleContainer.generateParams(props.example);

    this.params = params;
    this.components = components;

    this.imgInput = new gm.Tensor('uint8', [this.state.height, this.state.width, 4]);
    this.init(props);
    this.frameNumber = 0;

    this.loading = false;

    const fpsTick = microFps((info) => { this.refFps.innerHTML = info.fps.toFixed(0); }, 3);
    const tick = typeof props.example.tick === 'function' ? props.example.tick : this.tick;

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
        this.setState({
          loading: false,
        });
        this.loading = false;
      } else if (!this.loading) {
        tick.apply(this, [this.frameNumber, {
          canvas: this.canvas,
          params: this.params,
          operation: this.op,
          session: this.sess,
          input: this.imgInput,
          output: this.imgOutput,
          context: this.opContext,
        }]);

        this.frameNumber += 1;
      }

      this.timeout = window.requestAnimationFrame(this.tick);
    };

    this.mounted = true;
  }

  componentWillMount() {
    if (this.context.device.type === 'mobile') {
      this.setState({
        showParams: false,
      });
      document.getElementById('root').style.overflow = 'hidden';
      document.getElementById('root').style.position = 'relative';
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    if (!this.state.error) {
      this.start();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('resize', this.onResize);
    this.stop();
    document.getElementById('root').style.overflow = 'visible';
    document.getElementById('root').style.position = 'static';
  }

  onResizeEnd = () => {
    const { device } = this.context;

    if (device.type === 'mobile') {
      document.getElementById('root').style.overflow = 'hidden';
      document.getElementById('root').style.position = 'relative';
      this.stop();
      this.setState(this.getSize(), () => {
        this.imgInput = new gm.Tensor('uint8', [this.state.height, this.state.width, 4]);
        this.init(this.props);
        this.start();
      });
    }

    if (device.type !== 'mobile') {
      document.getElementById('root').style.overflow = 'visible';
      document.getElementById('root').style.position = 'static';
      this.stop();
      this.setState({
        ...this.getSize(),
        showParams: true,
      }, () => {
        this.imgInput = new gm.Tensor('uint8', [this.state.height, this.state.width, 4]);
        this.init(this.props);
        this.start();
      });
    }
  }

  onResize = () => {
    this.lazyUpdate.activate();
  }

  onChangeParamsShow() {
    const { showParams } = this.state;
    this.setState({
      showParams: !showParams,
    });
  }

  onChangeParams(data, type, name, value) { //eslint-disable-line
    this.params = JSON.parse(JSON.stringify(data));
    if (type === 'constant') {
      this.stop();
      this.init(this.props);
      this.start();
    } else {
      for (const i in this.sess.operation) {
        for (const k in this.sess.operation[i].uniform) {
          if (k === name) {
            this.sess.operation[i].uniform[name].set(value);
          }
        }
      }
    }
  }

  getSize(context = this.context) {
    if (context.device.type === 'mobile') {
      const el = document.getElementById('root');
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

  start() {
    this.stream.start()
      .catch(() => {
        this.stop(true);
        this.setState({ error: 'PermisionDenied' });
      });

    this.timeout = window.requestAnimationFrame(this.tick);
    this.setState({
      playing: true,
    });
    if (
      !this.loading
      && this.checkRerender(this.stream.getImageBuffer('uint8'))
    ) {
      this.setState({
        loading: true,
      });
      this.loading = true;
    }
  }

  stop(destroy = true) {
    this.stream.stop();
    if (destroy) {
      this.sess.destroy();
    }
    window.cancelAnimationFrame(this.timeout);
    this.setState({
      playing: false,
    });
  }

  checkRerender(arr) { //eslint-disable-line
    let dark = true;
    for (let i = 0; i < arr.length; i += 16) {
      if (arr[i] !== 0) {
        dark = false;
      }
    }
    return dark;
  }

  init(props) {
    const { width, height } = this.state;

    checkExample(props.example, props.exampleName);


    try {
      this.sess = new gm.Session();
      this.stream = new gm.CaptureVideo(width, height);

      if (props.example.init) {
        this.opContext = props.example.init(this.op, this.sess, this.params);
      }

      this.op = props.example.op(this.imgInput, this.params, this.opContext);

      if (!(this.op instanceof gm.Operation)) {
        throw new Error(`Error in ${props.exampleName} example: function <op> must return Operation`, null, null);
      }


      this.imgOutput = gm.tensorFrom(this.op);
      this.sess.init(this.op);
    } catch (err) {
      if (this.mounted) {
        this.setState({ error: 'NotSupported' });
      } else {
        this.state.error = 'NotSupported';
      }
      reportError(err);
    }
  }

  tick(frame) {
    this.sess.runOp(this.op, frame, this.imgOutput);

    gm.canvasFromTensor(this.canvas, this.imgOutput);
  }

  canvasRef = (e) => {
    this.canvas = e;
    if (e) {
      this.canvas.width = this.state.width;
      this.canvas.height = this.state.height;
    }
  }

  renderCloseBlock() {
    const { showParams } = this.state;

    return (
      <div //eslint-disable-line
        onClick={this.onChangeParamsShow.bind(this)}
        className={s.close_block}
      >
        {showParams && (
          <CrossIcon className={classNames(s.icon, s.cross, 'fill_light_grey')} />
        )}
        {!showParams && (
          <SettingsIcon
            className={classNames(
            s.icon,
            s.cross,
            'fill_light_grey',
            'stroke_light_grey',
          )}
          />
        )}
        <Typography
          className={s.sett_text}
          type="b1"
          color="light_grey"
        >
          {showParams ? 'Close' : 'Params'}
        </Typography>
      </div>
    );
  }

  renderErrorButton() {
    const { error } = this.state;
    const { intl } = this.context;

    if (error === 'NotSupported') {
      return (
        <Link
          to={`${getPath}/examples`}
          href={`${getPath}/examples`}
        >
          <Button
            size="large"
            color="primary"
            className={s.button}
          >
            {intl.getText(`Example.Errors.Button.${error}`)}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        href={window.location.href}
        size="large"
        color="primary"
        className={s.button}
      >
        {intl.getText(`Example.Errors.Button.${error}`)}
      </Button>
    );
  }

  render() {
    const { example, exampleName } = this.props;
    const { device, intl } = this.context;
    const {
      playing, exampleInitialized, loading, showParams, error,
    } = this.state;
    const haveParams = Object.keys(this.params).length > 0;

    if (!error) {
      return (
        <div className={s.example_wrapper}>
          <div className={s.container}>
            <Typography
              type="h3"
              color="black"
              mobileType="h4"
              className={classNames(
                s.title,
                {
                  [s.none]: device.type === 'mobile' && showParams,
                },
              )}
            >
              <span className={s.title_text}>
                {PrepareExampleName(exampleName)}
              </span>
              <span
                className={classNames(s.fps, 'text_grey')}
                style={{
                  opacity: !loading && playing ? 1 : 0,
                }}
              >
                FPS: <span ref={(node) => { this.refFps = node; }}>Inf.</span>
              </span>
            </Typography>
            {haveParams && device.type === 'mobile' && this.renderCloseBlock()}
            <div
              className={s.part}
              style={{
                width: haveParams && device.type !== 'mobile'
                  || !haveParams && device.type !== 'mobile'
                    ? '58.3333%'
                    : '100%',
              }}
            >
              <VideoStreamComponent
                exampleInitialized={exampleInitialized}
                playing={playing}
                loading={loading}
                onPlay={this.start.bind(this)}
                onStop={this.stop.bind(this, false)}
                canvas={this.canvasRef}
                width={this.state.width}
                height={this.state.height}
              />
            </div>
            {haveParams && showParams && (
              <div
                className={s.part}
                style={{
                  width: haveParams && device.type !== 'mobile'
                    ? 'calc(41.666% - 20px)'
                    : null,
                }}
              >
                {(
                  device.type === 'mobile'
                  && showParams
                  && <div className={classNames('fill_black', s.mask)} />
                )}
                <Controls
                  onChangeParams={this.onChangeParams.bind(this)}
                  stateData={this.params}
                  data={example.params}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={s.example_wrapper}>
        <div className={s.error_container}>
          <ErrorIcon className={s.error_icon} />
          <Typography
            type="h3"
            mobileType="h4"
            color="black"
            align="center"
            className={s.error_descr}
          >
            {intl.getText(`Example.Errors.${error}`)}
          </Typography>
          {this.renderErrorButton()}
        </div>
      </div>
    );
  }
}
