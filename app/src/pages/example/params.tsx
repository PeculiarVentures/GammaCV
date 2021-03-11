import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';

interface IParamsWrapperProps {
  handleChangeState: (paramName: string, key: string, value: string | number) => void;
  onReset: () => void;
  params?: TParams,
  paramsValue: TParamsValue,
}
export default class ParamsWrapper extends React.Component<IParamsWrapperProps> {
  getParamName = (param: TParams) => {
    const { params } = this.props;

    if (param.name) {
      return param.name;
    }

    const listParams = Object.keys(params);

    return listParams[0];
  }

  renderParam = (paramName: string) => {
    const result = [];
    const { params, paramsValue, handleChangeState } = this.props;
    const param = params[paramName];
    const valueParams = paramsValue[paramName];
    const listParams = Object.keys(param);

    listParams.forEach((key) => {
      if (key === 'name') {
        return null;
      }

      const column = param[key];
      const { name, type } = column;

      if ('values' in column) {
        const { values } = column;

        result.push(
          <Box key={name}>
            <Box>{type[0]}</Box>
            <Typography>
              {name}
            </Typography>
            <Select
              value={valueParams[key]}
              onChange={(event) => handleChangeState(paramName, key, event.target.value)}
              defaultValue={values[0].value}
              options={values.map(({ name, value }) => ({ label: name, value }))}
            />
          </Box>,
        );
      } else {
        const {
          step, min, max, default: defaultValue,
        } = column;

        result.push(
          <Box key={name}>
            <Box>{type[0]}</Box>
            <Typography>
              {name}
            </Typography>
            <Slider
              value={+valueParams[key]}
              step={step}
              defaultValue={defaultValue}
              min={min}
              max={max}
              onChange={(_e, value) => handleChangeState(paramName, key, value)}
            />
            <Typography>
              {valueParams[key]}
            </Typography>
          </Box>,
        );
      }

      return null;
    });

    return result;
  }

  render() {
    const { params } = this.props;

    if (params) {
      const listParams = Object.keys(params);

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
          {listParams.map((paramName, i) => {
            const name = this.getParamName(params);

            return (
              <Box key={i}>
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
