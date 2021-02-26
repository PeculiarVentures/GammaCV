import { AppController } from 'lib-pwa-engine';
import * as dataSource from './controllers/datasource';
import CONFIG from '../app_config.js';

const app = new AppController(CONFIG, dataSource);

if (process.env.NODE_ENV === 'development') {
  window.appController = app;
}

export default app;

