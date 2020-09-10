import React, { Component } from 'react';
import classNames from 'classnames';
import { Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import s from './styles/index.sass';

export default class TurnDeviceHandler extends Component {
  static contextTypes = {
    intl: PropTypes.object,
    device: PropTypes.object,
  };

  state = {
    show: false,
  }

  componentWillMount() {
    window.addEventListener('orientationchange', this.onResize);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.onResize);
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const { device } = this.context;
    if (device.type === 'mobile' && (window.orientation === 90 || window.orientation === -90)) {
      document.getElementById('root').style.overflow = 'hidden';
      this.setState({
        show: true,
      });
    } else {
      document.getElementById('root').style.overflow = 'visible';
      this.setState({
        show: false,
      });
    }
  }

  render() {
    const { intl } = this.context;
    const { show } = this.state;

    return (
      show &&
      <div className={classNames(s.container, 'fill_primary')}>
        <Typography
          type="h4"
          color="light_grey"
          align="center"
          className={s.text}
        >
          {intl.getText('Turn.Title')}
        </Typography>
      </div>
    );
  }
}
