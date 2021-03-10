import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';

export interface ISlideParamProps {
  name: string;
  type: number;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface ISelectParamProps {
  name: string;
  type: number;
  values: {
    name: string;
    value: string;
  }[];
}

export interface IExampleParams {
  [key: string]: {
    value: string | number;
  };
}

interface IParamsProps {
  onChangeParams: (newParams: IExampleParams) => void;
  params?: {
    [key: string]: string | ISlideParamProps | ISelectParamProps;
  };
  initialState: {
    [key: string]: {
      value: string | number;
    };
  }
}

interface IParamsState {
  params: IExampleParams;
}

export class ParamsWrapper extends React.Component<IParamsProps, IParamsState> {
  constructor(props: IParamsProps) {
    super(props);

    this.initialState = this.props.initialState;
    this.state = {
      params: this.props.initialState,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getParams = () => {
    const params = this.props.params;
    const result = [];

    for (const blockName in params) {
      result.push(params[blockName]);
    }

    return result;
  }

  getParamName = (param: IParamsProps['params']) => {
    if (param.name) {
      return param.name;
    }

    for (const blockName in this.props.params) {
      return blockName;
    }

    return undefined;
  }

  timeout = null;
  initialState: {
    [key: string]: {
      value: string | number;
    };
  };

  trottleUpdateCanvas = () => {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.props.onChangeParams(this.state.params);
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

  renderParam = (param: IExampleParams) => {
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
    const isShowParams = !!listParams.length;

    return isShowParams && (
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
            <Box>
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
}
