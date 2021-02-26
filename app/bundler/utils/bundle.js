const webpack = require('webpack'); // eslint-disable-line
const CONFIG = require('../config');
const debug = require('./debug')('bundle');

/**
 * bundle
 * @param {object} config
 */
module.exports = config =>
  new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        return reject(info.errors);
      }

      let bundleSize = 0;

      for (let i = 0; i < info.assets.length; i += 1) {
        debug(`Filename: ${info.assets[i].name}, size: ${info.assets[i].size}B`);
        bundleSize += info.assets[i].size;
      }
      debug(`> Build time: ${info.time}ms`);
      debug(`> Bundle size: ${bundleSize}B`);
      debug(`> Source bundled to ./${CONFIG.DST_PATH} directory`);

      return resolve();
    });
  });
