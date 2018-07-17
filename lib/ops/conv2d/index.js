/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';

/**
 * @name Convolution
 * @description
 *  Doing convlolution between a kernel and an image,
 *  see [wiki](https://en.wikipedia.org/wiki/Kernel_(image_processing)).
 * @example
 *  Convolution(inputImage, convolutionKernel);
 * @param {Tensor} tSrc - The source image to be convolved.
 * @param {Tensor} tKernel - Kernel body.
 * @param {Array.<number>} [step] - kernel steps [x, y], default [1, 1]
 */

export default (tSrc, tKernel, step = [1, 1]) => new RegisterOperation('Convolution2d')
  .Input('tSrc', tSrc.dtype)
  .Input('tKernel', 'float32')
  .Output(tSrc.dtype)
  .SetShapeFn(() => [tSrc.shape[0] / step[1], tSrc.shape[1] / step[0], 4])
  .LoadChunk('pickValue')
  .Constant('KERNEL_WIDTH', tKernel.shape[1])
  .Constant('KERNEL_HEIGHT', tKernel.shape[0])
  .Constant('Y_STEP', step[1])
  .Constant('X_STEP', step[0])
  .GLSLKernel(kernel)
  .Compile({ tSrc, tKernel });
