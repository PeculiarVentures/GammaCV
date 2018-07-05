import React from 'react';

export default function CrossPlatform(props) {
  return (
    <svg viewBox="0 0 50 33" {...props}>
      <defs>
        <linearGradient x1="3.622%" y1="101.533%" x2="84.356%" y2="-19.567%" id="a_cross_platform">
          <stop stopColor="#8F70FA" offset="0%" />
          <stop stopColor="#00D093" offset="100%" />
        </linearGradient>
        <linearGradient x1="-6.6%" y1="87.733%" x2="106.6%" y2="12.267%" id="b_cross_platform">
          <stop stopColor="#8F70FA" offset="0%" />
          <stop stopColor="#00D093" offset="100%" />
        </linearGradient>
        <linearGradient x1="-3.3%" y1="92.64%" x2="88.75%" y2="19%" id="c_cross_platform">
          <stop stopColor="#8F70FA" offset="1%" />
          <stop stopColor="#B26DD7" offset="28%" />
          <stop stopColor="#E9699E" offset="77%" />
          <stop stopColor="#FF6788" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path d="M27.225 14.025a3.3 3.3 0 0 1 3.3-3.3h6.6V1.65A1.65 1.65 0 0 0 35.475 0H1.65A1.65 1.65 0 0 0 0 1.65V23.1c0 .911.739 1.65 1.65 1.65h25.575V14.025z" fill="url(#a_cross_platform)" />
        <rect fill="url(#b_cross_platform)" x="41.25" y="8.25" width="8.25" height="12.375" rx="2" />
        <path d="M42.9 22.275a3.3 3.3 0 0 1-3.3-3.3v-6.6h-9.075a1.65 1.65 0 0 0-1.65 1.65V31.35c0 .911.739 1.65 1.65 1.65h13.2a1.65 1.65 0 0 0 1.65-1.65v-9.075H42.9z" fill="url(#c_cross_platform)" />
      </g>
    </svg>
  );
}
