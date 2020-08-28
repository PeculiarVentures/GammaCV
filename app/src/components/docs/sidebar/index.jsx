import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Typography, TextField } from 'lib-react-components';
import classNames from 'classnames';
import getPath from '../../../utils/get_build_path';
import filter from '../../../utils/filter_list';
import names from '../../../../_data/docs/names.json';
import s from './styles/index.sass';

const getRoute = (item) => {
  if (item.name) {
    return item.name.toLowerCase().split(' ').join('_');
  }

  const parsed = /(\w+)\/?((?=index.js)|\.js$)/.exec(item.path);

  if (parsed && parsed[1]) {
    return parsed[1];
  }

  return item.path.split(/[./]/).filter(a => a).join('_');
};

// const getSearchString = el => `\n${el}`;

export default class Sidebar extends Component {
  static propTypes = {
    docsList: PropTypes.arrayOf(PropTypes.object),
  };

  static contextTypes = {
    intl: PropTypes.object,
  };

  static defaultProps = {
    docsList: [],
  };

  state = {
    searchValue: '',
  }

  onSearch(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  clearSearhField(e) {
    if (e.keyCode === 27) {
      this.setState({
        searchValue: '',
      });
    }
  }

  renderGroupElement(item) {
    const { searchValue } = this.state;
    const chunks = (names[getRoute(item)] || item.name)
      .split(new RegExp(`(${searchValue})`, 'gi'));

    return (
      <NavLink
        to={`${getPath}/docs/${getRoute(item)}`}
        key={getRoute(item)}
        className={classNames(
          s.item,
          'text_black',
          'b2',
        )}
        // activeClassName={s.active_sub_link}
      >
        {chunks.map((chunk, index) => (chunk.toLowerCase() === searchValue.toLowerCase()
          ? <mark key={index} className="fill_secondary">{chunk}</mark> //eslint-disable-line
          : chunk))}
      </NavLink>
    );
  }

  renderGroup(el) {
    const { searchValue } = this.state;
    const filtered = filter(
      el.items,
      searchValue, e => `${names[getRoute(e)]}\n${e.name}`,
    );

    if (filtered.length) {
      return (
        <div className={s.sub_list} key={el.group}>
          <Typography
            color="grey"
            type="c1"
            className={s.title}
          >
            {el.group.toUpperCase()}
          </Typography>
          {filtered.map(item => this.renderGroupElement(item))}
        </div>
      );
    }

    return null;
  }

  renderContent() {
    const { searchValue } = this.state;
    const { docsList } = this.props;
    const { intl } = this.context;
    const list = docsList
      .map(el => this.renderGroup(el)).filter(item => item);

    if (!list.length) {
      return (
        <div className={classNames(s.sub_list, s.empty)}>
          <Typography
            color="grey"
            type="b3"
            align="center"
            className={classNames(s.title, s.search_value)}
          >
            {searchValue}
          </Typography>
          <Typography
            color="grey"
            type="b3"
            align="center"
            className={s.title}
          >
            {intl.getText('Operations.NoResults')}
          </Typography>
        </div>
      );
    }

    return list.map(el => el);
  }

  render() {
    const { intl } = this.context;
    const { searchValue } = this.state;

    return (
      <div className={classNames(s.sidebar_wrapper)}>
        <div className={s.search_container}>
          <TextField
            onChange={this.onSearch.bind(this)}
            onKeyDown={this.clearSearhField.bind(this)}
            color="light_grey"
            value={searchValue}
            className={s.search_field}
            size="large"
            placeholder={intl.getText('Operations.Search')}
            inputProps={{
              style: {
                borderRadius: 20,
                height: 40,
                padding: '0 20px',
              },
            }}
          />
        </div>
        <div className={s.nav}>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}
