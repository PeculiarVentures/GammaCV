/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import norm from '../norm';
import transformKernel from './transform.glsl';
import enhanceKernel from './enhance.glsl';
import peaksKernel from './peaks.glsl';


const TopKCandidates = (tSrc, k = 10, f = 0) => new RegisterOperation('ExtractPeaks')
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

const PCLinesTransform = (tSrc, length = 0.1, step = 3) => {
  const size = Math.max(tSrc.shape[0], tSrc.shape[1]);

  return new RegisterOperation('PCLinesTransform')
    .Input('tSrc', 'float32')
    .Output('uint8')
    .Uniform('uWidth', 'float', tSrc.shape[1])
    .Uniform('uHeight', 'float', tSrc.shape[0])
    .Uniform('uLineLength', 'float', length)
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

const EnhancePCLines = tSrc => new RegisterOperation('PCLinesTransformEnhanced')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .Uniform('uWidth', 'float', tSrc.shape[0])
  .Uniform('uHeight', 'float', tSrc.shape[0])
  .LoadChunk('pickValue')
  .GLSLKernel(enhanceKernel)
  .Compile({ tSrc });


export default (input) => {
  let pipeline = input;

  pipeline = PCLinesTransform(pipeline, 0.0, 1);
  pipeline = EnhancePCLines(pipeline);
  pipeline = norm(pipeline, 'minmax');
  pipeline = TopKCandidates(pipeline, 2);
  pipeline = TopKCandidates(pipeline, 2, 1);

  return pipeline;
};
