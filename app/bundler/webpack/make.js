const path = require('path');
const developmentConfig = require('./config.development');
const productionConfig = require('./config.production');
const makeBasicConfig = require('./config.basic');
const APP_CONFIG = require('../../app_config.js');
const CONFIG = require('../config');

module.exports = (mode) => {
  const basicConfig = makeBasicConfig(mode);
  const { source } = APP_CONFIG;
  const entry = {};

  if (mode === 'development') {
    source.forEach((e) => {
      if (e.name === 'index') {
        entry[e.name] = [
          `webpack-dev-server/client?${CONFIG.URL}:${CONFIG.PORT}`,
          'webpack/hot/only-dev-server',
          path.join(__dirname, '../../', CONFIG.SRC_FOLDER, e.path),
        ];
      } else {
        entry[e.name] = [
          path.join(__dirname, '../../', CONFIG.SRC_FOLDER, e.path),
        ];
      }
    });
    if (developmentConfig.plugins) {
      developmentConfig.plugins.map(plugin => basicConfig.plugins.push(plugin));
    }
    if (developmentConfig.module) {
      developmentConfig.module.rules.map(loader => basicConfig.module.rules.push(loader));
    }
    basicConfig.devtool = developmentConfig.devtool;
    basicConfig.cache = developmentConfig.cache;
  } else {
    source.forEach((e) => {
      entry[e.name] = [
        path.join(__dirname, '../../', CONFIG.SRC_FOLDER, e.path),
      ];
    });
    if (productionConfig.plugins) {
      productionConfig.plugins.map(plugin => basicConfig.plugins.push(plugin));
    }
    if (productionConfig.module) {
      productionConfig.module.rules.map(loader => basicConfig.module.rules.push(loader));
    }
    basicConfig.devtool = productionConfig.devtool;
    basicConfig.cache = developmentConfig.cache;
    if (productionConfig.output) {
      basicConfig.output = productionConfig.output;
    }
  }

  basicConfig.entry = entry;

  return basicConfig;
};
