import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';

interface IExampleParam {
  name?: string;
  [key: string]: string | ISlideParamProps | ISelectParamProps;
}
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

interface IParamsProps {
  handleChangeState: (paramName: string, key: string, value: string | number) => void;
  onReset: () => void;
  params?: {
    [key: string]: {
      [key: string]: string | ISlideParamProps | ISelectParamProps;
    }
  };
  paramsValue: {
    [key: string]: any
  };
}

export class ParamsWrapper extends React.Component<IParamsProps> {
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getParams = () => {
    const params = this.props.params;
    const result = [];

    for (const blockName in params) {
      result.push({ [blockName]: params[blockName] });
    }

    debugger;
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

  renderParam = (paramName: string) => {
    const result = [];
    const param = this.props.params[paramName];
    const values = this.props.paramsValue[paramName]

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
                value={+values[key]}
                step={column['step']}
                defaultValue={column['default']}
                min={column['min']}
                max={column['max']}
                onChange={(_e, value) => this.props.handleChangeState(paramName, key, value)}
              />
              <Typography>
                {values[key]}
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
                value={values[key]}
                onChange={(event) => this.props.handleChangeState(paramName, key, event.target.value)}
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
    if (this.props.params) {
      const listParams = Object.keys(this.props.params);

      return (
        <Box>
          <div>
            <div>Params</div>
            <Button
              onClick={this.props.onReset}
            >
              reset
            </Button>
          </div>
          {listParams.map((paramName) => {
            const name = this.getParamName(this.props.params);

            return (
              <Box>
                <div>
                  <Typography>
                    {name}
                  </Typography>
                </div>
                {this.renderParam(paramName)}
              </Box>
            );
          })}
        </Box>
      );
    }

    return null;
  }
}
