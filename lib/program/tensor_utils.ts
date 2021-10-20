/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Tensor from './tensor';
import type Operation from './operation';
import type MediaInput from './media_input';
import * as utils from '../utils';

export function range(n: number) {
  const result = new Array<number>(n);

  for (let i = 0; i < n; i += 1) {
    result[i] = i;
  }

  return result;
}

// TODO: cast changed form `false` to optional value. types mismatch
export function tensorFrom(input: Operation | Tensor | MediaInput, cast?: DType) {
  let out = null;

  if (utils.isOperation(input)) {
    out = new Tensor(cast || input.dtype, input.shape);
  }

  if (utils.isTensor(input)) {
    out = new Tensor(cast || input.dtype, input.shape);
  }

  if (utils.isMediaInput(input)) {
    out = new Tensor(cast || input.dtype, input.shape);
  }

  return out;
}

export function tensorClone(from: Tensor, to: Tensor) {
  // TODO: changed from `if (to.data.set) {
  if ('set' in to.data) {
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
  input: Tensor,
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
  const invert = new Function('coords', 'tmpArr', 'shape', `${invertShape.map((a, key) => a ? `tmpArr[${key}] = shape[${key}] - 1 - coords[${key}]` : `tmpArr[${key}] = coords[${key}]`).join(';')}; return tmpArr;`); // eslint-disable-line

  for (let i = 0; i < input.size; i += 1) {
    const coords = Tensor.IndexToCoord(shape, i);
    const inverted = invert(coords, tmpArr, shape);

    output.set(...inverted, input.get(...coords));
  }

  return output;
}


export const tensorAssertEqual = (actual: Tensor, expected: Tensor) => {
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

export const tensorAssertCloseEqual = (actual: Tensor, expected: Tensor, delta = 1) => {
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

export const tensorAssertMSEEqual = (actual: Tensor, expected: Tensor, delta = 1) => {
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
  input: Tensor,
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

  const tmpArr = new Array(shape.length);
  const invert = new Function('coords', 'tmpArr', 'shape', `${invertShape.map((a, key) => a ? `tmpArr[${key}] = shape[${key}] - 1 - coords[${key}]` : `tmpArr[${key}] = coords[${key}]`).join(';')}; return tmpArr;`); // eslint-disable-line

  for (let i = 0; i < input.size; i += 1) {
    const coords = Tensor.IndexToCoord(shape, i);
    const inverted = invert(coords, tmpArr, shape);

    output.set(...inverted, input.get(...coords));
  }

  return output;
}

// TODO: confused. should use same args as for flipTensor?
/**
 * @deprecated
 */
export function invertTensor(
  input: Tensor,
  output = input,
  invertShape = new Array(input.shape.length).fill(true),
) {
  utils.deprecationWarning('invertTensor', 'use "flipTensor" instead');

  return flipTensor(input, output, invertShape);
}

/**
 * Map tensor by each component
 * @param {Tensor} t - input
 * @param {function} fn
 * @param {Tensor} [out] - output
 */
export function tensorMap(
  t: Tensor,
  fn: (a: number, i: number) => number,
  out = t
) {
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
export function tensorOnes(dtype: DType, shape: number[]) {
  const result = new Tensor(dtype, shape);

  tensorMap(result, () => 1);

  return result;
}

export function tensorFromFlat(
  arr: TensorDataView,
  shape = [1, arr.length, 4],
  dtype: DType = 'float32',
  alpha?: number,
) {
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
