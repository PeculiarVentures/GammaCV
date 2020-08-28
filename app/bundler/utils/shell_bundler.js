const React = require('react');
const rimraf = require('rimraf'); // eslint-disable-line
const { renderToStaticMarkup } = require('react-dom/server');
const webpack = require('webpack'); // eslint-disable-line
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line
const md5File = require('md5-file'); // eslint-disable-line
const path = require('path');
const evaluate = require('eval');
const { IntlWrapper } = require('lib-pintl');
const beautify = require('js-beautify');
const uuid = require('./uuid').default;
const variables = require('../../src/assets/variables').default;

const beautifyHtml = beautify.html;

const renderToStaticDocument = (Component, props) => (
  renderToStaticMarkup(<IntlWrapper inShell><Component {...props} /></IntlWrapper>) // eslint-disable-line
);

const applyLocalizationReplace = (markup = '') => (
  markup.replace(
    /{{([\w\d.]+)}}/g,
    (...arg) => `<span style="display: inline" data-localization-id="${arg[1]}">&nbsp;</span>`,
  )
);

const scriptSourceToSourceHtml = (doctype, sourceJs, sourceCss = '', props = {}, name = 'index') => {
  let template;
  let render;

  try {
    template = evaluate(sourceJs, '', undefined, true).default;
  } catch (err) {
    throw new Error(`Evaluate error: ${err}`);
  }

  try {
    render = renderToStaticDocument(template, Object.assign(props, {
      inlineStyles: sourceCss,
      inlineScripts: props.inlineScripts,
    }));
    render = applyLocalizationReplace(render);
    if (doctype) {
      render = `<!doctype html>${render}`;
    }
  } catch (err) {
    throw new Error(`renderToStaticMarkup error: ${err}`);
  }

  return {
    name: `${name}.html`,
    source: render,
  };
};

function prepareConfig(resolve, extractSASS, entry, outputPath) {
  return {
    resolve,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
          }],
        },
        {
          test: /\.css$/,
          use: extractSASS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[local]_[hash:base64:5]',
                  minimize: true,
                },
              },
            ],
          }),
        },
        {
          test: /.*basic_.*\.sass$/,
          use: extractSASS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          }),
        },
        {
          test: /\.sass$/,
          exclude: /.*basic_.*\.sass$/,
          use: extractSASS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[local]_[hash:base64:5]',
                  minimize: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  data: variables,
                },
              },
            ],
          }),
        },
        {
          test: /\.(glsl|frag|vert)$/,
          loader: 'raw-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      extractSASS,
      new webpack.DefinePlugin({
        HTMLElement() {
          return false;
        },
      }),
    ],
    cache: false,
    entry,
    output: {
      path: outputPath,
      libraryTarget: 'umd',
      filename: '[name].js',
    },
  };
}

/**
 * Takes a string in train case and transforms it to camel case
 *
 * Example: 'hello-my-world' to 'helloMyWorld'
 *
 * @param {string} word
 */
function trainCaseToCamelCase(word) {
  return word.replace(/-([\w])/g, (match, p1) => p1.toUpperCase());
}

// /**
//  * @class ShellBundler
//  * @example
//  *  // use plugin
//  *  new StaticRender({
//  *    pathToTemplate: path.join(__dirname, 'path/to/file'),
//  *    outputHtmlName: 'file_name',
//  *    props: {},
//  *  })
//  *
//  * @example
//  *  // template
//  *  const Template = (props) => (
//  *    <html>
//  *      <head>
//  *        <styles
//  *          dangerouslySetInnerHTML={{
//  *            __html: this.props.inlineStyles,
//  *          }}
//  *        />
//  *      </head>
//  *      <body>
//  *        <div className="class">
//  *          Content
//  *        </div>
//  *      </body>
//  *    </html>
//  *  );
//  */
class ShellBundler {
  constructor(options) {
    if (!options) {
      throw new Error('Argument can\'t be empty!');
    }

    if (!Object.keys(options.templatesEntry).length) {
      throw new Error('Argument not valid!');
    }

    this.options = Object.assign({
      templatesEntry: {},
      outputPathName: '',
      cssToProps: false,
      doctype: true,
      props: {},
    }, options);
  }

