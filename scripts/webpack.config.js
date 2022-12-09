import path from 'path';

export default {
  cache: true,
  devtool: 'cheap-module-source-map',
  resolve: {
    modules: [path.join(__dirname, '../node_modules')],
    extensions: ['.js', '.jsx'],
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
        test: /\.(js|jsx|jss)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', { modules: false }],
            ],
            plugins: ['@babel/plugin-transform-runtime'],
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
