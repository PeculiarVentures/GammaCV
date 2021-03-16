const pkg = require('../package.json');
const path = require('path');

module.exports = {
  env: {
    LIB_VERSION: pkg.version,
  },
  sassOptions: {
    prependData: `@import ${path.join(__dirname, './variables/_mixins.sass')}`,
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
    );

    return config;
  },
};
