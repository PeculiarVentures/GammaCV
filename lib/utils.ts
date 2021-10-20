/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import * as gm from '.';
import { Tensor } from '.';

const AVAILABLE_GLSL_CHUNKS = ['pickCurrentValue', 'pickValue', 'float'];

export const assert = (expression: any, msg: string) => {
  if (!expression) {
    throw new Error(msg);
  }
};

export const assertShapesAreEqual = (a: Tensor, b: Tensor) => {
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

export const assertDOMFeature = (feature: any, name: string) => {
  assert(feature, `GammaCV: DOMFeature not supported, "${name}" is not supported in current environment`);
};

export const assertCreateElement = (name: string) => {
  assertDOMFeature(document && document.createElement, name);
};

export const assertQuerySelector = () => {
  assertDOMFeature(document && document.querySelector, 'document.querySelector');
};

export const assertOffsetCanvas = () => {
  assert(typeof OffscreenCanvas === 'function', 'OffscreenCanvas');
};

export const isValidShape = (shape: any) => Array.isArray(shape)
  && shape.length > 0
  && !shape.some(n => n % 1 !== 0);
export const isOperation = (op: any) => op instanceof gm.Operation;
export const isMediaInput = (op: any) => op instanceof gm.MediaInput;
export const isTensor = (tensor: any) => tensor instanceof gm.Tensor;
export const isVideoElement = (input: any) => {
  if (typeof HTMLVideoElement === 'function') {
    return input instanceof HTMLVideoElement;
  }

  return false;
};
export const isCanvasElement = (input: any) => {
  if (typeof HTMLCanvasElement === 'function') {
    return input instanceof HTMLCanvasElement;
  }

  return 'getContext' in input;
};

export const isValidGLSLChunk = (name: string) => AVAILABLE_GLSL_CHUNKS.includes(name);
export const isValidGLSLVariableName = (name: string) => /^[A-Za-z](\w+)?$/.test(name);
export const isValidOperationShape = (shape: number[]) => shape[0] > 0 && shape[1] > 0;

export class DeprecationError extends Error { }

export function deprecationWarning(name: string, msg?: string) {
  /* eslint-disable no-console */ /* due to expected place for console */
  console.warn(`GammaCV Deprecation Warning: "${name}" is deprecated${msg ? `, ${msg}` : ''}. "${name}" will be removed in next major version.`);
  /* eslint-enable no-console */
}

export function deprecationError(name: string, msg?: string) {
  throw new DeprecationError(`GammaCV Deprecation Error: "${name}" is deprecated${msg ? `, ${msg}` : ''}. "${name}" and was removed.`);
}

export function getCanvas() {
  try {
    assertCreateElement('canvas');

    return document.createElement('canvas');
  } catch (error) {
    assertOffsetCanvas();

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
