import * as CONFIG from '../../bundler/config';

const getPath = () => {
  const gitUrlRegexp = /https:\/\/([a-z-A-Z])\w+.github.io/g;

  if (gitUrlRegexp.test(CONFIG.GIT_URL)) {
    return CONFIG.GIT_URL.replace(/https:\/\/([a-z-A-Z])\w+.github.io/g, '');
  }

  return '';
};

export default getPath();
