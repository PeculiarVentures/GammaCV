import * as CONFIG from '../../bundler/config';

const IS_PROD = CONFIG.NODE_ENV === 'production';

/**
 * General purpose error reporter.
 * @param err The error object.
 * @param ctx The additional context to report.
 */
export default function reportError(err, ctx) {
  if (!err) return null;

  if (!IS_PROD || !window.rollbar) {
    return console.error(err);
  }

  return new Promise(resolve => window.rollbar.error(err, ctx, resolve));
}
