import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { getDeviceInfo } from './device_info';

/**
 * DeviceProvider component
 */
export default class DeviceProvider extends Component {
  static propTypes = {
    /**
     * This is what will be displayed inside the DeviceProvider
     */
    children: PropTypes.node,
  };

  static childContextTypes = {
    device: PropTypes.object,
  };

  static defaultProps = {
    children: null,
  };

  state = {
    device: getDeviceInfo(),
  };

  getChildContext() {
    return {
      device: this.state.device,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.bindedResize);
  }

  /**
   * Rerender children only if device type changed
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { device } = this.state;
    const { device: deviceNext } = nextState;

    return device.type !== deviceNext.type;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.bindedResize);
  }

  /**
   * onResize window handler
   */
  onResize() {
    this.setState({
      device: getDeviceInfo(),
    });
  }

  bindedResize = this.onResize.bind(this);

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    return this.props.children;
  }
}
