import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import AnchorIcon from '../../assets/svg/basic/chain';
import browserHistory from '../../utils/history';
import s from './styles/index.sass';

/* eslint-disable jsx-a11y/accessible-emoji */

export default class HashLink extends Component {
  static propTypes ={
    ...Link.propTypes,
    smooth: PropTypes.bool,
  };

  static defaultProps = {
    ...Link.defaultProps,
    smooth: false,
  };

  componentDidMount() {
    this.check();

    this.unlisten = browserHistory.listen(this.check.bind(this));
  }

  componentWillUnmount() {
    this.unlisten();
  }

  getOpts() {
    // return { behavior: this.props.smooth ? 'smooth' : 'instant', block: 'start' };
    return { behavior: this.props.smooth ? 'instant' : 'instant', block: 'start' };
  }

  check() {
    if (decodeURIComponent(window.location.hash) === this.props.to) {
      this.node.scrollIntoView(this.getOpts());
    }
  }

  render() {
    return (
      <Link
        to={this.props.to}
        className={classNames(this.props.className, s.link)}
        onClick={() => this.node.scrollIntoView(this.getOpts())}
      >
        <span
          className={s.wrapper}
          ref={(node) => { this.node = node; }}
        >
          { this.props.children }
          <AnchorIcon className={s.anchor} />
        </span>
      </Link>
    );
  }
}
