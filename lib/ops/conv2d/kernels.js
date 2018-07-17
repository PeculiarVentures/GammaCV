import Tensor from '../../program/tensor';

export function gaussianBlur(kernelSize, sigma) {
  const dstKernel = new Tensor('float32', [kernelSize, kernelSize]);
  const mean = kernelSize / 2;
  const resultKernel = new Tensor('float32', [kernelSize, kernelSize, 4]);
  let sum = 0.0;

  for (let x = 0; x < kernelSize; x += 1) {
    for (let y = 0; y < kernelSize; y += 1) {
      const v = Math.exp(-0.5 * (((x - mean) / sigma) ** 2
        + ((y - mean) / sigma) ** 2)) / (2 * Math.PI * sigma * sigma);

      dstKernel.set(x, y, v);
      sum += dstKernel.get(x, y);
    }
  }

  // Normalize the kernel
  for (let x = 0; x < kernelSize; x += 1) {
    for (let y = 0; y < kernelSize; y += 1) {
      resultKernel.set(x, y, 3, dstKernel.get(x, y) / sum);
    }
  }

  return resultKernel;
}

export function boxBlur(kernelSize) {
  const resultKernel = new Tensor('float32', [kernelSize, kernelSize, 4]);
  const fullSize = kernelSize ** 2;

  for (let i = 0; i < resultKernel.data.length; i += 1) {
    resultKernel.data[i] = 1 / fullSize;
  }

  return resultKernel;
}

export function sharpen(amount) {
  return new Tensor('float32', [3, 3, 4], new Float32Array([
    0, 0, 0, 0,
    0, 0, 0, -1 * amount,
    0, 0, 0, 0,
    0, 0, 0, -1 * amount,
    0, 0, 0, 1 + 4 * amount,
    0, 0, 0, -1 * amount,
    0, 0, 0, 0,
    0, 0, 0, -1 * amount,
    0, 0, 0, 0,
  ]));
}
