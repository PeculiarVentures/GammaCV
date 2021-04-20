const jsdoc2md = require('jsdoc-to-markdown');

const processParams = (params) => {
  if (params) {
    return params.map((e) => {
      e.type = e.type.names.join(' | ');

      return e;
    });
  }

  return undefined;
};

const parseJsDoc = async (filePath, fileName) => {
  const res = await jsdoc2md
    .getTemplateData({
      files: filePath,
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
            scope,
            returns: parsedReturns,
            examples,
            type: 'method',
          });
          break;
        }
        case 'member': {
          parsedJsDoc[0].methods.push({
            ...baseProperties,
            scope: 'global',
            returns: parsedReturns,
            name: longname,
            type: 'method',
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

  return parsedJsDoc;
};

module.exports = {
  parseJsDoc,
};
