import path from 'path';
import webpack from 'webpack'; // eslint-disable-line
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // eslint-disable-line
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'; // eslint-disable-line
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'; // eslint-disable-line
import variables from '../../src/assets/variables';
import publicPath from '../utils/get_build_path';
import * as CONFIG from '../config';

const NO_SOURCE_MAP = process.argv.includes('--no-source-map');
const PUBLIC_PATH = publicPath ? `${publicPath}/` : '/';

export default {
  devtool: NO_SOURCE_MAP ? false : 'source-map',
  output: {
    path: path.join(__dirname, `../../${CONFIG.DST_PATH}`),
    filename: `[name]_${CONFIG.HASH}.js`,
    chunkFilename: `[name]_${CONFIG.HASH}.js`,
    publicPath: PUBLIC_PATH,
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CONFIG: JSON.stringify(CONFIG),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: false,
      async: true,
      minChunks: 3,
    }),
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        compress: {
          drop_console: true,
          unsafe: true,
          passes: 3,
        },
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new SWPrecacheWebpackPlugin({
      stripPrefix: path.join(__dirname, `../../${CONFIG.DST_PATH}/`),
      cacheId: 'app',
      filename: 'sw.js',
      navigateFallback: `${PUBLIC_PATH}index.html`,
      maximumFileSizeToCacheInBytes: 3000000,
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      minify: true,
      staticFileGlobsIgnorePatterns: [
        /\.map$/,
        /CNAME$/,
        new RegExp(CONFIG.BUILD_INFO_FILENAME),
      ],
      runtimeCaching: [{
        urlPattern: new RegExp('https://fonts.googleapis.com/'),
        handler: 'cacheFirst',
      }, {
        urlPattern: new RegExp('https://fonts.gstatic.com/'),
        handler: 'cacheFirst',
      }],
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, `../../${CONFIG.SRC_FOLDER}/assets/favicon/logo.png`),
      appName: CONFIG.APP_NAME,
      start_url: PUBLIC_PATH,
      path: PUBLIC_PATH,
      persistentCache: false,
      orientation: 'portrait',
      background: '#0d091a',
      theme_color: '#0d091a',
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
            options: {
              minimize: true,
            },
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
              modules: true,
              localIdentName: '[local]_[hash:base64:5]',
              minimize: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              data: variables,
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
              modules: true,
              localIdentName: '[local]_[hash:base64:5]',
              minimize: true,
            },
          },
        ],
      },
    ],
  },
};
