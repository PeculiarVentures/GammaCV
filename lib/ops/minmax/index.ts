/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import { parallelReductionCheckSteps2d, parallelReductionGetSteps2d } from '../../program/utils';
import getMinMax from './get_minmax.glsl';
import reduceMinMax from './reduce_minmax.glsl';
import * as utils from '../../utils';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

export const ImageExtractMinMax = (tSrc: Tensor | Operation | MediaInput, k: number[]) => new RegisterOperation('ImageExtractMinMax')
  .Input('tSrc', tSrc.dtype)
  .Output(tSrc.dtype)
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tSrc.shape[0] / k[0]) * 2, ~~(tSrc.shape[1] / k[1]), 4])
  .GLSLKernel(getMinMax)
  .Compile({ tSrc });

export const ImageReduceMinMax = (tSrc: Tensor | Operation | MediaInput, k: number[]) => new RegisterOperation('ImageReduceMinMax')
  .Input('tSrc', tSrc.dtype)
  .Output(tSrc.dtype)
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tSrc.shape[0] / k[0]), ~~(tSrc.shape[1] / k[1]), 4])
  .GLSLKernel(reduceMinMax)
  .Compile({ tSrc });

/**
 * @name MinMax
 * @description
 *  Extract min and max for given image
 * @param {Tensor} tSrc - Input image
 * @param {number} layers - Number of layers for a parallel reduction
 */

export default (tSrc: Tensor | Operation | MediaInput, layers = 1) => {
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

  let minMaxPipe = ImageExtractMinMax(tSrc, steps[0]);

  for (let i = 1; i < steps.length; i += 1) {
    minMaxPipe = ImageReduceMinMax(minMaxPipe, steps[i]);
  }

  return minMaxPipe;
};
