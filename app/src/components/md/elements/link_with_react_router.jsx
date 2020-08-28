import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Link - link component
 * @param {object} props
 * @return {ReactElement} markup
 */
const MDLink = (props) => {
  const { children, href, title } = props;

  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        title={title}
        className="text_primary"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={href}
      title={title}
      className="text_primary"
    >
      {children}
    </Link>
  );
};

/**
 * PropTypes
 * @type {{
 *  children: object
 *  href: string
 *  title: string
 * }}
 */
MDLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  title: PropTypes.string,
};

MDLink.defaultProps = {
  children: null,
  href: '',
  title: '',
};

export default MDLink;
