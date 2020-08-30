import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Typography, Slider, Select, SelectItem } from 'lib-react-components';
import LazyUpdate from '../../utils/lazy_update';
import ConstantIcon from '../../assets/svg/constants/constant';
import UniformIcon from '../../assets/svg/constants/uniform';
import ResetIcon from '../../assets/svg/basic/reset';
import s from './styles/controls.sass';

export default class Controls extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.object]),
    stateData: PropTypes.oneOfType([PropTypes.object]),
    onChangeParams: PropTypes.func,
  };

  static contextTypes = {
    device: PropTypes.object,
  };

  static defaultProps = {
    data: {},
    stateData: {},
    onChangeParams: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      stateData: this.props.stateData,
      dafaultParams: true,
    };

    this.defaultData = this.props.stateData;
    this.lazyUpdate = new LazyUpdate(1000, this.props.onChangeParams.bind(this));
  }

  onSetDefault() {
    const { onChangeParams } = this.props;
    const { defaultData } = this;

    this.setState({
      stateData: defaultData,
      dafaultParams: true,
    }, () => onChangeParams(defaultData, 'constant'));
  }

  onChange(groupname, name, type, e, value) {
    const { onChangeParams } = this.props;
    const cloned = JSON.stringify(this.state.stateData);
    const update = JSON.parse(cloned);
    update[groupname][name] = value;

    if (type === 'constant') {
      this.lazyUpdate.activate(update, type, name, value);
    } else {
      onChangeParams(update, type, name, value);
    }

    this.setState({
      stateData: update,
      dafaultParams: false,
    });
  }

  renderIcon(type) { //eslint-disable-line
    if (type === 'constant') {
      return <ConstantIcon className={s.icon} />;
    }
    if (type === 'uniform') {
      return <UniformIcon className={s.icon} />;
    }

    return null;
  }

  renderSelect(i, name, groupname, type) { //eslint-disable-line
    const { stateData } = this.state;

    return (
      <Select
        className={s.tabs}
        onChange={this.onChange.bind(this, groupname, name, type)}
        value={stateData[groupname][name]}
      >
        {
          i.values.map((el, index) => (
            <SelectItem
              key={index} //eslint-disable-line
              value={el.value}
            >
              {el.name}
            </SelectItem>
          ))
        }
      </Select>
    );
  }

  renderControls(i, name, groupname, index) {
    const { stateData } = this.state;

    return (
      <div
        key={`${groupname}_${index}`}
        className={s.group_item}
      >
        {
          this.renderIcon(i.type)
        }
        <Typography
          type="b3"
          color="dark_grey"
          className={s.group_item_name}
        >
          {i.name}
        </Typography>
        {
          i.values && this.renderSelect(i, name, groupname, i.type)
        }
        {
          !i.values &&
          <Slider
            color="dark_grey"
            className={s.slider}
            step={i.step}
            min={i.min}
            max={i.max}
            value={stateData[groupname][name]}
            onChange={this.onChange.bind(this, groupname, name, i.type)}
            defaultValue={i.default}
          />
        }
        <Typography
          type="h5"
          color="dark_grey"
          align="left"
          className={s.group_item_value}
        >
          {!i.values && stateData[groupname][name]}
        </Typography>
      </div>
    );
  }

  renderGroup(el, name) { //eslint-disable-line

    return (
      <div key={name} className={s.group}>
        <Typography
          type="c1"
          color="grey"
          className={s.group_name}
        >
          {el.name || name}
        </Typography>
        {
          Object.keys(el).map((i, index) => i !== 'name' && this.renderControls(el[i], i, name, index))
        }
      </div>
    );
  }

  renderResetButton() {
    const { dafaultParams } = this.state;
    const { data } = this.props;
    const { device } = this.context;

    if (Object.keys(data).length) {
      return (
        <div //eslint-disable-line
          className={classNames(
            s.reset,
            {
              [s.m_disabled]: dafaultParams,
            },
          )}
          onClick={this.onSetDefault.bind(this)}
        >
          <ResetIcon
            className={classNames({
                fill_dark_grey: device.type !== 'mobile',
                fill_light_grey: device.type === 'mobile',
              })}
            style={{ width: '13px', display: 'inline-block' }}
          />
          <Typography
            style={{ display: 'inline-block', marginLeft: '5px' }}
            type="b1"
            color="grey"
          >
            Reset
          </Typography>
        </div>
      );
    }

    return null;
  }

  renderParams() {
    const { data } = this.props;
    const params = Object.keys(this.props.data);

    if (params.length) {
      return (
        <div className={s.groups}>
          {
            params.map(el => this.renderGroup(data[el], el))
          }
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className={s.padding}>
        <div className={s.controls_wrapper}>
          <div className={s.header}>
            <Typography
              type="h4"
              color="black"
              className={s.title}
            >
              Params
            </Typography>
            {this.renderResetButton()}
          </div>
          {this.renderParams()}
        </div>
      </div>
    );
  }
}

