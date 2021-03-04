import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';
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
  params: {
    [key: string]: IExampleParam;
  };
}

interface IExamplePageState {
  [key: string]: {
    value: string | number;
  };
}

export class ExamplePage extends React.Component<IExamplePageProps, IExamplePageState> {
  constructor(props: IExamplePageProps) {
    super(props);

    this.initialState = this.getInitialState();
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const result: IExamplePageState = {};
    const params = this.props.params;

    for (const nameOfBlock in params) {
      const block = params[nameOfBlock];

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

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getParamsName = () => {
    const result = [];

    for (const nameOfBlock in this.props.params) {
      result.push(nameOfBlock);
    }

    return result;
  }

  getParams = () => {
    const params = this.props.params;
    const result = [];

    for (const nameOfBlock in params) {
      result.push(params[nameOfBlock]);
    }

    return result;
  }

  getParamName = (param: IExampleParam) => {
    if (param.name) {
      return param.name;
    }

    for (const nameOfBlock in this.props.params) {
      return nameOfBlock;
    }

    return undefined;
  }

  timeout = null;
  initialState: IExamplePageState;

  trottleUpdateCanvas = () => {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => console.log('upd'), 1000);
  };

  handleChangeState = (key: string, value: string | number) => {
    this.setState({
      [key]: { value }
    });

    this.trottleUpdateCanvas();
  }

  handleResetParams = () => {
    this.setState(this.initialState);

    this.trottleUpdateCanvas();
  }

  renderParam = (param: IExampleParam) => {
    const result = [];
    const stateElement = this.state;

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
                {+stateElement[key].value}
              </Typography>
            </Box>
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
            </Box>
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
      );
    }

    return null;
  }
}
