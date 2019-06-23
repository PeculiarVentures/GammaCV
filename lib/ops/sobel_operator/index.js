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
 * @name SobelOperator
 * @description
 *  Calculating image gradient and magnitude by applying of [Sobel Operator](https://en.wikipedia.org/wiki/Sobel_operator).
 *  Output description:
 *    0 - GX
 *    1 - GY
 *    2 - Magnitude
 * @example
 *  sobelOperator(inputImage);
 * @param {Tensor} tSrc - Input image.
 */

export default tSrc => new RegisterOperation('SobelOperator')
  .Input('tSrc', tSrc.dtype)
  .Output('float32')
  .Uniform('uWidth', 'float', tSrc.shape[0])
  .Uniform('uHeight', 'float', tSrc.shape[1])
  .Constant('PI', Math.PI)
  .GLSLKernel(kernel)
  .LoadChunk('pickValue')
  .Compile({ tSrc });
