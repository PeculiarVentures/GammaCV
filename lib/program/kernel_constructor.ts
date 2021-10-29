/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import { chunks } from './glsl/chunks';
import ENV from './environment';
import { prepareSourceLines } from './glsl_error';
import type Operation from './operation';

// TODO: Need to move it to kind of program_utils
function validType(dtype: string) {
  return [
    'bool', 'int', 'uint',
    'float', 'double',
    'vec2', 'vec3', 'vec4',
    'mat2', 'mat3', 'mat4',
    'sampler2D',
  ].indexOf(dtype) >= 0;
}

function getType(value: any) {
  let type: string = typeof value;

  value = String(value);
  const complexType = /^(vec\d|mat\d)\([^)]+\)$/.exec(value);

  if (complexType) {
    type = complexType[1];
  } else if (/^\d+$/.exec(value)) {
    type = 'int';
  } else if (/^\d+\.(\d+)?$/.exec(value)) {
    type = 'float';
  } else if (type === 'boolean') {
    type = 'bool';
  }

  return type;
}

function constructHeading(op: Operation) {
  const uniforms: Record<string, any> = Object.assign({}, op.uniform);
  const inputKeys = Object.keys(op.input);
  let head = 'precision highp float;\n';

  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i];

    uniforms[key] = { dtype: 'sampler2D' };
  }

  const uniformsKeys = Object.keys(uniforms);

  for (let i = 0; i < uniformsKeys.length; i += 1) {
    const key = uniformsKeys[i];

    if (!validType(uniforms[key].dtype)) {
      throw new Error(`KernelConstructor: Uniform ${key} has invalid type "${uniforms[key].dtype}"`);
    }

    head += `uniform ${uniforms[key].dtype} ${key};\n`;
  }
  head += 'varying vec2 texCoords;\n';
  const constantsKeys = Object.keys(op.constant);

  for (let i = 0; i < constantsKeys.length; i += 1) {
    const key = constantsKeys[i];
    let preparedValue = op.constant[key];

    if (typeof preparedValue === 'number' && preparedValue % 1 === 0) {
      preparedValue = preparedValue.toFixed(1);
    }

    const glValueType = getType(preparedValue);

    if (!validType(glValueType)) {
      throw new Error(`KernelConstructor: Constant ${key}, has invalid type "${glValueType}"`);
    }

    head += `#define ${key} ${preparedValue}\n`;
  }

  return head;
}


function injectChunks(op: Operation) {
  const separateWidth = 35;
  const requiredChunks = [];

  if (!ENV.SUPPORTS_FLOAT_TEXTURES) {
    requiredChunks.push('float');
  }

  const dependencies = requiredChunks
    .concat(op.chunks.filter((item, pos, self) => self.indexOf(item) === pos));

  return dependencies.map((name) => {
    const midString = ` Chunk ${name} `;
    const pad = separateWidth - midString.length;
    const head = `${'-'.repeat(Math.floor(pad / 2))}${midString}${'-'.repeat(Math.ceil(pad / 2))}`;

    if (typeof chunks[name] === 'function') {
      return `/*${head}*/\n${(chunks as Record<string, any>)[name](op)}\n/*${'-'.repeat(separateWidth)}*/`;
    }

    throw new TypeError(`KernelConstructor: Chunk "${name}" is not a function`);
  }).join('\n');
}

function hasMain(code: string) {
  return !!(/void main\(([^)]+)?\)([\s]+)?{/.exec(code));
}

export default function constructKernel(op: Operation) {
  let fullKernel: string;

  if (hasMain(op.kernel)) {
    fullKernel = op.kernel;
  } else {
    const head = constructHeading(op);
    const dependencies = injectChunks(op);
    const end = chunks.main(op);

    fullKernel = [head, dependencies, op.kernel, end].join('\n\n');
  }

  if (ENV.DEBUG) {
    /* eslint-disable no-console */ /* due to expected place for console */
    console.groupCollapsed(op.name);
    console.log(prepareSourceLines(fullKernel).join('\n'));
    console.groupEnd();
    /* eslint-enable no-console */
  }

  return fullKernel;
}
