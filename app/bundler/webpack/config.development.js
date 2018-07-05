import webpack from 'webpack'; // eslint-disable-line
import variables from '../../src/assets/variables';
import * as CONFIG from '../config';

export default {
  devtool: 'cheap-module-inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        CONFIG: JSON.stringify(CONFIG),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /.*basic_.*\.sass$/,
        use: [
          'style-loader',
          'css-loader',
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
            },
          },
        ],
      },
    ],
  },
};
