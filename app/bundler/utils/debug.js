const debug = require('debug'); // eslint-disable-line

module.exports = (processName) => {
  const log = debug(processName || '');

  return (value) => {
    log(value);
    console.log(`${processName}:`, value);
  };
};
