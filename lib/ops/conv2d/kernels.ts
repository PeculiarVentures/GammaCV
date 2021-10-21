import Tensor from '../../program/tensor';
import { tensorFromFlat } from '../../program/tensor_utils';

/**
 * @param {number} kernelSize
 * @param {number} sigma
 * @returns {Tensor}
 */
export function gaussianBlur(kernelSize = 3, sigma = 1) {
  const dstKernel = new Tensor('float32', [kernelSize, kernelSize]);
  const mean = (kernelSize - 1) / 2;
  const resultKernel = new Tensor('float32', [kernelSize, kernelSize, 4]);
  let sum = 0.0;

  for (let y = 0; y < kernelSize; y += 1) {
    for (let x = 0; x < kernelSize; x += 1) {
      const v = Math.exp(-0.5 * (((x - mean) / sigma) ** 2
        + ((y - mean) / sigma) ** 2)) / (2 * Math.PI * sigma * sigma);

      dstKernel.set(x, y, v);
      sum += dstKernel.get(x, y);
    }
  }

  // Normalize the kernel
  for (let y = 0; y < kernelSize; y += 1) {
    for (let x = 0; x < kernelSize; x += 1) {
      resultKernel.set(x, y, 0, dstKernel.get(x, y) / sum);
      resultKernel.set(x, y, 1, dstKernel.get(x, y) / sum);
      resultKernel.set(x, y, 2, dstKernel.get(x, y) / sum);
    }
  }

  return resultKernel;
}

/**
 * @param {*} kernelSize
 * @returns {Tensor}
 */
export function boxBlur(kernelSize = 3) {
  const resultKernel = new Tensor('float32', [kernelSize, kernelSize, 4]);
  const fullSize = kernelSize ** 2;

  for (let i = 0; i < resultKernel.data.length; i += 1) {
    resultKernel.data[i] = 1 / fullSize;
  }

  return resultKernel;
}

/**
 * @param {number} amount - multiplier for basic sharpen
 * @returns {Tensor}
 */
export function sharpen(amount = 1) {
  const d = -1 * amount;
  const k = 1 + 4 * amount;

  return tensorFromFlat([
    0, d, 0,
    d, k, d,
    0, d, 0,
  ], [3, 3, 4], 'float32');
}

/**
 * Generate kernel that inverts image. Require bias value to be `1`
 * @returns {Tensor}
 */
export function invert() {
  return tensorFromFlat([
    0, 0, 0,
    0, -1, 0,
    0, 0, 0,
  ], [3, 3, 4], 'float32');
}

/**
 * @returns {Tensor}
 */
export function edgeDetection() {
  return tensorFromFlat([
    1, 0, -1,
    0, 0, 0,
    -1, 0, 1,
  ], [3, 3, 4], 'float32');
}

/**
 * @returns {Tensor}
 */
export function edgeDetection2() {
  return tensorFromFlat([
    0, 1, 0,
    1, -4, 1,
    0, 1, 0,
  ], [3, 3, 4], 'float32');
}

/**
 * @returns {Tensor}
 */
export function edgeDetection3() {
  return tensorFromFlat([
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1,
  ], [3, 3, 4], 'float32');
}

/**
 * @param {number} kernelSize
 * @param {number} sigma - gaussian blur parameter
 * @param {number} amount - sharpen parameter
 * @returns {Tensor}
 */
export function unsharpMasking(kernelSize = 3, sigma = 1, amount = 1) {
  const base = gaussianBlur(kernelSize, sigma);
  const c = ~~((kernelSize - 1) / 2);
  const vr = 1 + 1 * amount - base.get(c, c, 0);
  const vg = 1 + 1 * amount - base.get(c, c, 1);
  const vb = 1 + 1 * amount - base.get(c, c, 2);

  for (let i = 0; i < base.size; i += 1) {
    base.data[i] = -base.data[i];
  }

  base.set(c, c, 0, vr);
  base.set(c, c, 1, vg);
  base.set(c, c, 2, vb);

  return base;
}
