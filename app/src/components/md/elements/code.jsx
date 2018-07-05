import React from 'react';
import PropTypes from 'prop-types';
import { HighlightCode } from 'lib-react-components';

/**
 * Code - code component
 * @param {object} props
 * @return {ReactElement} markup
 */
const Code = (props) => {
  const { children, lang } = props;

  return (
    <HighlightCode className="highlight" lang={lang.toLowerCase()}>
      {children}
    </HighlightCode>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 *  lang: string
 * }}
 */
Code.propTypes = {
  children: PropTypes.node,
  lang: PropTypes.string,
};

Code.defaultProps = {
  children: null,
  lang: 'none',
};

export default Code;
