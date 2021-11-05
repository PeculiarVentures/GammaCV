process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function makeConfig(config) {
  config.set({
    basePath: '../',
    frameworks: ["mocha", "karma-typescript", 'detectBrowsers'],

    files: [
      {
        pattern: 'test/**/*.spec.ts',
        type: 'js',
      },
      {
        pattern: 'lib/**/*.ts',
        type: 'js',
      },
      {
        pattern: 'test/**/*.ts',
        type: 'js',
      },
      {
        pattern: 'test/assets/*.*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      }
    ],

    preprocessors: {
        "lib/**/*.ts": ["karma-typescript"],
        "test/**/*.ts": ["karma-typescript"],
    },

    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-typescript',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-safari-launcher',
      'karma-safaritechpreview-launcher',
      'karma-opera-launcher',
      'karma-phantomjs-launcher',
      'karma-detect-browsers',
    ],

    logLevel: config.LOG_WARN,

    singleRun: !!process.env.SINGLE_RUN,
    karmaTypescriptConfig: {
      tsconfig: "../tsconfig.test.json",
    },
  });
};
