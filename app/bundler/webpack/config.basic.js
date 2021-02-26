const path = require('path');
const GenerateJsonPlugin = require('generate-json-webpack-plugin'); // eslint-disable-line
const CopyWebpackPlugin = require('copy-webpack-plugin'); // eslint-disable-line
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line
const CONFIG = require('../config');
const debug = require('../utils/debug')('webpack:basic');

module.exports = (mode) => {
  debug(`Building webpack config in mode - '${mode}'`);

  const htmlConfig = {
    template: path.join(__dirname, `../../${CONFIG.SRC_FOLDER}/index.ejs`),
    title: CONFIG.APP_NAME,
    /**
     * Error tracking.
     */
    INIT_ROLLBAR: CONFIG.NODE_ENV !== 'development' && !!CONFIG.ROLLBAR_API_KEY,
    ROLLBAR_API_KEY: CONFIG.ROLLBAR_API_KEY,
    /**
     * Analytics.
     */
    INIT_ANALYTICS: CONFIG.NODE_ENV !== 'development' && !!CONFIG.GOOGLE_ANALYTICS,
    GOOGLE_ANALYTICS: CONFIG.GOOGLE_ANALYTICS,
    /**
     * React.
     */
    DISABLE_REACT_DEV_TOOLS: CONFIG.NODE_ENV !== 'development',
  };

  return {
    mode: mode === 'development' ? 'development' : 'production',
    cache: mode === 'development',
    plugins: [
      new HtmlWebpackPlugin(htmlConfig),
      new HtmlWebpackPlugin({
        ...htmlConfig,
        filename: '404.html',
      }),
      new GenerateJsonPlugin(CONFIG.BUILD_INFO_FILENAME, {
        buildInfo: CONFIG.BUILD_INFO,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, `../../${CONFIG.SRC_FOLDER}/assets/static`),
            to: './',
          },
          {
            from: path.resolve(__dirname, '../../node_modules/.cache/themes/gc.css'),
            to: './assets/css/theme.css',
          },
        ],
      }),
    ],
    output: {
      path: path.join(__dirname, `../../${CONFIG.DST_PATH}`),
      filename: `[name]_${CONFIG.HASH}.js`,
      chunkFilename: `[name]_${CONFIG.HASH}.js`,
      publicPath: '/',
    },
    resolve: {
      modules: ['node_modules', path.join(__dirname, '../../node_modules')],
      extensions: ['.js', '.jsx', '.yaml'],
      alias: {
        uuid: path.join(__dirname, '../utils/uuid'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg|gif)$/,
          use: ['url-loader?limit=100001'],
        },
        {
          test: /\.yaml?$/,
          use: ['json-loader', 'yaml-loader'],
        },
        {
          test: /\.yaml2?$/,
          use: ['yaml-loader'],
        },
        {
          test: /\.(js|jsx|jss)$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
              ],
            },
          }],
        },
        {
          test: /\.(glsl|frag|vert)$/,
          loader: 'raw-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
};
