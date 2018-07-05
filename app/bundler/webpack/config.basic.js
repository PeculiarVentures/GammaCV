import path from 'path';
import GenerateJsonPlugin from 'generate-json-webpack-plugin'; // eslint-disable-line
import CopyWebpackPlugin from 'copy-webpack-plugin'; // eslint-disable-line
import * as CONFIG from '../config';
import InitShells from './init_shells';

const debug = require('../utils/debug')('webpack:basic');

export default (mode) => {
  debug(`Building webpack config in mode - '${mode}'`);

  return {
    cache: mode === 'development',
    plugins: [
      ...InitShells(),
      new GenerateJsonPlugin(CONFIG.BUILD_INFO_FILENAME, {
        buildInfo: CONFIG.BUILD_INFO,
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, `../../${CONFIG.SRC_FOLDER}/assets/static`),
          to: './assets',
        },
      ]),
    ],
    output: {
      path: path.join(__dirname, `../../${CONFIG.SRC_FOLDER}`),
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
          test: /\.json?$/,
          use: ['json-loader'],
        },
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
                ['env', { modules: false }],
                'stage-0',
                'react',
              ],
              plugins: ['transform-runtime'],
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
