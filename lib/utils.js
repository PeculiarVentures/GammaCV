/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import * as gm from '../lib';

const AVAILABLE_GLSL_CHUNKS = ['pickCurrentValue', 'pickValue', 'float'];

export const assert = (expression, msg) => {
  if (!expression) {
    throw new Error(msg);
  }
};

export const assertShapesAreEqual = (a, b) => {
  if (a.shape.length !== b.shape.length) {
    return false;
  }

  for (let i = 0; i < a.shape.length; i += 1) {
    if (a.shape[i] !== b.shape[i]) {
      return false;
    }
  }

  return true;
};

export const assertDOMFeature = (feature, name) => {
  assert(feature, `GammaCV: DOMFeature not supported, "${name}" is not supported in current environment`);
};

export const assertCreateElement = (name) => {
  assertDOMFeature(document && document.createElement, name);
};

export const assertQuerySelector = () => {
  assertDOMFeature(document && document.querySelector, 'document.querySelector');
};

export const assertOffsetCanvas = () => {
  assert(typeof OffscreenCanvas === 'function', 'OffscreenCanvas');
};

export const isValidShape = shape => Array.isArray(shape)
  && shape.length > 0
  && !shape.some(n => n % 1 !== 0);
export const isOperation = op => op instanceof gm.Operation;
export const isMediaInput = op => op instanceof gm.MediaInput;
export const isTensor = tensor => tensor instanceof gm.Tensor;
export const isVideoElement = (input) => {
  if (typeof HTMLVideoElement === 'function') {
    return input instanceof HTMLVideoElement;
  }

  return false;
};
export const isCanvasElement = (input) => {
  if (typeof HTMLCanvasElement === 'function') {
    return input instanceof HTMLCanvasElement;
  }

  return 'getContext' in input;
};

export const isValidGLSLChunk = name => AVAILABLE_GLSL_CHUNKS.includes(name);
export const isValidGLSLVariableName = name => /^[A-Za-z](\w+)?$/.test(name);
export const isValidOperationShape = shape => shape[0] > 0 && shape[1] > 0;

export class DeprecationError extends Error { }

export function deprecationWarning(name, msg) {
  /* eslint-disable no-console */ /* due to expected place for console */
  console.warn(`GammaCV Deprecation Warning: "${name}" is deprecated${msg ? `, ${msg}` : ''}. "${name}" will be removed in next major version.`);
  /* eslint-enable no-console */
}

export function deprecationError(name, msg) {
  throw new DeprecationError(`GammaCV Deprecation Error: "${name}" is deprecated${msg ? `, ${msg}` : ''}. "${name}" and was removed.`);
}

export function getCanvas() {
  try {
    assertCreateElement('canvas');

    return document.createElement('canvas');
  } catch (error) {
    assertOffsetCanvas(typeof OffscreenCanvas === 'function', 'OffscreenCanvas');

    return new OffscreenCanvas(1, 1);
  }
}

export function getImage() {
  assertCreateElement('img');

  return document.createElement('img');
}

export function getVideo() {
  assertCreateElement('video');

  return document.createElement('video');
}
