/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';
import * as convolutionKernels from './kernels';

/**
 * @name Convolution
 * @description
 *  Doing convlolution between a kernel and an image,
 *  see [wiki](https://en.wikipedia.org/wiki/Kernel_(image_processing)).
 * @example
 *  Convolution(inputImage, convolutionKernel);
 * @param {Tensor} tSrc - The source image to be convolved.
 * @param {Tensor} tKernel - Kernel body, tensor with shape [n, m, 4],
 *  where alpha component of each pixel is kernel cell value.
 * @param {number} [factor] - a scaling quantity that is multiplied by the result
 * @param {number} [bias] - is added on after the factor has been accounted for
 */

export default (tSrc, tKernel, factor = 1, bias = 0) => new RegisterOperation('Convolution2d')
  .Input('tSrc', tSrc.dtype)
  .Input('tKernel', 'float32')
  .Output(tSrc.dtype)
  .LoadChunk('pickValue')
  .Constant('KERNEL_WIDTH', tKernel.shape[1])
  .Constant('KERNEL_HEIGHT', tKernel.shape[0])
  .Uniform('bias', 'float', bias)
  .Uniform('factor', 'float', factor)
  .GLSLKernel(kernel)
  .Compile({ tSrc, tKernel });

export const kernels = convolutionKernels;
