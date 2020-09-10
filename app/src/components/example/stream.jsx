import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CircularProgress } from 'lib-react-components';
import PlayIcon from '../../assets/svg/playing_canvas/play';
import PauseIcon from '../../assets/svg/playing_canvas/pause';
import s from './styles/stream.sass';

const CONTAINER_RATIO = 1.3;

export default class VideoStream extends Component {
  static propTypes = {
    onStop: PropTypes.func,
    onPlay: PropTypes.func,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    exampleInitialized: PropTypes.bool,
    canvas: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static contextTypes = {
    device: PropTypes.object,
  };

  static defaultProps = {
    canvas: null,
    width: 700,
    loading: null,
    onStop: () => {},
    onPlay: () => {},
    playing: null,
    exampleInitialized: null,
    height: 500,
  };

  static getCanvasStyles(width, height, deviceType) { //eslint-disable-line
    const ratio = width / height;

    if (deviceType === 'mobile') {
      return {
        width: '100%',
        height: '100%',
        top: '0',
      };
    }

    if (ratio > CONTAINER_RATIO) {
      const h = CONTAINER_RATIO / ratio * 100;

      return {
        width: '100%',
        height: `${h}%`,
        top: `${(100 - h) / 2}%`,
      };
    }

    const w = ratio / CONTAINER_RATIO * 100;

    return {
      height: '100%',
      width: `${w}%`,
      top: '0',
    };
  }

  componentDidUpdate() {
    const { device } = this.context;
    if (device.type === 'mobile') {
      this.refControl.style.opacity = 1;
    } else {
      this.refControl.style.opacity = null;
    }
  }

  onMouseEnter() {
    this.refNode.style.opacity = 0.9;
    this.refControl.style.opacity = 1;
  }

  onMouseLeave() {
    this.refNode.style.opacity = 0;
    this.refControl.style.opacity = 0;
  }

  render() {
    const { device } = this.context;
    const {
      playing, onStop, onPlay, width, height, canvas, exampleInitialized, loading,
    } = this.props;

    return (
      <div className={s.wrapper}>
        <div
          className={classNames({ [s.padding]: device.type !== 'mobile' }, 'fill_light_grey')}
        >
          <div //eslint-disable-line
            onMouseEnter={device.type !== 'mobile' ? this.onMouseEnter.bind(this) : null}
            onMouseLeave={device.type !== 'mobile' ? this.onMouseLeave.bind(this) : null}
            ref={(node) => { this.refNode = node; }}
            className={classNames(s.mask, 'fill_black')}
            onClick={playing ? onStop : onPlay}
          />
          <div
            ref={(node) => { this.refControl = node; }}
            className={s.controls}
          >
            {playing && device.type !== 'mobile' && <PauseIcon className={classNames(s.icon, 'fill_white')} />}
            {!playing && <PlayIcon className={classNames(s.icon, 'fill_white')} />}
          </div>
          {
            !exampleInitialized || loading &&
              <div className={s.loader}>
                <CircularProgress size={40} />
              </div>
          }
          <canvas
            ref={canvas}
            width={width}
            height={height}
            className={s.canvas}
            style={VideoStream.getCanvasStyles(width, height, device.type)}
          />
        </div>
      </div>
    );
  }
}