  apply(compiler) {
    const {
      templatesEntry,
      outputPathName,
      cssToProps,
      doctype,
      props,
    } = this.options;
    const outputPath = path.join(__dirname, `../../${uuid()}`);
    const extractSASS = new ExtractTextPlugin('[name].css');
    const config = prepareConfig(compiler.options.resolve, extractSASS, templatesEntry, outputPath);
    let compilationHash = false;

    (compiler.hooks ? compiler.hooks.emit.tapAsync.bind(compiler.hooks.emit, 'ShellBundler') : compiler.plugin.bind(compiler, 'emit'))((compilation, callback) => { // eslint-disable-line
      const hash = Object.keys(templatesEntry).map(t => (
        md5File.sync(templatesEntry[t])
      )).join('');

      if (hash === compilationHash) {
        return callback();
      }

      const applyPluginsAsyncWaterfall = this.applyPluginsAsyncWaterfall(compilation);
      // add files to compilation fileDependencies
      Object.keys(templatesEntry).forEach((t) => {
        if (compilation.fileDependencies.add) {
          compilation.fileDependencies.add(templatesEntry[t]);
        } else {
          // Before Webpack 4 - fileDepenencies was an array
          compilation.fileDependencies.push(templatesEntry[t]);
        }
      });
      compilationHash = hash;

      new Promise((resolve, reject) => {
        webpack(config, (error, stats) => {
          rimraf.sync(outputPath);
          const compilationErrors = (stats.compilation.errors || []).join('\n');

          if (error || compilationErrors) {
            return reject(error || compilationErrors);
          }

          return resolve(stats);
        });
      })
        .then((result) => {
          const assets = result.compilation.assets;
          const arr = [];

          Object.keys(templatesEntry).forEach((name) => {
            const outputCss = assets[`${name}.css`] || {
              name,
              source: () => '',
              size: () => 0,
            };
            const outputJs = assets[`${name}.js`];

            if (!cssToProps) {
              compilation.assets[`${outputPathName}${name}.css`] = outputCss; // eslint-disable-line
            }

            const htmlSource = scriptSourceToSourceHtml(
              doctype,
              outputJs.source(),
              cssToProps && outputCss ? outputCss.source() : '',
              props,
              name,
            );
            const pluginArgs = {
              html: htmlSource.source,
              plugin: {
                options: {
                  favicons: true,
                },
              },
              htmlSource,
            };

            arr.push(applyPluginsAsyncWaterfall('html-webpack-plugin-before-html-processing', true, pluginArgs));
          });

          return Promise.all(arr);
        })
        .then((result) => {
          result.forEach((r) => {
            const html = beautifyHtml(r.html, {
              indent_size: 2,
            });

            const file = {
              name: r.htmlSource.name,
              source: () => html,
              size: () => html.length,
            };

            compilation.assets[`${outputPathName}${file.name}`] = file; // eslint-disable-line
          });

          return Promise.resolve();
        })
        .then(() => callback())
        .catch((error) => {
          compilation.errors.push(new Error(error));
          callback();
        });
    });
  }

  /**
   * Helper to promisify compilation.applyPluginsAsyncWaterfall that returns
   * a function that helps to merge given plugin arguments with processed ones
   */
  applyPluginsAsyncWaterfall(compilation) { // eslint-disable-line
    if (compilation.hooks) {
      return (eventName, requiresResult, pluginArgs) => {
        const ccEventName = trainCaseToCamelCase(eventName);
        if (!compilation.hooks[ccEventName]) {
          compilation.errors.push(new Error(`No hook found for ${eventName}`));
        }

        return compilation.hooks[ccEventName].promise(pluginArgs);
      };
    }

    // Before Webpack 4
    const promisedApplyPluginsAsyncWaterfall = function (name, init) {
      return new Promise((resolve, reject) => {
        const callback = function (err, result) {
          if (err) {
            return reject(err);
          }

          return resolve(result);
        };

        compilation.applyPluginsAsyncWaterfall(name, init, callback);
      });
    };

    return (eventName, requiresResult, pluginArgs) =>
      promisedApplyPluginsAsyncWaterfall(eventName, pluginArgs)
        .then((result) => {
          if (requiresResult && !result) {
            compilation.warnings.push(new Error(`Using ${eventName} without returning a result is deprecated.`));
          }

          return Object.assign(pluginArgs, result);
        });
  }
}

module.exports = ShellBundler;
