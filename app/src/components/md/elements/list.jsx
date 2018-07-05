import React from 'react';
import PropTypes from 'prop-types';

/**
 * List - list component
 * @param {object} props
 * @return {ReactElement} markup
 */
const List = (props) => {
  const { ordered, children } = props;

  return React.createElement(ordered ? 'ol' : 'ul', {}, children);
};

/**
 * PropTypes
 * @type {{
 *  children: object
 *  ordered: boolean
 * }}
 */
List.propTypes = {
  children: PropTypes.node,
  ordered: PropTypes.bool,
};

List.defaultProps = {
  children: null,
  ordered: false,
};

export default List;
