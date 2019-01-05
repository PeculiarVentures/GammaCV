import path from 'path';
import ShellBundler from '../utils/shell_bundler';
import APP_CONFIG from '../../app_config.js';
import * as CONFIG from '../config';

const NODE_ENV = process.env.NODE_ENV;
const plugins = [];
const { shells } = APP_CONFIG;

if (shells) {
  for (const name of shells) {
    const pathToShellDir = `../../${CONFIG.SRC_FOLDER}/shells/${name}`;
    const config = require(pathToShellDir).default; // eslint-disable-line
    const { templates } = config;
    const templatesWithFullPath = Object.assign({}, templates);

    Object.keys(templatesWithFullPath).forEach((t) => {
      templatesWithFullPath[t] = path.join(__dirname, pathToShellDir, templatesWithFullPath[t]);
    });

    if (name === 'index') {
      plugins.push(new ShellBundler({
        templatesEntry: templatesWithFullPath,
        cssToProps: true,
        props: {
          title: CONFIG.APP_NAME,
          initServiceWorker: false,
          initRollbar: NODE_ENV !== 'development' && !!CONFIG.ROLLBAR_API_KEY,
          initAnalytics: NODE_ENV !== 'development' && !!CONFIG.GOOGLE_ANALYTICS,
          disableReactDevTools: NODE_ENV !== 'development',
        },
      }));
    } else {
      plugins.push(new ShellBundler({
        templatesEntry: templatesWithFullPath,
        outputPathName: `shells/${name}/`,
        doctype: false,
      }));
    }
  }
}

export default () => plugins;
