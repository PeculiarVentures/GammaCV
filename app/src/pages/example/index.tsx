import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';
import * as gm from 'gammacv';
// import s from './index.module.sass';

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
  op?: (input: gm.InputType, params: {}, context?: any) => gm.Operation,
  tick?: (frame: any, params: {}) => void,
  init?: () => {},
  params: {
    [key: string]: IExampleParam;
  };
}

interface IExamplePageState {
  isPlaying: boolean;
  frame: number,
  canvas: {
    width: number;
    height: number;
  };
  params: {
    [key: string]: {
      value: string | number;
    };
  }
}

export default class ExamplePage extends React.Component<IExamplePageProps, IExamplePageState> {
  constructor(props: IExamplePageProps) {
    super(props);

    this.initialState = this.getInitialState();
    this.state = {
      frame: 0,
      isPlaying: false,
      canvas: {
        width: 900,
        height: 300,
      },
      params: this.getInitialState(),
    };
    this.prepareParams = this.handlePreparePreference();

    this.stream = new gm.CaptureVideo(this.state.canvas.width, this.state.canvas.height);
    this.sess = new gm.Session();
    this.imageTensor = new gm.Tensor('uint8', [this.state.canvas.height, this.state.canvas.width, 4]);
    // this.init(props);

    this.pipeline = this.imageTensor;
    // this.pipeline = gm.grayscale(this.pipeline);

    // console.log(this.state.params);
    if (this.props.op) {
      this.pipeline = this.props.op(this.imageTensor, this.prepareParams);
    }

    this.sess.init(this.pipeline);
    this.outputTensor = gm.tensorFrom(this.pipeline);
  }

  getInitialState = () => {
    const result = {};
    const params = this.props.params;

    for (const blockName in params) {
      const block = params[blockName];

      for (const param in block) {
        if (param !== 'name') {
          const value = block[param]['default'];

          if (value) {
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
    this.start();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.stop();
  }

  getParamsName = () => {
    const result = [];

    for (const blockName in this.props.params) {
      result.push(blockName);
    }

    return result;
  }

  getParams = () => {
    const params = this.props.params;
    const result = [];

    for (const blockName in params) {
      result.push(params[blockName]);
    }

    return result;
  }

  getParamName = (param: IExampleParam) => {
    if (param.name) {
      return param.name;
    }

    for (const blockName in this.props.params) {
      return blockName;
    }

    return undefined;
  }

  // init = (props: IExamplePageProps) => {
  //   const { width, height } = this.state.canvas;

  //   try {
  //     this.sess = new gm.Session();
  //     this.stream = new gm.CaptureVideo(width, height);

  //     if (props.init) {
  //       console.log('Need init');
  //     }

  //     this.op = props.op(this.imageTensor, this.props.params);

  //     if (!(this.op instanceof gm.Operation)) {
  //       throw new Error(`Error in ${props} example: function <op> must return Operation`);
  //     }

  //     this.sess.init(this.op);
  //     this.outputTensor = gm.tensorFrom(this.op);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  tick = () => {
    const {
      isPlaying, frame, canvas,
    } = this.state;

    if (isPlaying) {
      this.timeoutRequestAnimation = requestAnimationFrame(this.tick);
    }

    this.stream.getImageBuffer(this.imageTensor);
    // const imageData = this.stream.getImageBuffer('uint8');

    // this.imageTensor.data = imageData;

    this.canvasRef.current.height = canvas.height;
    this.canvasRef.current.width = canvas.width;

    this.sess.runOp(this.pipeline, this.state.frame, this.outputTensor);
    gm.canvasFromTensor(this.canvasRef.current, this.outputTensor);

    this.setState({
      frame: frame + 1,
    });
  }

  start = () => {
    this.stream.start(null, null);
    this.setState({ isPlaying: true }, () => {
      this.tick();
    });
  };

  stop = (destroy = true) => {
    this.stream.stop();
    if (destroy) {
      this.sess.destroy();
    }
    window.cancelAnimationFrame(this.timeoutRequestAnimation);

    this.setState({ isPlaying: false });
  };

  timeout = null;
  timeoutRequestAnimation;
  initialState;
  stream;
  sess;
  op;
  canvasProcessed;
  pipeline;
  imageTensor;
  outputTensor;
  prepareParams;
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  trottleUpdateCanvas = () => {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.prepareParams = this.handlePreparePreference();
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

    for (const blockName in params) {
      for (const paramName in params[blockName]) {
        if (paramName !== 'name') {
          resultPreference[blockName] = {
            ...resultPreference[blockName],
            [paramName]: this.state.params[paramName].value,
          }
        }
      }
    }

    return resultPreference;
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
    const listParams = this.getParams();

    if (listParams.length) {
      return (
        <div>
          <Box>
            <canvas
              ref={this.canvasRef}
              width={this.state.canvas.width}
              height={this.state.canvas.height}
            />
            <button type="button" onClick={this.stop}>stop</button>
            <button type="button" onClick={this.start}>start</button>
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

    return null;
  }
}
