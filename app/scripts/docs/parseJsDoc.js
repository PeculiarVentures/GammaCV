const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');

const sourceDirectory = path.join(__dirname, '../../sources/docs');
const destinationDirectory = path.join(sourceDirectory, '_data');

const processParams = (params) => {
  if (params) {
    return params.map((e) => {
      e.type = e.type.names.join(' \\| ').replace('<', '\\<');

      return e;
    });
  }

  return undefined;
};

const parseJsDocFile = async (filePath, fileName) => {
  const res = await jsdoc2md
    .getTemplateData({
      files: path.join(sourceDirectory, filePath),
    });
  const parsedJsDoc = [];

  res.sort((a, b) => a.order - b.order);
  const isClass = res[0].kind === 'class';

  res.forEach((data) => {
    const {
      name,
      longname,
      kind,
      scope,
      description,
      params,
      returns,
      examples,
    } = data;

    const parsedParams = processParams(params);
    const parsedReturns = processParams(returns);

    const baseProperties = {
      id: fileName,
      name,
      description,
      type: kind,
      params: parsedParams,
      examples,
      returns: parsedReturns,
    };

    if (isClass) {
      switch (kind) {
        case 'class': {
          parsedJsDoc.push({ ...baseProperties, methods: [], params: [] });
          break;
        }
        case 'constructor': {
          parsedJsDoc[0].params = parsedParams;
          break;
        }
        case 'function': {
          parsedJsDoc[0].methods.push({
            ...baseProperties,
            isStatic: scope === 'static',
            returns: parsedReturns,
            examples,
            type: 'function',
          });
          break;
        }
        case 'member': {
          parsedJsDoc[0].methods.push({
            ...baseProperties,
            isStatic: false,
            returns: parsedReturns,
            name: longname,
            type: 'function',
          });
          break;
        }
        default:
          break;
      }
    } else {
      parsedJsDoc.push(baseProperties);
    }
  });

  fs.writeFileSync(path.join(destinationDirectory, `${fileName}.json`), JSON.stringify(parsedJsDoc));

  return parsedJsDoc;
};

module.exports = {
  parseJsDocFile,
};
