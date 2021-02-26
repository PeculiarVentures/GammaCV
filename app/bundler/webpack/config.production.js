const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const FaviconsWebpackPlugin = require('favicons-webpack-plugin'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line
const variables = require('../../src/assets/variables');
const publicPath = require('../utils/get_build_path');
const CONFIG = require('../config');

const NO_SOURCE_MAP = process.argv.includes('--no-source-map');
const PUBLIC_PATH = publicPath ? `${publicPath}/` : '/';

module.exports = {
  devtool: NO_SOURCE_MAP ? false : 'source-map',
  output: {
    path: path.join(__dirname, `../../${CONFIG.DST_PATH}`),
    filename: `[name]_${CONFIG.HASH}.js`,
    chunkFilename: `[name]_${CONFIG.HASH}.js`,
    publicPath: PUBLIC_PATH,
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        NODE_ENV: JSON.stringify('production'),
      },
      'process.env': JSON.stringify({
        CONFIG,
        NODE_ENV: JSON.stringify('production'),
      }),
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, `../../${CONFIG.SRC_FOLDER}/assets/favicon/logo.png`),
      mode: 'webapp',
      publicPath: PUBLIC_PATH,
      inject: true,
      favicons: {
        appName: CONFIG.APP_NAME,
        background: '#0d091a',
        theme_color: '#0d091a',
        orientation: 'portrait',
        start_url: PUBLIC_PATH,
        icons: {
          coast: false,
          yandex: false,
          firefox: false,
          windows: false,
        },
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /.*basic_.*\.sass$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          'sass-loader',
        ],
      },
      {
        test: /\.sass$/,
        exclude: /.*basic_.*\.sass$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: variables,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },
};
