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

const textToEscaped = (text, symbolsToEscape) => {
  let escapedText = text;

  symbolsToEscape.forEach((symbol) => {
    escapedText = escapedText.replace(symbol, `\\${symbol}`);
  });

  return escapedText;
};

const handleMDFile = (docItem) => {
  fs.copyFileSync(path.join(sourceDirectory, docItem.path), path.join(destinationDirectory, `${docItem.name}.md`));
};

const renderMDHeading = (title, level = 2, prefix, postfix = '') => `${'#'.repeat(level)} ${prefix ? `${prefix} ` : ''}${title}${postfix ? ` ${postfix}` : ''}\n\n`;

const renderMDParagraph = (text) => `${text}\n\n`;

const renderMDExamples = (examples) => {
  const parsedExample = examples.map((e) => `\`\`\`ts\n${e}\n\`\`\``).join('\n');

  return renderMDParagraph(parsedExample);
};

const renderMDParamsTable = (params, docsIds) => {
  const paramsColumns = params.map((e) => {
    const name = e.optional ? `${e.name}?` : e.name;
    const type = textToEscaped(appendLink(e.type, docsIds), ['|', '<']);
    const description = e.description ? e.description.replace(/\n/g, '<br />') : '';

    return `|**${name}**|<var>${type}</var>|${description}|`;
  }).join('\n');

  return `| Param | Type | Description |\n| --- | --- | --- |\n${paramsColumns}\n\n`;
};

const renderMDFunctionHeadingPostfix = (params, returns, docsIds) => {
  let PARAMS = '';
  let RETURNS = 'void';

  if (params) {
    PARAMS = params.map((p) => {
      let paramName = p.name;

      if (p.variable) {
        paramName = `...${paramName}`;
      }

      if (p.optional) {
        paramName = `${p.name}?`;
      }

      return paramName;
    }).join(', ');
  }

  if (returns) {
    RETURNS = returns.reduce((r, el) => {
      let returnValue = r;

      returnValue += appendLink(el.type, docsIds);
      returnValue += el.description ? ` (${el.description})` : '';

      return returnValue;
    }, '');
  }

  return `(${PARAMS}) <span>=> ${textToEscaped(RETURNS, ['|', '<'])}</span>`;
};

const renderMDHeadingGroup = (name, type, postfix) => {
  switch (type) {
    case 'class':
      return renderMDHeading(name, 2, '<span>Class</span>');
    case 'function':
      return renderMDHeading(name, 2, '<span>Function </span>', postfix);
    default:
      return renderMDHeading(name, 2);
  }
};

const renderMDMethods = (methods, docsIds) => {
  const methodsMD = [];

  methods.forEach((method) => {
    const {
      name,
      params,
      returns,
      examples,
      description,
      scope,
    } = method;
    const methodPostfix = renderMDFunctionHeadingPostfix(params, returns, docsIds);
    const methodPrefix = scope === 'static' ? '<span>Static</span> ' : '';

    methodsMD.push(renderMDHeading(name, 4, methodPrefix, methodPostfix));

    if (description) {
      methodsMD.push(renderMDParagraph(description));
    }

    if (params && params.length) {
      methodsMD.push(renderMDParamsTable(params, docsIds));
    }

    if (examples && examples.length) {
      methodsMD.push(renderMDExamples(examples));
    }
  });

  return methodsMD.join('');
};

const renderMD = (data, docsIds) => {
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
    } = item;

    const functionPostfix = renderMDFunctionHeadingPostfix(params, returns, docsIds);

    out.push(renderMDHeadingGroup(name, type, functionPostfix));

    if (description) {
      out.push(renderMDHeading('Description', 6));
      out.push(renderMDParagraph(description));
    }

    if (params && params.length) {
      out.push(renderMDHeading('Params', 6));
      out.push(renderMDParamsTable(params, docsIds));
    }

    if (examples && examples.length) {
      out.push(renderMDHeading('Example', 6));
      out.push(renderMDExamples(examples));
    }

    if (methods) {
      out.push(renderMDHeading('Methods', 6));
      out.push(renderMDMethods(methods, docsIds));
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
