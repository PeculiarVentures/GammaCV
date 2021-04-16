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
 * @name Cast
 * @description
 *  Change the texture data type
 * @example
 *  gm.cast(inputImage, 'float32');
 * @param {Tensor} tSrc - The source to be changed.
 * @param {string} dtype - The destination data type
 */

export default (tSrc, dtype = tSrc.dtype) => new RegisterOperation('Cast')
  .Input('tSrc', tSrc.dtype)
  .Output(dtype)
  .LoadChunk('pickValue')
  .GLSLKernel(kernel)
  .Compile({ tSrc });
