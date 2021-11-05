import glsl from 'rollup-plugin-glsl';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { version } from './package.json';

const banner = `/**
 * GammaCV v${version}
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */
`;

const FORMATS = {
  UMD: 'umd', // Universal Module Definition, works as amd, cjs and iife all in one
  ES: 'es', // Keep the bundle as an ES module file
};

const terserOptions = {
  output: {
    comments: new RegExp(`GammaCV v${version}`),
  },
};

const assignUMDNameShortcut = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory(global));
}(this, function(global) {
  global.gm = global.GammaCV;
}))`;

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
      typescript({ tsconfig: './tsconfig.json' }),
      ...plugins,
    ],
    output: [
      {
        file: `${outputFolder}/${outputName}.js`,
        format,
        name: 'GammaCV',
        banner,
        footer: format === 'umd' ? assignUMDNameShortcut : '',
      },
    ],
  };
}

export default [
  getConfig(
    'index.ts',
    [],
    'dist',
    'index',
    FORMATS.UMD,
  ),
  getConfig(
    'index.ts',
    [terser(terserOptions)],
    'dist',
    'index.min',
    FORMATS.UMD,
  ),
  getConfig(
    'index.ts',
    [],
    'dist',
    'index.es',
    FORMATS.ES,
  ),
  getConfig(
    'index.ts',
    [terser(terserOptions)],
    'dist',
    'index.es.min',
    FORMATS.ES,
  ),
];
