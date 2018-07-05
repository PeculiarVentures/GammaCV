import React from 'react';

export default function FastIcon(props) {
  return (
    <svg viewBox="0 0 40 27" {...props}>
      <defs>
        <linearGradient x1="78.508%" y1="76.793%" x2="-26.669%" y2="35.871%" id="a_fast">
          <stop stopColor="#8F70FA" offset="1%" />
          <stop stopColor="#B26DD7" offset="28%" />
          <stop stopColor="#E9699E" offset="77%" />
          <stop stopColor="#FF6788" offset="100%" />
        </linearGradient>
        <linearGradient x1="78.557%" y1="76.793%" x2="-26.669%" y2="35.871%" id="b_fast">
          <stop stopColor="#8F70FA" offset="0%" />
          <stop stopColor="#00D093" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path d="M17.376 12.02L2.83.382A1.742 1.742 0 0 0 0 1.742v23.272a1.742 1.742 0 0 0 2.83 1.359l14.546-11.636a1.742 1.742 0 0 0 0-2.718z" fill="url(#a_fast)" />
        <path d="M38.715 12.02L24.169.382a1.742 1.742 0 0 0-2.83 1.359v23.272a1.742 1.742 0 0 0 2.83 1.359l14.546-11.636a1.742 1.742 0 0 0 0-2.718z" fill="url(#b_fast)" />
      </g>
    </svg>
  );
}
