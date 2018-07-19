/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Operation from './operation';
import Tensor from './tensor';
import * as utils from '../utils';

export function range(n) {
  const result = new Array(n);

  for (let i = 0; i < n; i += 1) {
    result[i] = i;
  }

  return result;
}

export function tensorFrom(input, cast = false) {
  let out = null;

  if (input instanceof Operation) {
    out = new Tensor(cast || input.dtype, input.shape);
  }

  if (input instanceof Tensor) {
    out = new Tensor(cast || input.dtype, input.shape);
  }

  return out;
}

export function tensorClone(from, to) {
  if (to.data.set) {
    to.data.set(from.data);
  } else {
    for (let i = 0; i < to.size; i += 1) {
      to.data[i] = from.data[i];
    }
  }
}

/**
 * @param {Tensor} input
 * @param {Tensor} [output]
 * @param {Array.<number>} invertShape
 */

export function tensorInvert(
  input,
  output = input,
  invertShape = new Array(input.shape.length).fill(true),
) {
  const shape = input.shape;

  if (input === output) {
    input = input.clone();
  }

  if (input.shape.length !== output.shape.length) {
    throw new Error('invertTensor: Unable to invert, input and output has different shapes');
  }

  const tmpArr = new Array(shape.length); // eslint-disable-line
  let invert = () => { }; // eslint-disable-line

  eval(`invert = function (coords) { ${invertShape.map((a, key) => a ? `tmpArr[${key}] = shape[${key}] - 1 - coords[${key}]` : `tmpArr[${key}] = coords[${key}]`).join(';')}; return tmpArr; }`); // eslint-disable-line

  for (let i = 0; i < input.size; i += 1) {
    const coords = Tensor.IndexToCoord(shape, i);
    const inverted = invert(coords, tmpArr);

    output.set(...inverted, input.get(...coords));
  }

  return output;
}


export const tensorAssertEqual = (actual, expected) => {
  if (!utils.assertShapesAreEqual(actual, expected)) {
    return false;
  }

  for (let i = 0; i < actual.size; i += 1) {
    if (actual.data[i] !== expected.data[i]) {
      return false;
    }
  }

  return true;
};

export const tensorAssertCloseEqual = (actual, expected, delta = 1) => {
  if (!utils.assertShapesAreEqual(actual, expected)) {
    return false;
  }

  for (let i = 0; i < actual.size; i += 1) {
    if (Math.abs(actual.data[i] - expected.data[i]) > delta) {
      return false;
    }
  }

  return true;
};

export const tensorAssertMSEEqual = (actual, expected, delta = 1) => {
  if (!utils.assertShapesAreEqual(actual, expected)) {
    return false;
  }

  let mse = 0;

  for (let i = 0; i < actual.size; i += 1) {
    mse += (actual.data[i] - expected.data[i]) ** 2;
  }

  mse = Math.sqrt(mse) / actual.size;

  return mse < delta;
};

/**
 * @param {Tensor} input
 * @param {Tensor} [output]
 * @param {Array.<number>} invertShape
 */

export function flipTensor(
  input,
  output = input,
  invertShape = new Array(input.shape.length).fill(true),
) {
  const shape = input.shape;

  if (input === output) {
    input = input.clone();
  }

  if (input.shape.length !== output.shape.length) {
    throw new Error('invertTensor: Unable to invert, input and output has different shapes');
  }

  const tmpArr = new Array(shape.length); // eslint-disable-line
  let invert = () => { }; // eslint-disable-line

  eval(`invert = function (coords) { ${invertShape.map((a, key) => a ? `tmpArr[${key}] = shape[${key}] - 1 - coords[${key}]` : `tmpArr[${key}] = coords[${key}]`).join(';')}; return tmpArr; }`); // eslint-disable-line

  for (let i = 0; i < input.size; i += 1) {
    const coords = Tensor.IndexToCoord(shape, i);
    const inverted = invert(coords, tmpArr);

    output.set(...inverted, input.get(...coords));
  }

  return output;
}

/**
 * @deprecated
 */
export function invertTensor(...args) {
  utils.deprecationWarning('invertTensor', 'use "flipTensor" instead');

  return flipTensor(...args);
}

/**
 * Map tensor by each component
 * @param {Tensor} t - input
 * @param {function} fn
 * @param {Tensor} [out] - output
 */
export function tensorMap(t, fn, out = t) {
  for (let i = 0; i < t.size; i += 1) {
    out.data[i] = fn(t.data[i], i);
  }
}

/**
 * Create tensor filled with 1
 * @param {string} dtype
 * @param {array} shape
 * @returns {Tensor}
 */
export function tensorOnes(dtype, shape) {
  const result = new Tensor(dtype, shape);

  tensorMap(result, () => 1);

  return result;
}

export function tensorFromFlat(arr, shape = [1, arr.length, 4], dtype = 'float32', alpha) {
  const res = new Array(arr.length * 4);

  for (let i = 0; i < res.length; i += 1) {
    if ((i + 1) % 4 === 0 && typeof alpha === 'number') {
      res[i] = alpha;
    } else {
      res[i] = arr[~~(i / 4)];
    }
  }

  return new Tensor(dtype, shape, Tensor.GetTypedArray(dtype, res));
}
