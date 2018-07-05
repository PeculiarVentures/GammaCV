import path from 'path';
import express from 'express'; // eslint-disable-line
import webpack from 'webpack'; // eslint-disable-line
import compression from 'compression'; // eslint-disable-line
import WebpackDevServer from 'webpack-dev-server'; // eslint-disable-line
import * as CONFIG from '../config'; // eslint-disable-line

export default (mode, config) => {
  if (mode === 'development') {
    return new Promise((resolve, reject) => {
      new WebpackDevServer(webpack(config), {
        publicPath: '/',
        hot: true,
        historyApiFallback: true,
        stats: {
          colors: true,
          reasons: false,
          hash: false,
          version: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          cached: false,
          cachedAssets: false,
        },
      }).listen(CONFIG.PORT, '0.0.0.0', (err, result) => {
        if (err) {
          return reject(err);
        }

        console.log(`Listening at ${CONFIG.URL}:${CONFIG.PORT}`);
        return resolve(result);
      });
    });
  }

  const app = express();

  app.use(compression());
  app.use(express.static(path.join(__dirname, `../../${CONFIG.DST_PATH}`)));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, `../../${CONFIG.DST_PATH}/index.html`));
  });

  return new Promise((resolve, reject) => {
    app.listen(CONFIG.PORT, err => (err ? reject(err) : resolve()));
  });
};
