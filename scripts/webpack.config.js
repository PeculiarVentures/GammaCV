import path from 'path';

export default {
  cache: true,
  devtool: 'cheap-module-inline-source-map',
  resolve: {
    modules: [path.join(__dirname, '../node_modules')],
    extensions: ['.ts', '.tsx'],
    alias: {
      uuid: path.join(__dirname, '../app/src/utils/uuid'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg|gif|mp4|webm|ogg)$/,
        use: ['url-loader'],
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
