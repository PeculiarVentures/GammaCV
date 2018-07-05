import React from 'react';

export default function CrossIcon(props) {
  return (
    <svg width="11" height="11" {...props}>
      <defs>
        <path d="M7.978 7.054h5.414a.5.5 0 1 1 0 1H7.978v5.428a.5.5 0 1 1-1 0V8.054H1.392a.5.5 0 1 1 0-1h5.586V1.482a.5.5 0 1 1 1 0v5.572z" id="a_cross" />
      </defs>
      <use data-fill transform="rotate(45 8.807 4.068)" xlinkHref="#a_cross" fillRule="evenodd" />
    </svg>
  );
}
