import path from 'path';
import './compile_enviropment';
import { DST_PATH, URL, PORT } from './config';
import makeConfig from './webpack/make';
import runServer from './server';
import { clean, bundle } from './utils';

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
    clean(DIST_DIRECTORY).then(() => {
      runServer(MODE, CONFIG).then(() => {
        debug('>');
        debug(`> Development Server Running on - ${URL}:${PORT}`);
        debug('>');
        debug('>');
      });
    });
  }

  if (MODE === 'production' || MODE === 'build') {
    clean(DIST_DIRECTORY).then(() => bundle(CONFIG));
  }

  if (MODE === 'server') {
    runServer(MODE, CONFIG).then(() => {
      debug('>');
      debug(`> Production Server Running on - ${URL}:${PORT}`);
      debug('>');
      debug('>');
    });
  }
}
