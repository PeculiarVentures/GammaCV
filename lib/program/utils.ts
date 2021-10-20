/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

export function parallelReductionCheckSteps(size = 1, steps = [1]) {
  let s = size;

  for (let i = 0; i < steps.length; i += 1) {
    s /= steps[i];
  }

  return s === 1;
}

export function parallelReductionCheckSteps2d(size = [1, 1], steps = [[1, 1]]) {
  return parallelReductionCheckSteps(size[0], steps.map(n => n[0]))
  && parallelReductionCheckSteps(size[0], steps.map(n => n[1]));
}

export function parallelReductionGetSteps(
  size = 1,
  layersCount = 1,
  ignoreOne = true,
  maxLayerSize = size,
) {
  const base = size ** (1 / layersCount);

  if (size % 1 !== 0) {
    throw new RangeError(`Can't get parallel reduction steps for non-integer, got "${size}"`);
  }

  if (maxLayerSize < 1) {
    throw new RangeError(`Can't get parallel reduction steps for maxLayerSize below less than 1, got "${maxLayerSize}"`);
  }

  if (base % 1 === 0 && base < maxLayerSize) {
    return new Array(layersCount).fill(base);
  }

  const result = [];
  let _size = size;
  let _base = base;

  for (let i = 0; i < layersCount; i += 1) {
    _base = _size ** (1 / (layersCount - i));
    let v = Math.ceil(_base);

    while ((_size % v !== 0 || _size / v > maxLayerSize) && _size / v !== 1) {
      v += 1;
    }
    if (v === 1 && ignoreOne) {
      break;
    }
    _size /= v;

    result.push(v);
  }

  return result;
}

export function parallelReductionGetSteps2d(
  size = [1, 1],
  layersCount = 1,
  ignoreOne = true,
  maxLayerSize = size,
) {
  const s1 = parallelReductionGetSteps(size[0], layersCount, ignoreOne, maxLayerSize[0]);
  const s2 = parallelReductionGetSteps(size[1], layersCount, ignoreOne, maxLayerSize[1]);
  const result = [];

  for (let i = 0; i < layersCount && (s1[i] || s2[i]); i += 1) {
    result.push([s1[i] || 1, s2[i] || 1]);
  }

  return result;
}

/**
 * Convolution calc ouput shape.
 * @param {number} inputLength - the source size
 * @param {number} kernelSide
 * @param {number} [stride]
 * @returns {number} - Count of windows.
 */

export function clacConvolution(inputLength: number, kernelSide: number, stride = 1) {
  return Math.ceil(((inputLength - kernelSide) + 1) / stride);
}
