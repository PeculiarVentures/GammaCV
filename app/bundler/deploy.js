const deployToGhPages = require('./utils/deploy_to_gh_pages');
const deployToAWS = require('./utils/deploy_to_s3');
const CONFIG = require('./config');

const AWS = process.argv.includes('--aws');

if (AWS) {
  deployToAWS(CONFIG.DST_PATH, CONFIG.AWS_DEPLOY_BUCKET_NAME, CONFIG.AWS_DEPLOY_REGION)
    .catch(() => {
      process.exit(1);
    });
} else {
  deployToGhPages(CONFIG.DST_PATH)
    .catch(() => {
      process.exit(1);
    });
}
