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
 * @name Perspective Projection
 * @description
 *  Projects the input image to the output canvas using transformation matrix.
 *  Could be used to fix Perspective.
 * @example
 *  // Manual affine transformation matrix
 *  const tMatrix = new gm.Tensor('float32', [3, 1, 4], new Float32Array([
 *    -1, 0.5, 0, 0,
 *    0, 1, 0, 0,
 *    0, 0, 1, 0,
 *  ]));
 *  gm.perspectiveProjection(tSrc, tMatrix, [1000, 1000, 4]);
 * @example
 *  // 4 point perspective transform
 *  const tMatrix = new gm.Tensor('float32', [3, 1, 4]);
 *  gm.generateTransformMatrix(
 *    new gm.Rect([10, 10, 100, 15, 100, 150, 15, 150]), // Rect on original image to be projected
 *    [100, 100], // Output dimensions
 *    tMatrix, // Tensor to be filled
 *  );
 *  gm.perspectiveProjection(tSrc, tMatrix, [100, 100, 4]);
 * @param {Tensor} tSrc - The source image.
 * @param {Tensor} tTransform -
 *  [Affine transformation matrix](https://en.wikipedia.org/wiki/Affine_transformation) (3x3) but in in shape [3, 1, 4], where each 4th element is unused.
 *  Such shape is used for more effective access to matrix values in GPU.
 * @param {Array<number>} shape - Output shape
 * @param {string} [dType] - Output data type, default to input
 */

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
