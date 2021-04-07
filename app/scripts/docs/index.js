/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const DOCS_CONFIG = require('../../sources/docs/config.json');
const { checkDir } = require('./utils');
const { parseJsDocFile } = require('./parseJsDoc');

const sourceDirectory = path.join(__dirname, '../../sources/docs');
const destinationDirectory = path.join(sourceDirectory, '_data');

const appendLink = (text, docsIds) => {
  const docId = docsIds.find((d) => text.includes(d.name));

  if (docId) {
    return text.replace(docId.name, `[${docId.name}](/docs/${docId.id}#${docId.name})`);
  }

  return text;
};

const handleMDFile = (docItem) => {
  fs.copyFileSync(path.join(sourceDirectory, docItem.path), path.join(destinationDirectory, `${docItem.name}.md`));
};

const renderMD = (data, docsIds, isClassMethod = false) => {
  const out = [];

  data.forEach((item) => {
    const {
      name,
      type,
      params,
      returns,
      examples,
      description,
      methods,
      isStatic,
    } = item;

    if (type === 'function') {
      let PARAMS = [];
      let RETURNS = 'void';

      if (params) {
        PARAMS = params.map((p) => (p.optional ? `${p.name}?` : p.name));
      }

      if (returns) {
        RETURNS = returns.reduce((r, el) => {
          let returnValue = r;

          returnValue += appendLink(el.type, docsIds);
          returnValue += el.description ? ` (${el.description})` : '';

          return returnValue;
        }, '');
      }

      if (isClassMethod) {
        out.push(
          '####',
          ' ',
          isStatic ? '<span>Static </span>' : '',
        );
      } else {
        out.push(
          '##',
          ' ',
          '<span>Function </span>',
        );
      }

      out.push(
        '**',
        name,
        '(',
        PARAMS.join(', '),
        ')**',
        ' ',
        '<span>=> ',
        RETURNS,
        '</span>',
        '\n',
        '\n',
      );
    } else if (type === 'class') {
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
        `<var>${appendLink(e.type, docsIds)}</var>`,
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

    if (methods) {
      out.push(
        '######',
        ' Methods',
        '\n',
        '\n',
      );

      out.push(renderMD(methods, docsIds, true).md);
    }
  });

  return { md: out.join('') };
};

async function main() {
  await checkDir(destinationDirectory);

  const items = DOCS_CONFIG.reduce((result, current) => result.concat(current.children), []);
  const parsedDocs = [];
  const docsIds = [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const isMD = /\.md$/.test(item.path);

    if (isMD) {
      handleMDFile(item);
    } else {
      const res = await parseJsDocFile(item.path, item.name);

      parsedDocs.push(res);
      docsIds.push({ id: res[0].id, name: res[0].name });
    }
  }

  for (let i = 0; i < parsedDocs.length; i += 1) {
    const { md } = renderMD(parsedDocs[i], docsIds);

    fs.writeFileSync(path.join(destinationDirectory, `${docsIds[i].id}.md`), md);
  }
}

main();
