import React from 'react';
import PropTypes from 'prop-types';

/**
 * TableRaw - table raw component
 * @param {object} props
 * @return {ReactElement} markup
 */
const TableRaw = (props) => {
  const { children } = props;

  return (
    <tr>
      {children}
    </tr>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 * }}
 */
TableRaw.propTypes = {
  children: PropTypes.node,
};

TableRaw.defaultProps = {
  children: null,
};

export default TableRaw;
