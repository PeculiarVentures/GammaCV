/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const DOCS_CONFIG = require('../../sources/docs/config.json');
const { checkDir } = require('./utils');
const { parseJsDoc } = require('./parse_jsdoc');

const sourceDirectory = path.join(__dirname, '../../sources/docs');
const destinationDirectory = path.join(sourceDirectory, '_data');

const appendLink = (text, docsIds) => {
  const docId = docsIds.find((d) => text.includes(d.name));

  if (docId) {
    return text.replace(docId.name, `[${docId.name}](/docs/${docId.id}#${docId.name})`);
  }

  return text;
};

const textToEscaped = (text, sympolsToEscape) => {
  let escapedText = text;

  sympolsToEscape.forEach((symbol) => {
    escapedText = escapedText.replace(symbol, `\\${symbol}`);
  });

  return escapedText;
};

const handleMDFile = (docItem) => {
  fs.copyFileSync(path.join(sourceDirectory, docItem.path), path.join(destinationDirectory, `${docItem.name}.md`));
};

const renderMDHeading = (title, level = 2, prefix, postfix = '') => `${'#'.repeat(level)} ${prefix ? `${prefix} ` : ''}${title}${postfix ? ` ${postfix}` : ''}

`;

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
      scope,
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
          scope === 'static' ? '<span>Static</span> ' : '',
        );
      } else {
        out.push(
          '##',
          ' ',
          '<span>Function </span>',
        );
      }

      out.push(
        name,
        '(',
        PARAMS.join(', '),
        ')',
        ' ',
        '<span>=> ',
        textToEscaped(RETURNS, ['|', '<']),
        '</span>',
        '\n',
        '\n',
      );
    } else if (type === 'class') {
      out.push(renderMDHeading(name, 2, '<span>Class</span>'));
    } else {
      out.push(renderMDHeading(name, 2));
    }

    if (description) {
      out.push(renderMDHeading('Description', 6));
      out.push(
        description,
        '\n',
        '\n',
      );
    }

    if (params && params.length) {
      out.push(renderMDHeading('Params', 6));

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
        `<var>${textToEscaped(appendLink(e.type, docsIds), ['|', '<'])}</var>`,
        '|',
        e.description ? e.description.replace(/\n/g, '') : e.description,
        '|',
        '\n',
      ].join(' '))));

      out.push('\n');
    }

    if (examples && examples.length) {
      out.push(renderMDHeading('Example', 6));
      out.push(...examples.map((e) => ([
        '```js',
        e,
        '```',
        '\n',
      ].join('\n'))));
    }

    if (methods) {
      out.push(renderMDHeading('Methods', 6));
      out.push(renderMD(methods, docsIds, true));
    }
  });

  return out.join('');
};

async function main() {
  await checkDir(destinationDirectory);

  const items = DOCS_CONFIG.reduce((result, current) => result.concat(current.children), []);
  const parsedDocs = [];
  const docsIds = [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const isMD = /\.md$/.test(item.path);
    const itemPath = path.join(sourceDirectory, item.path);

    if (isMD) {
      handleMDFile(item);
    } else {
      const res = await parseJsDoc(itemPath, item.name);

      parsedDocs.push(res);
      docsIds.push({ id: res[0].id, name: res[0].name });
    }
  }

  for (let i = 0; i < parsedDocs.length; i += 1) {
    const md = renderMD(parsedDocs[i], docsIds);

    fs.writeFileSync(path.join(destinationDirectory, `${docsIds[i].id}.md`), md);
  }
}

main();

// (async () => {
//   const item = {
//     "name": "tensor",
//     "path": "../../../lib/program/tensor.js"
//   };
//   // const item = {
//   //   "name": "adaptive_threshold",
//   //   "path": "../../../lib/ops/adaptive_threshold/index.js"
//   // };
//   const res = await parseJsDocFile(item.path, item.name);
//   const md = renderMD(res, []);

//   console.log(md);
// })();
