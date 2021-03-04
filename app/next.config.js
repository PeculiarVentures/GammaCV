const pkg = require('../package.json');

module.exports = {
  env: {
    LIB_VERSION: pkg.version,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'markdown-loader',
        },
      ],
    });

    return config;
  },
};
