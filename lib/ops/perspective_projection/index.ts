/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';

export default (tSrc: InputType, tTransform: InputType, shape = [10, 10, 4], dtype = tSrc.dtype) => new RegisterOperation('PerspectiveProjection')
  .Input('tSrc', tSrc.dtype)
  .Input('tTransform', 'float32')
  .Output(dtype)
  .LoadChunk('pickValue')
  .Uniform('uSrcWidth', 'float', tSrc.shape[1])
  .Uniform('uSrcHeight', 'float', tSrc.shape[0])
  .Uniform('uWidth', 'float', shape[1])
  .Uniform('uHeight', 'float', shape[0])
  .SetShapeFn(() => shape)
  .GLSLKernel(kernel)
  .Compile({ tSrc, tTransform });
