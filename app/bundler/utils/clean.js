import rimraf from 'rimraf'; // eslint-disable-line

const debug = require('./debug')('clean');

/**
 * clean
 * The UNIX command rm -rf for node
 * @param {string} pattern - pattern for files
 * @param {object} options
 */
const clean = (pattern, options) =>
  new Promise((resolve, reject) =>
    rimraf(pattern, { glob: options }, (err, result) => {
      if (err) {
        reject(err);
        debug(`> Dir "${pattern}" cleared error - ${err}`);
        return false;
      }

      resolve(result);
      return debug(`> Dir cleared succesfully - "${pattern}" `);
    }));

export default clean;
