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

export const pcLinesReduceMax = (tSrc, k = 10, f = 0) => new RegisterOperation('ReduceMax')
  .Input('tSrc', 'uint8')
  .Output('float32')
  .Uniform('uSrcWidth', 'float', tSrc.shape[1])
  .Uniform('uWidth', 'float', tSrc.shape[1] / k)
  .Uniform('uHeight', 'float', tSrc.shape[0] / k)
  .Uniform('uF', 'float', f)
  .LoadChunk('pickValue')
  .Constant('SIZE', ~~(tSrc.shape[0] / k) * ~~(tSrc.shape[1] / k))
  .Constant('W', k)
  .Constant('H', k)
  .Constant('K', 1 / k)
  .SetShapeFn(() => [~~(tSrc.shape[0] / k), ~~(tSrc.shape[1] / k), 4])
  .GLSLKernel(peaksKernel)
  .Compile({ tSrc });

export const pcLinesEnhance = tSrc => new RegisterOperation('PCLinesEnhanced')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .Uniform('uWidth', 'float', tSrc.shape[0])
  .Uniform('uHeight', 'float', tSrc.shape[0])
  .LoadChunk('pickValue')
  .GLSLKernel(enhanceKernel)
  .Compile({ tSrc });

export const pcLinesTransform = (tSrc, step = 3) => {
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
 *  could be used with Canny Edges.
 * @param {number} layers - count of parallel reduction layers
 * @param {number} dStep - discretization step
 * @param {number} dCoeficient - reduction coefficient
 */

export default (input, layersCount = 2, dStep = 2, dCoeficient = 2) => {
  let pipeline = pcLinesTransform(input, dStep);

  pipeline = pcLinesReduceMax(pipeline, dCoeficient);

  for (let i = 0; i < layersCount; i += 1) {
    pipeline = pcLinesReduceMax(pipeline, dCoeficient, 1);
  }

  return pipeline;
};
