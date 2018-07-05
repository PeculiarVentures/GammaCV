import React from 'react';
import PropTypes from 'prop-types';

/**
 * ListItem - list item component
 * @param {object} props
 * @return {ReactElement} markup
 */
const ListItem = (props) => {
  const { children } = props;

  return (
    <li>
      {children}
    </li>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 * }}
 */
ListItem.propTypes = {
  children: PropTypes.node,
};

ListItem.defaultProps = {
  children: null,
};

export default ListItem;
