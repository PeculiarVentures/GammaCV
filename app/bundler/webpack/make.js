import path from 'path';
import developmentConfig from './config.development';
import productionConfig from './config.production';
import makeBasicConfig from './config.basic';
import APP_CONFIG from '../../app_config.js';
import * as CONFIG from '../config';

export default (mode) => {
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
