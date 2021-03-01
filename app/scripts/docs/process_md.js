const fs = require('fs');
const Path = require('path');
const markdownToJson = require('./md2json');
const packageJSON = require('../../package.json');
const { checkDir } = require('./utils');

function getFile(path) {
  const file = fs.readFileSync(path);

  return String(file);
}

async function processMD(files) {
  for (const file of files) {
    const destination = Path.join(file.dst);
    const text = getFile(file.src);

    checkDir(Path.parse(file.dst).dir);

    fs.writeFileSync(
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
