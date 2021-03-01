const pkg = require('../package.json');

module.exports = {
  env: {
    LIB_VERSION: pkg.version,
  },
};
