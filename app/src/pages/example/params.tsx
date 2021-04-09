import React from 'react';
import {
  Typography, Slider, Select, Box, Button,
} from 'lib-react-components';
import PropTypes from 'prop-types';
import s from './params.module.sass';

interface IParamsWrapperProps {
  handleChangeState: (paramName: string, key: string, value: string | number) => void;
  onReset: () => void;
  params?: TParams;
  paramsValue: TParamsValue;
  isParamsChanged: boolean;
  isMobile: boolean;
}
export default class ParamsWrapper extends React.Component<IParamsWrapperProps> {
  icons = {
    constant: <img src="/static/images/constant_icon.svg" alt="Constant icon" />,
    uniform: <img src="/static/images/uniform_icon.svg" alt="Uniform icon" />,
    reset: <img src="/static/images/reset_icon.svg" alt="Reset icon" />,
    resetMobile: <img src="/static/images/reset_icon_mobile.svg" alt="Reset icon" />,
  };

  getParamName = (param: TParamsElement) => {
    const { params } = this.props;

    if (param.name) {
      return param.name;
    }

    const listParams = Object.keys(params);

    return listParams[0];
  };

  renderParam = (paramName: string) => {
    const result = [];
    const {
      params,
      paramsValue,
      handleChangeState,
      isMobile,
    } = this.props;
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
          <div key={name} className={s.params_block_select_wrapper}>
            <div className={s.params_block_icon}>
              {this.icons[type]}
            </div>
            <Typography
              type="b3"
              color={isMobile ? 'white' : 'dark'}
              className={s.params_block_title}
            >
              {name}
            </Typography>
            <div className={s.params_block_select}>
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
        const paramsColor = isMobile ? 'white' : 'dark_grey';

        result.push(
          <div key={name} className={s.params_block_wrapper}>
            <div className={s.params_block_icon}>
              {this.icons[type]}
            </div>
            <Typography
              type="b3"
              color={paramsColor}
              className={s.params_block_title}
            >
              {name}
            </Typography>
            <div className={s.params_block_slider}>
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
              color={paramsColor}
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
  };

  render() {
    const {
      params,
      onReset,
      isMobile,
      isParamsChanged,
    } = this.props;
    const { intl } = this.context;

    if (params) {
      const listParams = Object.keys(params);

      return (
        <Box
          borderRadius={isMobile ? 0 : 8}
          stroke={isMobile ? '' : 'grey_2'}
          fill={isMobile ? 'black' : ''}
          fillOpacity={isMobile ? 0.7 : 1}
          className={s.controller_wrapper}
        >
          <Box
            stroke={isMobile ? 'dark_grey' : 'grey_2'}
            strokeType="bottom"
            className={s.controller_header_wrapper}
          >
            <Typography
              type="h4"
              className={s.controller_header_title}
            >
              {intl.getText('example.params')}
            </Typography>
            <Button
              onClick={onReset}
              bgType="clear"
              size="small"
              className={s.reset}
              disabled={!isParamsChanged}
            >
              <div className={s.reset_icon}>
                {isMobile ? this.icons.resetMobile : this.icons.reset}
              </div>
              <Typography type="b1" color="grey" className={s.reset_text}>
                {intl.getText('example.reset')}
              </Typography>
            </Button>
          </Box>
          <div className={s.params_block}>
            {listParams.map((paramName) => {
              const name = this.getParamName(params[paramName]);

              return (
                <Box
                  key={paramName}
                  stroke={isMobile ? '' : 'grey_2'}
                  strokeType="bottom"
                  className={s.params_block_section}
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

// @ts-ignore
ParamsWrapper.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
