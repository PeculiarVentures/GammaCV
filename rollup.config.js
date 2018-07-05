import resolve from 'rollup-plugin-node-resolve';
import glsl from 'rollup-plugin-glsl';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import { version } from './package.json';

const banner = `
/**
 * GammaCV v${version}
 * Copyright ${new Date().getFullYear()}
 */
`;

const FORMATS = {
  UMD: 'umd', // Universal Module Definition, works as amd, cjs and iife all in one
  ES: 'es', // Keep the bundle as an ES module file
};

const uglifyParams = {
  output: {
    preamble: banner,
  },
};

function getConfig(
  entry,
  plugins = [],
  outputFolder = 'dist',
  outputName,
  format = 'umd',
) {
  return {
    input: `lib/${entry}`,
    plugins: [
      resolve({
        jsnext: true,
        main: true,
      }),
      json(),
      glsl({
        include: 'lib/**/*.glsl',
      }),
      ...plugins,
    ],
    output: [
      {
        file: `${outputFolder}/${outputName}.js`,
        format,
        name: 'LibCV',
        banner,
      },
    ],
  };
}

export default [
  getConfig(
    'index.js',
    [babel()],
    'dist',
    'index',
    FORMATS.UMD,
  ),
  getConfig(
    'index.js',
    [babel(), uglify(uglifyParams)],
    'dist',
    'index.min',
    FORMATS.UMD,
  ),
  getConfig(
    'index.js',
    [],
    'dist/es',
    'index',
    FORMATS.ES,
  ),
  getConfig(
    'index.js',
    [uglify(uglifyParams)],
    'dist/es',
    'index.min',
    FORMATS.ES,
  ),
];
