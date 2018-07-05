import ghPages from 'gh-pages';

const debug = require('./debug')('deploy:gh-pages');

/**
 * Deploy dir to gh-pages
 * @param {string} publishDir
 * Usage with Circle CI:
 *  - select your project in Circle CI.
 *  - click on the Project Settings link (it's a little picture of a gear wheel).
 *  - click on the Environmental Variables link underneath the "Build Settings"
 *    heading in the left hand menu.
 *  - click on the "Add Variable" button.
 *  - for the Name, type in "GH_NAME." For the Value, type in your github username
 *    (mine would be "nellshamrell"), then submit the form.
 *  - after that, click on the "Add Variable" variable again. This time - for the Name
 *    type in "GH_EMAIL" and for the value type in your email address associated
 *    with your github account.
 */
export default function deployToGhPages(publishDir) {
  debug('> START');

  return new Promise((resolve, reject) => {
    let result = {};

    if (process.env.GH_NAME && process.env.GH_EMAIL) {
      result = {
        user: {
          name: process.env.GH_NAME,
          email: process.env.GH_EMAIL,
        },
      };
    }

    ghPages.publish(
      publishDir,
      result,
      (err) => {
        if (err) {
          debug(`> FAILED: Uploading files - ${err}`);
          reject(err);
        } else {
          debug('> SUCCESS: Finished Uploading files...');
          resolve();
        }
      },
    );
  });
}
