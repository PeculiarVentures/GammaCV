const fs = require('fs-extra');

/**
 * Check directory existing and create if not.
 * @param {string} path
 * @return {Promise.<void>}
 */
async function checkDir(path) {
  if (!fs.existsSync(path)) {
    await fs.mkdir(path);
  }
}

module.exports = {
  checkDir,
};
