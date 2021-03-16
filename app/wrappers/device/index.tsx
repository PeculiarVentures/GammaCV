import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { getDeviceInfo } from './device_info';

/**
 * DeviceProvider component
 */
export class DeviceProvider extends Component {
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
    device: {
      type: 'desktop',
    },
  };

  getChildContext() {
    return {
      device: this.state.device,
    };
  }

  componentDidMount() {
    this.setState({
      device: getDeviceInfo(),
    });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      device: getDeviceInfo(),
    });
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    return this.props.children;
  }
}
