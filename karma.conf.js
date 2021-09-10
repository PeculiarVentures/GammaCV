const webpackConfig = require('./scripts/webpack.config.js').default;

module.exports = function makeConfig(config) {
  config.set({
    browsers: ['ChromeHeadlessWithGPU'],
    frameworks: ['mocha'],
    singleRun: !!process.env.SINGLE_RUN,
    preprocessors: {
      './test/**/*.js': ['webpack'],
    },
    files: [
      './test/**/*.spec.js',
    ],
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-chrome-launcher',
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
      logLevel: 'error',
    },
    customLaunchers: {
      ChromeHeadlessWithGPU: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--hide-scrollbars',
          '--mute-audio',
        ],
      },
    },
    logLevel: config.LOG_WARN,
  });
};
