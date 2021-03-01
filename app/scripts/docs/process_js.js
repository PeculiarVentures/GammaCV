/* eslint-disable */
const babylon = require('babylon');
const fs = require('fs');
const Path = require('path');
const traverse = require('babel-traverse').default;
const doctrine = require('doctrine');
const markdownToJson = require('./md2json');
const packageJSON = require('../../package.json');
const { checkDir } = require('./utils');

const BABYLON_CONFIG = {
  sourceType: 'module',
  plugins: ['jsx', 'objectRestSpread', 'decorators', 'classProperties', 'functionBind'],
};

function checkNode(node, type) {
  const result = [];

  if (node[type] && node[type].length) {
    for (const comment of node[type]) {
      result.push(doctrine.parse(comment.value, { unwrap: true, sloppy: true, recoverable: true }));
    }
  }

  return result;
}

function processParam(param, result = [], flags = {}) {
  let obj = {};

  switch (param.type) {
    case 'NameExpression': {
      obj.type = param.name;
      break;
    }
    case 'RestType': {
      flags.rest = true;
      processParam(param.expression, result, flags);
      break;
    }
    case 'OptionalType': {
      flags.optional = true;
      processParam(param.expression, result, flags);
      break;
    }
    case 'NonNullableType': {
      processParam(param.expression, result, flags);
      break;
    }
    case 'TypeApplication': {
      obj = { applications: [] };
      processParam(param.expression, obj, flags);

      for (const app of param.applications) {
        processParam(app, obj.applications, flags);
      }
      break;
    }
    case 'FunctionType': {
      Object.assign(obj, param);

      obj.params = obj.params.map(tag => processParam(tag));
      break;
    }
    case 'UnionType': {
      for (const el of param.elements) {
        processParam(el, result);
      }
      break;
    }
    default:
      break;
  }

  if (Array.isArray(result)) {
    if (Object.keys(obj).length) {
      result.push(obj);
    }
  } else {
    Object.assign(result, obj);
  }

  return result;
}

function processComment(samples, node, scope) {
  const result = {};

  for (const sample of samples) {
    const tags = sample.tags || [];

    for (const tag of tags) {
      switch (tag.title) {
        case 'param': {
          if (!result.params) {
            result.params = [];
          }

          const flags = {};
          const type = processParam(tag.type, [], flags);

          result.params.push({
            name: tag.name,
            description: markdownToJson(tag.description || '', {}, {
              mentions: 'https://github.com/{{arg}}',
              issues: `${packageJSON.bugs.url}/{{arg}}`,
            }),
            type,
            rest: flags.rest,
            optional: flags.optional,
          });
          break;
        }
        case 'example': {
          if (!result.examples) {
            result.examples = [];
          }
          result.examples.push(tag);
          break;
        }
        case 'description': {
          result[tag.title] = markdownToJson(tag.description, {}, {
            mentions: 'https://github.com/{{arg}}',
            issues: `${packageJSON.bugs.url}/{{arg}}`,
          })
          break;
        }
        case 'return':
        case 'returns': {
          result.return ={
            name: tag.name,
            description: tag.description,
            type: processParam(tag.type),
            optional: tag.type.type === 'OptionalType',
          };
          break;
        }
        case 'class': {
          result.type = tag.title;
          result.name = tag.name;
          break;
        }
        case 'method':
        case 'function':
        case 'property': {
          result.type = tag.title;
          break;
        }
        case 'public':
        case 'private':
        case 'static': {
          result[tag.title] = true;
          break;
        }
        default: {
          result[tag.title] = tag.name || tag.description;
          break;
        }
      }
    }
  }

  if (Object.keys(result).length && !result.name) {
    result.name = node && node.key && node.key.name;
    result.name = scope ? `${scope}.${result.name}` : result.name; // scoping name
  }

  return Object.keys(result).length ? result : [];
}

function processFile(code, route, nameSpace) {
  const explained = babylon.parse(code, BABYLON_CONFIG);
  let results = [];

  traverse(explained, {
    noScope: true,
    enter(path) {
      let shouldAddToNameSpace = false;

      if (
        ((path.isExportDefaultDeclaration() || path.isExportDeclaration()) && path.node.declaration && path.node.declaration.type === 'ClassDeclaration')
        || path.isClassDeclaration() 
      ) {
        shouldAddToNameSpace = true;
      }

      const leads = checkNode(path.node, 'leadingComments');

      for (const lead of leads) {
        if (lead) {
          const res = processComment([lead], path.node);
  
          if (Array.isArray(res)) {
            return null;
          }
  
          if (path.isFunctionDeclaration() || path.node.type === 'ClassMethod' || res.method) {
            res.params = res.params || [];
            if (path.node.type === 'ClassMethod') {
              res.type = 'method';
            } else {
              res.type = 'function';
            }
          }
  
          if (res.type === 'class') {
            path.state = { classScope: res.name, classObject: res };
          } else if (path.state && path.state.classScope) {
            if (res.name === 'constructor') {
              Object.assign(path.state.classObject, { params: res.params });
            } else if (res.type === 'method') {
              path.state.classObject.methods = path.state.classObject.methods || [];
              path.state.classObject.methods.push(res);
            }
  
            return null;
          }
  
          if (res && shouldAddToNameSpace) {
            nameSpace[res.name] = `${route || res.name}#${res.name}`;
          }
  
          results = results.concat(res);
        }
      }
    },
    exit(path) {
      if (path.isClassDeclaration()) {
        path.state = {};
      }
    },
  });

  return results;
}

module.exports = async function main(files, destination) {
  const names = {};
  const nameSpace = {};

  for (const file of files) {
    await checkDir(Path.parse(file.dst).dir);
    const code = fs.readFileSync(file.src);
    const parsed = processFile(String(code), file.meta && file.meta.route, nameSpace);
    let pathParsedArr = file.src.split('/');
    let pathParsed = pathParsedArr.pop().split('.')[0];

    if (pathParsed === 'index') {
      pathParsed = pathParsedArr.pop().split('.')[0];
    }

    let name = pathParsed;

    for (const item of parsed) {
      if (item.name) {
        name = item.name;
        break;
      }
    }

    names[pathParsed] = name;

    if (!parsed.length) {
      names[pathParsed] += ' ⚠️';
    }

    fs.writeFileSync(file.dst, JSON.stringify(parsed, null, 2));
  }

  fs.writeFileSync(Path.join(destination, 'names.json'), JSON.stringify(names, null, 2));
  fs.writeFileSync(Path.join(destination, 'namespace.json'), JSON.stringify(nameSpace, null, 2));

  return 0;
};
