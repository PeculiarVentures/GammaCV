/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';
import Tensor from '../../program/tensor';
import * as utils from '../../utils';

/**
 * @name GaussianBlur
 * @description
 *  This operation is default blur operation which actually
 *  convolution with Gaussian kernel.
 * @example
 *  gaussianBlur(inputImage, 5, 3);
 * @param {Tensor} tSrc - The source image to be grayscaled.
 * @param {number} kernelSize - Size of the kernel.
 * @param {number} sigma - Sigma coeficient value.
 */

export default (tSrc, kernelSize = 3, sigma = 3) => {
  utils.assert(
    kernelSize >= 3,
    'Kernel size should be greater equal 3',
  );

  utils.assert(
    sigma > 0,
    'Sigma should be greater then 0',
  );

  return new RegisterOperation('GaussianBlur')
    .Input('tSrc', tSrc.dtype)
    .Input('tKernel', 'float32')
    .Output(tSrc.dtype)
    .LoadChunk('pickValue')
    .Uniform('uWidth', 'float', tSrc.shape[0])
    .Uniform('uHeight', 'float', tSrc.shape[1])
    .Constant('KERNEL_SIZE', kernelSize)
    .PreCompile((op) => {
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

      op.assignInput('tKernel', resultKernel);
    })
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
