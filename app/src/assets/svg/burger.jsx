import React from 'react';

export default function BurgerIcon(props) {
  return (
    <svg viewBox="0 0 20 12" {...props}>
      <g fill="#FFF" fillRule="evenodd">
        <rect width="20" height="1" rx=".5" />
        <rect y="11" width="20" height="1" rx=".5" />
      </g>
    </svg>
  );
}
