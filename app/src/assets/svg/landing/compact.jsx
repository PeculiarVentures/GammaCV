import React from 'react';

export default function CompactIcon(props) {
  return (
    <svg viewBox="0 0 36 39" {...props}>
      <defs>
        <linearGradient x1="-.004%" y1="50%" x2="100.004%" y2="50%" id="a_compact">
          <stop stopColor="#8F70FA" offset="1%" />
          <stop stopColor="#B26DD7" offset="28%" />
          <stop stopColor="#E9699E" offset="77%" />
          <stop stopColor="#FF6788" offset="100%" />
        </linearGradient>
        <linearGradient x1="24.107%" y1="75.83%" x2="76.822%" y2="24.529%" id="b_compact">
          <stop stopColor="#8F70FA" offset="1%" />
          <stop stopColor="#B26DD7" offset="28%" />
          <stop stopColor="#E9699E" offset="77%" />
          <stop stopColor="#FF6788" offset="100%" />
        </linearGradient>
        <linearGradient x1="-.004%" y1="49.968%" x2="100.004%" y2="49.968%" id="c_compact">
          <stop stopColor="#8F70FA" offset="0%" />
          <stop stopColor="#00D093" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path d="M35.56 27.034l-3.199-1.852a1.773 1.773 0 0 0-1.773 0l-10.813 6.204a3.545 3.545 0 0 1-3.546 0L5.416 25.182a1.773 1.773 0 0 0-1.773 0l-3.2 1.852a.886.886 0 0 0 0 1.534l16.673 9.625a1.773 1.773 0 0 0 1.772 0l16.673-9.625a.886.886 0 0 0 0-1.534z" fill="url(#a_compact)" />
        <path d="M35.56 11.399l-16.672 9.626a1.773 1.773 0 0 1-1.772 0L.443 11.399a.886.886 0 0 1 0-1.534L17.116.24a1.773 1.773 0 0 1 1.772 0l16.673 9.626a.886.886 0 0 1 0 1.534z" fill="url(#b_compact)" />
        <path d="M35.56 18.729l-3.65-2.127a1.773 1.773 0 0 0-1.774 0l-10.361 5.956a3.545 3.545 0 0 1-3.546 0L5.903 16.602a1.773 1.773 0 0 0-1.773 0L.443 18.729a.886.886 0 0 0 0 1.533l16.673 9.626a1.773 1.773 0 0 0 1.772 0l16.673-9.626a.886.886 0 0 0 0-1.533z" fill="url(#c_compact)" />
      </g>
    </svg>
  );
}
