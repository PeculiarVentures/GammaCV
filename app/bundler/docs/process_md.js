const fs = require('fs-extra');
const Path = require('path');
const markdownToJson = require('./md2json');
const packageJSON = require('../../package.json');
const { checkDir } = require('./utils');

async function getFile(path) {
  const file = await fs.readFile(path);
  return String(file);
}

async function processMD(files) {
  for (const file of files) {
    const destination = Path.join(file.dst);
    const text = await getFile(file.src);
    await checkDir(Path.parse(file.dst).dir);

    fs.writeFile(
      destination,
      JSON.stringify(markdownToJson(text, {}, {
        mentions: 'https://github.com/{{arg}}',
        issues: `${packageJSON.bugs.url}/{{arg}}`,
      }), null, 2),
    );
  }

  return true;
}

module.exports = async function main(files) {
  await processMD(files);

  return files;
};
