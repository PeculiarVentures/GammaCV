const Path = require('path');
const processMD = require('./process_md');
const processJS = require('./process_js');
const DOCS_CONFIG = require('../../sources/config.json');
const { checkDir } = require('./utils');
const { getRoute } = require('../../src/utils/doc_item');

const sourceDirectory = Path.join(__dirname, '../../sources');
const destinationDirectory = Path.join(__dirname, '../../_data');

function printError(errorBody, printStack = true) {
  console.error(`\n\x1b[31mUnable to generate docs: ${errorBody.name}: ${errorBody.message}`, printStack ? errorBody.stack : '');
}

function getAllJSFiles() {
  return DOCS_CONFIG.docs
    .reduce((result, current) =>
      result.concat(current.items
        .filter(item => /\.jsx?$/.test(item.path))
        .map(item => ({
          src: Path.join(sourceDirectory, item.path),
          meta: { route: getRoute(item) },
          dst: Path.join(
            destinationDirectory,
            'docs',
            `${item.name || item.path.split(/[/.]/).join('_')}.json`,
          ),
        }))), []);
}

function getAllMDFiles() {
  return DOCS_CONFIG.docs
    .reduce((result, current) =>
      result.concat(current.items
        .filter(item => /\.md$/.test(item.path))
        .map(item => ({
          src: Path.join(sourceDirectory, item.path),
          dst: Path.join(destinationDirectory, 'docs', `${item.name}.json`),
        }))), []);
}

async function main() {
  await checkDir(destinationDirectory);
  await processMD(getAllMDFiles());
  process.stdout.write('\rMarkdown processed succesfully');
  await processJS(getAllJSFiles(), Path.join(destinationDirectory, 'docs'));
  process.stdout.write('\rJS processed succesfully');
  process.stdout.write('\r');
}

main()
  .catch((err) => {
    printError(err, err.name !== 'Error');
    process.exit(err.code || 1);
  });
