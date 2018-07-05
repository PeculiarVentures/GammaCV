import React from 'react';
import PropTypes from 'prop-types';
import { ProgressiveImage } from 'lib-react-components';

/**
 * Image - image component
 * @param {object} props
 * @return {ReactElement} markup
 */
const Image = (props) => {
  const { alt, href, title } = props;

  return (
    <ProgressiveImage
      src={href}
    >
      {(src, loading) => (
        <img
          src={src}
          alt={alt}
          title={title}
          style={{
            display: 'block',
            filter: loading ? 'blur(5px)' : 'none',
          }}
        />
      )}
    </ProgressiveImage>
  );
};

/**
 * PropTypes
 * @type {{
 *  alt: string
 *  href: string
 *  title: string
 * }}
 */
Image.propTypes = {
  alt: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.string,
};

Image.defaultProps = {
  alt: '',
  href: '',
  title: '',
};

export default Image;
