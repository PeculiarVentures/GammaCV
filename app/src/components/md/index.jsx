import React from 'react';
import PropTypes from 'prop-types';
import Parser from './parser';
import s from './styles.sass';

const MDRenderer = props => (
  <div className={s.main}>
    {
      props.data.map((el, key) => (
        <Parser data={el} key={key} /> // eslint-disable-line
      ))
    }
  </div>
);

MDRenderer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

MDRenderer.defaultProps = {
  data: [],
};

export default MDRenderer;
