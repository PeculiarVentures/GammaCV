import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';

interface IParamsWrapperProps {
  handleChangeState: (paramName: string, key: string, value: string | number) => void;
  onReset: () => void;
  params?: TParams,
  paramsValue: TParamsValue,
}
export default class ParamsWrapper extends React.Component<IParamsWrapperProps> {
  getParamName = (param: TParamsElement) => {
    const { params } = this.props;

    if (param.name) {
      return param.name;
    }

    const listParams = Object.keys(params);

    return listParams[0];
  }

  icons = {
    constant: <img src="/static/images/constant_icon.svg" alt="Constant icon" />,
    uniform: <img src="/static/images/uniform_icon.svg" alt="Uniform icon" />,
    reset: <img src="/static/images/reset_icon.svg" alt="reset icon" />,
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
          <div key={name}>
            <div style={{ width: '19px' }}>
              {this.icons[type]}
            </div>
            <Typography
              type="b3"
              color="dark"
            >
              {name}
            </Typography>
            <div>
              <Select
                value={valueParams[key]}
                onChange={(event) => handleChangeState(paramName, key, event.target.value)}
                defaultValue={values[0].value}
                options={values.map(({ name, value }) => ({ label: name, value }))}
              />
            </div>
          </div>,
        );
      } else {
        const {
          step, min, max, default: defaultValue,
        } = column;

        result.push(
          <div key={name}>
            <div style={{ width: '19px' }}>
              {this.icons[type]}
            </div>
            <Typography
              type="b3"
              color="dark"
            >
              {name}
            </Typography>
            <div>
              <Slider
                progressColor="dark_grey"
                color="dark_grey"
                value={+valueParams[key]}
                step={step}
                defaultValue={defaultValue}
                min={min}
                max={max}
                onChange={(_e, value) => handleChangeState(paramName, key, value)}
              />
            </div>
            <Typography
              type="h5"
              color="dark_grey"
            >
              {valueParams[key]}
            </Typography>
          </div>,
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
        <Box
          borderRadius={8}
          stroke="grey_2"
        >
          <Box
            stroke="grey_2"
            strokeType="bottom"
          >
            <Typography
              type="h4"
            >
              Params
            </Typography>
            <Button
              onClick={this.props.onReset}
              bgType="clear"
              className="b1"
              textColor="grey"
            >
              <div style={{ width: '15px', display: 'inline-block' }}>
                {this.icons.reset}
              </div>
              Reset
              {/* <Typography
                type="b1"
                color="grey"
              >
              </Typography> */}
            </Button>
          </Box>
          <div>
            {listParams.map((paramName, i) => {
              const name = this.getParamName(params[paramName]);

              return (
                <Box
                  key={i}
                  stroke="grey_2"
                  strokeType="bottom"
                >
                  <Typography
                    type="c1"
                    color="grey"
                  >
                    {name}
                  </Typography>
                  {this.renderParam(paramName)}
                </Box>
              );
            })}
          </div>
        </Box>
      );
    }

    return null;
  }
}
