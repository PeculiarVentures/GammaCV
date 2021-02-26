const rawEnv = require('./compiled_env.json');

const env = (envName, defaultVal) => {
  if (!rawEnv[envName] && !defaultVal) { throw new Error(`Must Specify '${envName}'!`); }
  return rawEnv[envName] || defaultVal;
};

// ======== Static Build Configuration ========
const SRC_FOLDER = 'src';
const DST_PATH = 'dst';
const BUILD_INFO_FILENAME = 'build_info.json';

const BUILD_INFO = env('BUILD_INFO');
const HASH = env('HASH');
const PORT = env('PORT');
const URL = env('URL');

// ======== App ========
const APP_NAME = 'GammaCV';
const GIT_URL = env('GIT_URL', 'null') !== 'null' ? env('GIT_URL') : '';

// ======== Deployment Configuration ========
const AWS_DEPLOY_BUCKET_NAME = env('AWS_DEPLOY_BUCKET_NAME', 'null') !== 'null' ? env('AWS_DEPLOY_BUCKET_NAME') : '';
const AWS_DEPLOY_REGION = env('AWS_DEPLOY_REGION', 'null') !== 'null' ? env('AWS_DEPLOY_REGION') : '';

// ======== Config mode ========
const NODE_ENV = env('NODE_ENV');

// ======== Rollbar Key ========
const ROLLBAR_API_KEY = env('ROLLBAR_API_KEY', 'null') !== 'null' ? env('ROLLBAR_API_KEY') : '';

const GOOGLE_ANALYTICS = env('GOOGLE_ANALYTICS', 'null') !== 'null' ? env('GOOGLE_ANALYTICS') : '';

module.exports = {
  SRC_FOLDER,
  DST_PATH,
  BUILD_INFO_FILENAME,
  BUILD_INFO,
  HASH,
  PORT,
  URL,
  APP_NAME,
  GIT_URL,
  AWS_DEPLOY_BUCKET_NAME,
  AWS_DEPLOY_REGION,
  NODE_ENV,
  ROLLBAR_API_KEY,
  GOOGLE_ANALYTICS,
};
