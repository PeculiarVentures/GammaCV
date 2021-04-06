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
  let classRef = '';

  data.forEach((item) => {
    const {
      name,
      kind,
      params,
      returns,
      examples,
      description,
      comment,
      longname,
    } = item;

    if (!comment) {
      return;
    }

    if (name && !name.includes('exports')) {
      if (kind === 'function' || name !== longname) {
        let PARAMS = [];
        let RETURNS = '<span>void</span>';

        if (params) {
          PARAMS = params.map((p) => (p.optional ? `${p.name}?` : p.name));
        }

        if (returns) {
          RETURNS = returns.reduce((r, el) => {
            let returnValue = r;

            returnValue += `<span>${el.type.names.join(' \\| ').replace('<', '\\<')}</span>`;
            returnValue += el.description ? `<span> (${el.description})</span>` : '';

            return returnValue;
          }, '');
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
          comment.includes('@static') ? '<span>Static </span>' : '',
          '**',
          longname,
          '(',
          PARAMS.join(', '),
          ')**',
          ' ',
          '<span>=> </span>',
          RETURNS,
          '\n',
          '\n',
        );
      } else if (kind === 'class') {
        classRef = name;

        out.push(
          '##',
          ' ',
          '<span>Class</span>',
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

  return { md: out.join(''), classRef };
};

const handleJSFile = async (docItem) => {
  const res = await jsdoc2md
    .getJsdocData({
      files: path.join(sourceDirectory, docItem.path),
    });
  const { md, classRef } = renderMD(res);

  fs.writeFileSync(path.join(destinationDirectory, `${docItem.name}.md`), md);

  if (classRef) {
    const classRefsPath = path.join(destinationDirectory, 'classRefs.json');
    const classRefs = await fs.promises.readFile(classRefsPath)
      .then((data) => JSON.parse(data))
      .catch(() => ({}));

    classRefs[classRef] = docItem.name;

    fs.writeFileSync(classRefsPath, JSON.stringify(classRefs));
  }
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
