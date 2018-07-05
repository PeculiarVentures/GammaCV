import React from 'react';
import PropTypes from 'prop-types';

/**
 * TableCell - table cell component
 * @param {object} props
 * @return {ReactElement} markup
 */
const TableCell = (props) => {
  const { children, head, align } = props;

  return React.createElement(head ? 'th' : 'td', { style: { textAlign: align || '' } }, children);
};

/**
 * PropTypes
 * @type {{
 *  children: object
 *  head: boolean
 * }}
 */
TableCell.propTypes = {
  children: PropTypes.node,
  head: PropTypes.bool,
  align: PropTypes.string,
};

TableCell.defaultProps = {
  children: null,
  head: false,
  align: '',
};

export default TableCell;
