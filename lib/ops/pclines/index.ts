/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import transformKernel from './transform.glsl';
import enhanceKernel from './enhance.glsl';
import peaksKernel from './peaks.glsl';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

export const pcLinesReduceMax = (tSrc: Tensor | Operation | MediaInput, k = 10, f = 0) => {
  const h = ~~(tSrc.shape[0] / k);
  const w = ~~(tSrc.shape[1] / k);
  const _k = Math.ceil(Math.max(tSrc.shape[0] / h, tSrc.shape[1] / w));

  return new RegisterOperation('ReduceMax')
    .Input('tSrc', f ? 'float32' : 'uint8')
    .Output('float32')
    .Uniform('uF', 'float', f)
    .LoadChunk('pickValue')
    .Constant('W', _k)
    .Constant('H', _k)
    .Constant('O_WIDTH', tSrc.shape[1])
    .Constant('O_HEIGHT', tSrc.shape[0])
    .Constant('K', 1 / _k)
    .SetShapeFn(() => [Math.ceil(tSrc.shape[0] / _k), Math.ceil(tSrc.shape[1] / _k), 4])
    .GLSLKernel(peaksKernel)
    .Compile({ tSrc });
};

export const pcLinesEnhance = (tSrc: Tensor | Operation | MediaInput) => new RegisterOperation('PCLinesEnhanced')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .Uniform('uWidth', 'float', tSrc.shape[0])
  .Uniform('uHeight', 'float', tSrc.shape[0])
  .LoadChunk('pickValue')
  .GLSLKernel(enhanceKernel)
  .Compile({ tSrc });

export const pcLinesTransform = (tSrc: Tensor, step = 3) => {
  const size = Math.max(tSrc.shape[0], tSrc.shape[1]);

  return new RegisterOperation('PCLinesTransform')
    .Input('tSrc', 'float32')
    .Output('uint8')
    .Uniform('uWidth', 'float', tSrc.shape[1])
    .Uniform('uHeight', 'float', tSrc.shape[0])
    .Constant('PI', Math.PI)
    .Constant('D', size)
    .Constant('STEP', step)
    .Constant('MAX_DIST', size)
    .Constant('MAX_ANGLE', size)
    .LoadChunk('pickValue')
    .SetShapeFn(() => [size, size, 4])
    .GLSLKernel(transformKernel)
    .Compile({ tSrc });
};

/**
 * @name PCLinesTransform
 * @description Implementation of Hough transform algorithm in parallel line space,
 *  also known as PC Lines.
 * @param {Tensor} input - Image edges image should be binarized to [0, 1],
 *  could be used with [CannyEdges](/docs/canny_edges).
 * @param {number} layers - count of parallel reduction layers
 * @param {number} dStep - discretization step
 * @param {number} dCoeficient - reduction coefficient
 */

export default (input: Tensor, layersCount = 2, dStep = 2, dCoeficient = 2) => {
  let pipeline = pcLinesTransform(input, dStep);

  pipeline = pcLinesReduceMax(pipeline, dCoeficient);

  for (let i = 0; i < layersCount; i += 1) {
    pipeline = pcLinesReduceMax(pipeline, dCoeficient, 1);
  }

  return pipeline;
};
