const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const DOCS_CONFIG = require('../../sources/docs/config.json');
const { checkDir } = require('./utils');

const sourceDirectory = path.join(__dirname, '../../sources/docs');
const destinationDirectory = path.join(sourceDirectory, '_data');
/**
 * Available partials - https://github.com/jsdoc2md/dmd.
 */
const hbsPartials = [
  path.join(__dirname, './partials/header.hbs'),
  path.join(__dirname, './partials/description.hbs'),
  path.join(__dirname, './partials/body.hbs'),
  path.join(__dirname, './partials/main.hbs'),
  path.join(__dirname, './partials/param-table-name.hbs'),
  path.join(__dirname, './partials/docs.hbs'),
  path.join(__dirname, './partials/params-table.hbs'),
  path.join(__dirname, './partials/examples.hbs'),
];

const handleMDFile = (docItem) => {
  fs.copyFileSync(path.join(sourceDirectory, docItem.path), path.join(destinationDirectory, `${docItem.name}.md`));
};

const handleJSFile = async (docItem) => {
  const res = await jsdoc2md
    .render({
      files: path.join(sourceDirectory, docItem.path),
      partial: hbsPartials,
    });

  fs.writeFileSync(path.join(destinationDirectory, `${docItem.name}.md`), res);
};

async function main() {
  await checkDir(destinationDirectory);

  const items = DOCS_CONFIG.reduce((result, current) => result.concat(current.children), []);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const isMD = /\.md$/.test(item.path);

    if (isMD) {
      handleMDFile(item);
    } else {
      await handleJSFile(item);
    }
  }
}

main();
