const fs = require('fs');

/**
 * Check directory existing and create if not.
 * @param {string} path
 * @return {Promise.<void>}
 */
function checkDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

module.exports = {
  checkDir,
};
