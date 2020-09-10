import React, { Component } from 'react';
import { Typography, TextField } from 'lib-react-components';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import filter from '../../utils/filter_list';
import getPath from '../../utils/get_build_path';
import Grid from '../grid';
import s from './styles/index.sass';

export default class Examples extends Component {
  static propTypes = {
    className: PropTypes.string,
    examples: PropTypes.arrayOf(PropTypes.object),
  };

  static contextTypes = {
    intl: PropTypes.object,
  };

  static defaultProps = {
    examples: {},
    className: '',
  };

  state = {
    searchValue: '',
  }

  onSearch(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  getSearchString (el) { //eslint-disable-line
    return (`
      \n${el.name}
      \n${el.type}
    `);
  }

  clearSearhField(e) {
    if (e.keyCode === 27) {
      this.setState({
        searchValue: '',
      });
    }
  }

  renderGroupElement(item) { //eslint-disable-line
    const { searchValue } = this.state;

    return (
      <Link
        key={item.path}
        to={`${getPath}/examples/${item.path}`}
      >
        <div>
          <Typography
            type="c1"
            color="grey"
            style={{ textTransform: 'capitalize' }}
          >
            {item.type}
          </Typography>
          {this.highlightSearchQuery(item.name, searchValue)}
        </div>
      </Link>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  highlightSearchQuery(text, query) {
    const chunks = text.split(new RegExp(`(${query})`, 'gi'));

    return (
      <Typography
        type="b2"
        color="dark_grey"
      >
        {chunks.map((chunk, index) => (chunk.toLowerCase() === query.toLowerCase()
          ? <mark key={index} className="fill_secondary">{chunk}</mark> //eslint-disable-line
          : chunk))}
      </Typography>
    );
  }

  renderGroup(el) { //eslint-disable-line
    return (
      <div
        key={el.key}
        className={s.group_item}
      >
        {!!el.examples.length && (
          <Typography
            className={s.group_name}
            type="c1"
            color="grey"
          >
            {el.name}
          </Typography>
        )}
        <Grid>
          {el.examples.map(item => this.renderGroupElement(item))}
        </Grid>
      </div>
    );
  }

  renderEmpty() { //eslint-disable-line
    return (
      <Typography
        type="h5"
        color="black"
        style={{ marginTop: '50px' }}
        align="center"
      >
        Nothing found
      </Typography>
    );
  }

  render() {
    const { intl } = this.context;
    const { searchValue } = this.state;
    const { examples, className } = this.props;

    const els = [];
    examples.forEach((group) => {
      const items = filter(group.examples, searchValue, this.getSearchString.bind(this));

      if (items.length) {
        els.push({
          ...group,
          examples: items,
        });
      }
    });

    return (
      <div id="wrapper" className={classNames(s.wrapper, className)}>
        <div className={s.upper_block}>
          <div className={s.title_block}>
            <Typography
              type="h3"
              color="black"
            >
              {intl.getText('Examples.Title')}
            </Typography>
          </div>
          <TextField
            onChange={this.onSearch.bind(this)}
            onKeyDown={this.clearSearhField.bind(this)}
            color="light_grey"
            value={searchValue}
            className={s.search_field}
            inputProps={{ className: s.input }}
            size="large"
            placeholder={intl.getText('Examples.Search')}
          />
        </div>
        <div className={s.examples_list}>
          {!!els.length && els.map(el => this.renderGroup(el))}
          {!els.length && this.renderEmpty()}
        </div>
      </div>
    );
  }
}
