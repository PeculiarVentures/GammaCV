/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import { parallelReductionCheckSteps2d, parallelReductionGetSteps2d } from '../../program/utils';
import getMean from './get_mean.glsl';
import getStd from './get_std.glsl';
import reduceStd from './reduce_std.glsl';
import joinKernel from './join.glsl';
import * as utils from '../../utils';

export const ImageReduceStd = (tStd, k) => new RegisterOperation('ImageReduceStd')
  .Input('tStd', tStd.dtype)
  .Output(tStd.dtype)
  .Constant('WIDTH', tStd.shape[1])
  .Constant('HEIGHT', tStd.shape[0])
  .Uniform('uWidth', 'float', tStd.shape[1] / k[1])
  .Uniform('uHeight', 'float', tStd.shape[0] / k[0])
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tStd.shape[0] / k[0]), ~~(tStd.shape[1] / k[1]), 4])
  .GLSLKernel(reduceStd)
  .Compile({ tStd });

export const ImageExtractStd = (tSrc, tMean, k) => new RegisterOperation('ImageExtractStd')
  .Input('tSrc', tSrc.dtype)
  .Input('tMean', tMean.dtype)
  .Output(tSrc.dtype)
  .Constant('WIDTH', tSrc.shape[1])
  .Constant('HEIGHT', tSrc.shape[0])
  .Uniform('uWidth', 'float', tSrc.shape[1] / k[1])
  .Uniform('uHeight', 'float', tSrc.shape[0] / k[0])
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tSrc.shape[0] / k[0]), ~~(tSrc.shape[1] / k[1]), 4])
  .GLSLKernel(getStd)
  .Compile({ tSrc, tMean });

export const ImageExtractMean = (tSrc, k) => new RegisterOperation('ImageExtractMean')
  .Input('tSrc', tSrc.dtype)
  .Output(tSrc.dtype)
  .Constant('WIDTH', tSrc.shape[1])
  .Constant('HEIGHT', tSrc.shape[0])
  .Uniform('uWidth', 'float', tSrc.shape[1] / k[1])
  .Uniform('uHeight', 'float', tSrc.shape[0] / k[0])
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tSrc.shape[0] / k[0]), ~~(tSrc.shape[1] / k[1]), 4])
  .GLSLKernel(getMean)
  .Compile({ tSrc });

export const JoinOp = (tMean, tStd) => new RegisterOperation('ImageJoin')
  .Input('tMean', tMean.dtype)
  .Input('tStd', tStd.dtype)
  .Output(tMean.dtype)
  .SetShapeFn(() => [2, 1, 4])
  .GLSLKernel(joinKernel)
  .Compile({ tMean, tStd });

/**
 * @name MeanStd
 * @description
 *  Extract mean and std of pixel values of the image
 *  Returns 2 pixels in a column, in which the top is the mean, and the bottom is the std values.
 * @param {Tensor} tSrc - Inptut image
 * @param {number} layers - Number of layers for a parallel reduction
 * @param {boolean} [ignoreStd] - if true, operatino will return only one pixel with mean values
 */

export default (tSrc, layers = 1, ignoreStd) => {
  let steps = [[
    tSrc.shape[0],
    tSrc.shape[1],
  ]];

  if (Array.isArray(layers)) {
    utils.assert(
      parallelReductionCheckSteps2d(tSrc.shape, layers),
      'ImageMeanStd: Provided steps doesn\'t converge in 1 px in ImageExtractMeanStd operation',
    );

    steps = layers;
  } else if (typeof layers === 'number' && layers > 0) {
    steps = parallelReductionGetSteps2d(tSrc.shape, layers);
  }

  let meanPipe = ImageExtractMean(tSrc, steps[0]);

  for (let i = 1; i < steps.length; i += 1) {
    meanPipe = ImageExtractMean(meanPipe, steps[i]);
  }

  if (ignoreStd) {
    return meanPipe;
  }

  let stdPipe = ImageExtractStd(tSrc, meanPipe, steps[0]);

  for (let i = 1; i < steps.length; i += 1) {
    stdPipe = ImageReduceStd(stdPipe, steps[i]);
  }

  return JoinOp(meanPipe, stdPipe);
};
