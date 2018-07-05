import React from 'react';
import uuid from '../../utils/uuid';

const a = uuid();
const b = uuid();
const c = uuid();

export default function SimpleLogo(props) {
  return (
    <svg viewBox="0 0 29 37" {...props}>
      <defs>
        <linearGradient x1="50.019%" y1="100.006%" x2="50.019%" y2="0%" id={a}>
          <stop stopColor="#6C57B0" offset="1%" />
          <stop stopColor="#6F59B4" offset="8%" />
          <stop stopColor="#775DC1" offset="16%" />
          <stop stopColor="#8465D7" offset="25%" />
          <stop stopColor="#966FF3" offset="33%" />
          <stop stopColor="#9D6EEC" offset="43%" />
          <stop stopColor="#B06DD9" offset="59%" />
          <stop stopColor="#CF6BB9" offset="77%" />
          <stop stopColor="#F9678E" offset="97%" />
          <stop stopColor="#FF6788" offset="100%" />
        </linearGradient>
        <linearGradient x1="8.809%" y1="95.333%" x2="106.381%" y2="3.747%" id={b}>
          <stop stopColor="#7B68BA" offset="0%" />
          <stop stopColor="#7C68BD" offset="27%" />
          <stop stopColor="#7F6AC8" offset="51%" />
          <stop stopColor="#856CDA" offset="74%" />
          <stop stopColor="#8D6FF4" offset="95%" />
          <stop stopColor="#8F70FA" offset="100%" />
        </linearGradient>
        <linearGradient x1="0%" y1="50.015%" y2="50.015%" id={c}>
          <stop stopColor="#8F70FA" offset="0%" />
          <stop stopColor="#7383E6" offset="11%" />
          <stop stopColor="#4A9EC8" offset="31%" />
          <stop stopColor="#2AB4B1" offset="50%" />
          <stop stopColor="#13C3A0" offset="68%" />
          <stop stopColor="#05CD96" offset="85%" />
          <stop stopColor="#00D093" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path d="M10.69 35.854c5.375-3.156 7.404-10.828 7.404-17.096 0-7.4-3.052-12.626-8.172-15.913C7.375 1.215 4.042.157 1.008.157v2.596c3.925.537 7.333 3.115 9.128 6.49 1.38 2.597 1.997 5.652 1.997 8.593 0 3.149-.584 6.83-1.59 9.57C9.406 30.503 6.99 34.54 3.7 34.54c-1.278 0-2.556-.484-3.362-1.356a5.892 5.892 0 0 0 3.58 3.442c2.116.717 4.85.36 6.773-.773z" fill={`url(#${a})`} />
        <path d="M.03 29.428c.162 1.876 1.11 3.958 3.548 3.958.982 0 1.468-.344 1.468-.344s-3.034-3.248 5.83-12.991c.079-.738.116-1.479.11-2.22a19 19 0 0 0-.607-4.838c-2.079 2.186-3.908 4.184-5.104 5.652C2.691 21.82-.325 25.349.03 29.428z" fill={`url(#${b})`} />
        <path d="M16.94 8.725c.523.991.955 2.028 1.291 3.098C23.073 6.469 27.876 1.205 29.041 0h-5.805c-1.93 2.005-4.635 4.555-7.217 7.188.332.497.64 1.01.92 1.537z" fill={`url(#${c})`} />
        <path d="M10.38 12.998c.514 1.881.637 3.454.603 5.435-.008.499-.06 1.122-.106 1.621-.797.909-2.118 2.41-2.811 3.376.245-1.42.367-2.86.364-4.302a21.124 21.124 0 0 0-.342-3.686l2.293-2.444z" opacity=".2" fill="#000" />
      </g>
    </svg>
  );
}
