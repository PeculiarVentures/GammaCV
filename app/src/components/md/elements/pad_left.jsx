import React from 'react';
import PropTypes from 'prop-types';

/**
 * PadLeft - padding left component
 * @param {object} props
 * @return {ReactElement} markup
 */
const PadLeft = (props) => {
  const { children } = props;

  return (
    <div className="pad_left">
      {children}
    </div>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 * }}
 */
PadLeft.propTypes = {
  children: PropTypes.node,
};

PadLeft.defaultProps = {
  children: null,
};

export default PadLeft;
