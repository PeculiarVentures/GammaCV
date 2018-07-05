import webpack from 'webpack'; // eslint-disable-line
import * as CONFIG from '../config';

const debug = require('./debug')('bundle');

/**
 * bundle
 * @param {object} config
 */
const bundle = config =>
  new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const _stats = stats.toJson();
      let bundleSize = 0;

      for (let i = 0; i < _stats.assets.length; i += 1) {
        debug(`Filename: ${_stats.assets[i].name}, size: ${_stats.assets[i].size}B`);
        bundleSize += _stats.assets[i].size;
      }
      debug(`> Build time: ${_stats.time}ms`);
      debug(`> Bundle size: ${bundleSize}B`);
      debug(`> Source bundled to ./${CONFIG.DST_PATH} directory`);

      return resolve();
    });
  });

export default bundle;
