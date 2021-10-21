/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';
import type Tensor from '../../program/tensor';

export default (tPoints: Tensor, tDstPoints: Tensor) => new RegisterOperation('TransformationMatrix')
  .Input('tPoints', 'float32')
  .Input('tDstPoints', 'float32')
  .Output('float32')
  .LoadChunk('pickValue')
  .Uniform('uWidth', 'float', tPoints.shape[1])
  .Uniform('uHeight', 'float', tPoints.shape[0])
  .SetShapeFn(() => [3, 1, 4])
  .GLSLKernel(kernel)
  .Compile({ tPoints, tDstPoints });
