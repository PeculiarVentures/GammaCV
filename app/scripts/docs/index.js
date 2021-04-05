/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const DOCS_CONFIG = require('../../sources/docs/config.json');
const { checkDir } = require('./utils');

const sourceDirectory = path.join(__dirname, '../../sources/docs');
const destinationDirectory = path.join(sourceDirectory, '_data');

const handleMDFile = (docItem) => {
  fs.copyFileSync(path.join(sourceDirectory, docItem.path), path.join(destinationDirectory, `${docItem.name}.md`));
};

const renderMD = (data) => {
  const out = [];
  let hasMethods = false;

  data.forEach((item) => {
    const {
      name,
      kind,
      params,
      returns,
      examples,
      description,
    } = item;

    if (kind === 'class') {
      return;
    }

    if (name && name !== 'module.exports') {
      if (kind === 'function') {
        let PARAMS = [];
        let RETURNS = [];

        if (params) {
          PARAMS = params.map((p) => (p.optional ? `${p.name}?` : p.name));
        }

        if (returns) {
          RETURNS = returns.map((r) => r.type.names.join(','));
        }

        if (!hasMethods) {
          hasMethods = true;
          out.push(
            '######',
            ' Methods',
            '\n',
            '\n',
          );
        }

        out.push(
          '####',
          ' ',
          name,
          '(',
          PARAMS.join(', '),
          ')',
          ' ',
          '`=>',
          ' ',
          RETURNS.join(', ') || 'void',
          '`',
          '\n',
          '\n',
        );
      } else if (kind === 'constructor') {
        out.push(
          '##',
          ' ',
          '`Class`',
          ' ',
          name,
          '\n',
          '\n',
        );
      } else {
        out.push(
          '##',
          ' ',
          name,
          '\n',
          '\n',
        );
      }
    }

    if (description) {
      out.push(
        '######',
        ' ',
        'Description',
        '\n',
        '\n',
        description,
        '\n',
        '\n',
      );
    }

    if (params && params.length) {
      out.push(
        '######',
        ' ',
        'Params',
        '\n',
        '\n',
      );

      out.push(
        '| Param | Type | Description |',
        '\n',
        '| --- | --- | --- |',
        '\n',
      );

      out.push(...params.map((e) => ([
        '|',
        `**${e.optional ? `${e.name}?` : e.name}**`,
        '|',
        `<var>${e.type.names.join(' \\| ').replace('<', '\\<')}</var>`,
        '|',
        e.description ? e.description.replace(/\n/g, '') : e.description,
        '|',
        '\n',
      ].join(' '))));

      out.push('\n');
    }

    if (returns && returns.length) {
      out.push(
        '######',
        ' ',
        'Returns',
        '\n',
        '\n',
      );

      out.push(
        '| Param | Description |',
        '\n',
        '| --- | --- |',
        '\n',
      );

      out.push(...returns.map((e) => ([
        '|',
        e.type.names.join(' \\| ').replace('<', '\\<'),
        '|',
        e.description ? e.description.replace(/\n/g, '') : e.description,
        '|',
        '\n',
      ].join(' '))));

      out.push('\n');
    }

    if (examples && examples.length) {
      out.push(
        '######',
        ' ',
        'Example',
        '\n',
        '\n',
      );

      out.push(...examples.map((e) => ([
        '```js',
        e,
        '```',
        '\n',
      ].join('\n'))));
    }
  });

  return out.join('');
};

const handleJSFile = async (docItem) => {
  const res = await jsdoc2md
    .getTemplateData({
      files: path.join(sourceDirectory, docItem.path),
    });
  const data = renderMD(res);

  fs.writeFileSync(path.join(destinationDirectory, `${docItem.name}.md`), data);
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
