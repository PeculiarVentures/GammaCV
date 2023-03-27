import webpackConfig from './scripts/webpack.config.js';

const isMacOnArm = process.platform === 'darwin' && process.arch === 'arm64';

export default function makeConfig(config) {
  config.set({
    browsers: isMacOnArm
      ? ['ChromeHeadlessWithGPUonMacARM']
      : ['ChromeHeadlessWithGPU'],
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
      ChromeHeadlessWithGPUonMacARM: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--remote-debugging-port=9222',
          '--use-angle=metal',
          '--ignore-gpu-blocklist',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--hide-scrollbars',
          '--mute-audio',
        ],
      },
    },
    logLevel: config.LOG_WARN,
  });
}
