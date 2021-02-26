const path = require('path');
require('./compile_enviropment');
const { DST_PATH, URL, PORT } = require('./config');
const makeConfig = require('./webpack/make');
const runServer = require('./server');
const { clean, bundle } = require('./utils');
const prepareTheme = require('./utils/prepare_theme');
const debug = require('./utils/debug')('app:run');

const MODE = process.env.NODE_ENV;
const CONFIG = makeConfig(MODE);
const CLEAR = process.argv.includes('--clear');
const TEST = process.argv.includes('--test');
const DIST_DIRECTORY = path.join(__dirname, `../${DST_PATH}`);

if (CLEAR || TEST) {
  if (CLEAR) {
    clean(DIST_DIRECTORY);
  }
} else {
  if (MODE === 'development') {
    clean(DIST_DIRECTORY)
      .then(() => prepareTheme('gc', path.resolve(__dirname, '../node_modules/.cache/themes')))
      .then(() => runServer(MODE, CONFIG))
      .then(() => {
        debug('>');
        debug(`> Development Server Running on - ${URL}:${PORT}`);
        debug('>');
        debug('>');
      });
  }

  if (MODE === 'production' || MODE === 'build') {
    clean(DIST_DIRECTORY)
      .then(() => prepareTheme('gc', path.resolve(__dirname, '../node_modules/.cache/themes')))
      .then(() => bundle(CONFIG))
      .catch((error) => {
        console.log(error);

        process.exit(1);
      });
  }

  if (MODE === 'server') {
    prepareTheme('gc', path.resolve(__dirname, '../node_modules/.cache/themes'))
      .then(() => runServer(MODE, CONFIG))
      .then(() => {
        debug('>');
        debug(`> Production Server Running on - ${URL}:${PORT}`);
        debug('>');
        debug('>');
      });
  }
}
