const rawEnv = require('./compiled_env.json');

const env = (envName, defaultVal) => {
  if (!rawEnv[envName] && !defaultVal) { throw new Error(`Must Specify '${envName}'!`); }
  return rawEnv[envName] || defaultVal;
};

// ======== Static Build Configuration ========
export const SRC_FOLDER = 'src';
export const DST_PATH = 'dst';
export const BUILD_INFO_FILENAME = 'build_info.json';

export const BUILD_INFO = env('BUILD_INFO');
export const HASH = env('HASH');
export const PORT = env('PORT');
export const URL = env('URL');

// ======== App ========
export const APP_NAME = 'GammaCV';
export const GIT_URL = env('GIT_URL', 'null') !== 'null' ? env('GIT_URL') : '';

// ======== Deployment Configuration ========
export const AWS_DEPLOY_BUCKET_NAME = env('AWS_DEPLOY_BUCKET_NAME', 'null') !== 'null' ? env('AWS_DEPLOY_BUCKET_NAME') : '';
export const AWS_DEPLOY_REGION = env('AWS_DEPLOY_REGION', 'null') !== 'null' ? env('AWS_DEPLOY_REGION') : '';

// ======== Config mode ========
export const NODE_ENV = env('NODE_ENV');

// ======== Rollbar Key ========
export const ROLLBAR_API_KEY = env('ROLLBAR_API_KEY', 'null') !== 'null' ? env('ROLLBAR_API_KEY') : '';

export const GOOGLE_ANALYTICS = env('GOOGLE_ANALYTICS', 'null') !== 'null' ? env('ROLLBAR_API_KEY') : '';
