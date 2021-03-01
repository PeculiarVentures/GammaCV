const path = require('path');
const processMD = require('./process_md');
const processJS = require('./process_js');
const DOCS_CONFIG = require('../../sources/docs/config.json');
const { checkDir } = require('./utils');

const sourceDirectory = path.join(__dirname, '../../sources/docs');
const destinationDirectory = path.join(sourceDirectory, '_data');

function printError(errorBody, printStack = true) {
  console.error(`\n\x1b[31mUnable to generate docs: ${errorBody.name}: ${errorBody.message}`, printStack ? errorBody.stack : '');
}

function getAllJSFiles() {
  return DOCS_CONFIG
    .reduce((result, current) =>
      result.concat(current.childrens
        .filter(item => /\.jsx?$/.test(item.path))
        .map(item => ({
          src: path.join(sourceDirectory, item.path),
          meta: { route: item.name },
          dst: path.join(
            destinationDirectory,
            `${item.name}.json`,
          ),
        }))), []);
}

function getAllMDFiles() {
  return DOCS_CONFIG
    .reduce((result, current) =>
      result.concat(current.childrens
        .filter(item => /\.md$/.test(item.path))
        .map(item => ({
          src: path.join(sourceDirectory, item.path),
          dst: path.join(destinationDirectory, `${item.name}.json`),
        }))), []);
}

async function main() {
  await checkDir(destinationDirectory);
  await processMD(getAllMDFiles());
  process.stdout.write('\rMarkdown processed succesfully');
  await processJS(getAllJSFiles(), destinationDirectory);
  process.stdout.write('\rJS processed succesfully');
  process.stdout.write('\r');
}

main()
  .catch((err) => {
    printError(err, err.name !== 'Error');
    process.exit(err.code || 1);
  });
