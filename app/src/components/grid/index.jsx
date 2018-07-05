import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import s from './styles/index.sass';

export default class Capturing extends Component {
  static propTypes = {
    className: PropTypes.string,
    plateClass: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: '',
    plateClass: '',
    children: null,
  };

  getChildren(child, key) {
    const { plateClass } = this.props;
    const style = { animationDelay: `${key / 20}s` };

    if (!child) {
      return null;
    }

    if (child.type === Link) {
      return React.cloneElement(child, {
        ...child.props,
        key,
        style,
        className: classNames(child.props.className, s.plate, s.link, plateClass),
      });
    }

    return [
      <div
        className={s.plate_container}
        key={child.key || key}
        style={style}
      >
        <div
          tabIndex={0} //eslint-disable-line
          style={style}
          className={classNames(s.plate, plateClass)}
        >
          { child }
        </div>
      </div>,
    ];
  }

  render() {
    const { className, children } = this.props;

    return (
      <div className={classNames(s.main_content, className)}>
        {
          children.map(this.getChildren, this)
        }
      </div>
    );
  }
}
