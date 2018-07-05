import React from 'react';

const Noscript = () => (
  <div
    style={{
      position: 'fixed',
      width: '100%',
      height: '100%',
      background: '#fff',
    }}
  >
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>
        Looks like Javascript is disabled.
      </h1>
      <p
        style={{
          paddingTop: 10,
        }}
      >
        We use Javascript to provide a rich, interactive and secure user experience. Turn Javascript on and try again. <a href="https://enable-javascript.com" rel="noopener noreferrer" target="_blank">Learn more.</a>
      </p>
    </div>
  </div>
);

export default Noscript;
