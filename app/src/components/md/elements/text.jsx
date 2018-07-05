import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'lib-react-components';
import HashLink from '../../hash_link';

const supportedTypes = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'b1',
  'strong',
  'i',
  'blockquote',
  '',
  'code',
];

/**
 * Text - text component
 * @param {object} props
 * @return {ReactElement} markup
 */
const Text = (props, { theme }) => {
  const { children, type } = props;

  if (type === 'strong'
    || type === 'i'
    || type === 'blockquote'
    || type === 'code'
  ) {
    const prs = {};

    if (type === 'blockquote') {
      prs.className = theme.fill_light_grey;
    }

    if (type === 'code') {
      prs.className = theme.fill_light_grey;
      prs.style = {
        padding: '0px 7px',
        display: 'inline-block',
        borderRadius: '3px',
      };
    }

    return React.createElement(type, prs, children);
  }

  if (/h\d/.test(type) && Array.isArray(children) && typeof children[0] === 'string') {
    return (
      <Typography type={type || 'b1'}>
        <HashLink smooth to={`#${children[0]}`}>
          {children}
        </HashLink>
      </Typography>
    );
  }

  return (
    <Typography type={type || 'b1'}>
      {children}
    </Typography>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 *  type: string
 * }}
 */
Text.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(supportedTypes),
};

Text.defaultProps = {
  children: null,
  type: '',
};

Text.contextTypes = {
  theme: PropTypes.object,
};

export default Text;
