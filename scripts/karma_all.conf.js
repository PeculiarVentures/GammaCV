process.env.CHROME_BIN = require('puppeteer').executablePath();
const webpackConfig = require('./webpack.config.js').default;


module.exports = function makeConfig(config) {
  config.set({
    frameworks: ['detectBrowsers', 'mocha'],
    singleRun: !!process.env.SINGLE_RUN,
    preprocessors: {
      '../test/**/*.js': ['webpack'],
    },
    files: [
      '../test/**/*.spec.js',
    ],
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-safari-launcher',
      'karma-safaritechpreview-launcher',
      'karma-opera-launcher',
      'karma-phantomjs-launcher',
      'karma-detect-browsers',
    ],
    webpack: webpackConfig,
  });
};
