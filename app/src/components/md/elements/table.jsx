import React from 'react';
import PropTypes from 'prop-types';
import * as TYPES from '../types';
import * as s from './styles/index.sass';

function fixAlign(align, list) {
  return React.cloneElement(list, {
    ...list.props,
    data: {
      ...list.props.data,
      children: list.props.data.children.map((el, key) => ({
        ...el,
        align: align[key] || '',
      })),
    },
  });
}

/**
 * Table - table component
 * @param {object} props
 * @return {ReactElement} markup
 */
const Table = (props) => {
  const { children, align } = props;
  const head = [];
  const body = [];

  children.forEach((e) => {
    const type = e.props.data.type;

    if (type === TYPES.TABLE_HEAD_RAW) {
      return head.push(fixAlign(align, e));
    }
    return body.push(fixAlign(align, e));
  });

  return (
    <table className={s.table}>
      {head.length && (
        <thead>
          {head}
        </thead>
      )}
      {body.length && (
        <tbody>
          {body}
        </tbody>
      )}
    </table>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 * }}
 */
Table.propTypes = {
  children: PropTypes.node,
  align: PropTypes.arrayOf(PropTypes.any),
};

Table.defaultProps = {
  children: null,
  align: [],
};

export default Table;
