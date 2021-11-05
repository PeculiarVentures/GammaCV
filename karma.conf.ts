process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
      basePath: '',
      frameworks: ["mocha", "karma-typescript"],

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
      ],

      browsers: ['ChromeHeadlessWithGPU'],

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

      singleRun: !!process.env.SINGLE_RUN,
      karmaTypescriptConfig: {
        tsconfig: "./tsconfig.test.json",
      },
  });
};