import Tensor from '../../program/tensor';

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

export function boxBlur(kernelSize = 3) {
  const resultKernel = new Tensor('float32', [kernelSize, kernelSize, 4]);
  const fullSize = kernelSize ** 2;

  for (let i = 0; i < resultKernel.data.length; i += 1) {
    resultKernel.data[i] = 1 / fullSize;
  }

  return resultKernel;
}

export function sharpen(amount = 1) {
  const d = -1 * amount;
  const k = 1 + 4 * amount;

  return new Tensor('float32', [3, 3, 4], new Float32Array([
    0, 0, 0, 0,
    d, d, d, 0,
    0, 0, 0, 0,
    d, d, d, 0,
    k, k, k, 0,
    d, d, d, 0,
    0, 0, 0, 0,
    d, d, d, d,
    0, 0, 0, 0,
  ]));
}

export function invert() {
  return new Tensor('float32', [3, 3, 4], new Float32Array([
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    -1, -1, -1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ]));
}

export function edgeDetection() {
  return new Tensor('float32', [3, 3, 4], new Float32Array([
    1, 1, 1, 0,
    0, 0, 0, 0,
    -1, -1, -1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    -1, -1, -1, 0,
    0, 0, 0, 0,
    1, 1, 1, 0,
  ]));
}

export function edgeDetection2() {
  return new Tensor('float32', [3, 3, 4], new Float32Array([
    0, 0, 0, 0,
    1, 1, 1, 0,
    0, 0, 0, 0,
    1, 1, 1, 0,
    -4, -4, -4, 0,
    1, 1, 1, 0,
    0, 0, 0, 0,
    1, 1, 1, 0,
    0, 0, 0, 0,
  ]));
}

export function edgeDetection3() {
  return new Tensor('float32', [3, 3, 4], new Float32Array([
    -1, -1, -1, 0,
    -1, -1, -1, 0,
    -1, -1, -1, 0,
    -1, -1, -1, 0,
    8, 8, 8, 0,
    -1, -1, -1, 0,
    -1, -1, -1, 0,
    -1, -1, -1, 0,
    -1, -1, -1, 0,
  ]));
}

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