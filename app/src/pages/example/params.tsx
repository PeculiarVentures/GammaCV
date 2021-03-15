import React from 'react';
import { Typography, Slider, Select, Box, Button } from 'lib-react-components';
import clx from 'classnames';
import s from './params.module.sass';

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
          <div key={name} className={s.params_block_wrapper}>
            <div className={s.params_block_icon}>
              {this.icons[type]}
            </div>
            <Typography
              type="b3"
              color="dark"
              className={s.params_block_title}
            >
              {name}
            </Typography>
            <div className={s.params_block_select} >
              <Select
                bgType="fill"
                color="light_grey"
                textColor="dark"
                value={valueParams[key]}
                onChange={(event) => handleChangeState(paramName, key, event.target.value)}
                defaultValue={values[0].value}
                options={values.map(({ name: label, value }) => ({ label, value }))}
              />
            </div>
          </div>,
        );
      } else {
        const {
          step, min, max, default: defaultValue,
        } = column;

        result.push(
          <div key={name} className={s.params_block_wrapper}>
            <div className={s.params_block_icon}>
              {this.icons[type]}
            </div>
            <Typography
              type="b3"
              color="dark"
              className={s.params_block_title}
            >
              {name}
            </Typography>
            <div className={s.params_block_slider} >
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
              className={s.params_block_count}
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
          className={s.controller_wrapper}
        >
          <Box
            stroke="grey_2"
            strokeType="bottom"
            className={s.controller_header_wrapper}
          >
            <Typography
              type="h4"
              className={s.controller_header_title}
            >
              Params
            </Typography>
            <Button
              onClick={this.props.onReset}
              bgType="clear"
              textColor="grey"
              size="small"
              className="b1"
            >
              <div className={s.reset_icon}>
                {this.icons.reset}
              </div>
              Reset
            </Button>
          </Box>
          <div className={s.params_wrapper}>
            {listParams.map((paramName, i) => {
              const name = this.getParamName(params[paramName]);

              return (
                <Box
                  key={i}
                  stroke="grey_2"
                  strokeType="bottom"
                  className={s.params_block}
                >
                  <Typography
                    type="c1"
                    color="grey"
                    className={s.params_title}
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
