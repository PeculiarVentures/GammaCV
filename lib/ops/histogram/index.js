/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2022 Peculiar Ventures.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import { parallelReductionCheckSteps2d, parallelReductionGetSteps2d } from '../../program/utils';
import getHistogramKernel from './get_histogram.glsl';
import reduceKernel from './reduce.glsl';
import * as utils from '../../utils';
import ENV from '../../program/environment';

export const ImageExtractHistogram = (tSrc, k, min, max, step, count) => new RegisterOperation('ImageExtractHistogram')
  .Input('tSrc', tSrc.dtype)
  .Output('float32')
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .Constant('MIN', min)
  .Constant('MAX', max)
  .Constant('STEP', step)
  .Constant('COUNT', count)
  .SetShapeFn(() => [~~(tSrc.shape[0] / k[0]), ~~(tSrc.shape[1] / k[1]) * count, 4])
  .GLSLKernel(getHistogramKernel)
  .Compile({ tSrc });

export const ImageReduceHistogram = (tSrc, k, count) => new RegisterOperation('ImageReduceHistogram')
  .Input('tSrc', 'float32')
  .Output('float32')
  .Constant('KX', k[1])
  .Constant('KY', k[0])
  .LoadChunk('pickValue')
  .Constant('COUNT', count)
  .SetShapeFn(() => [~~(tSrc.shape[0] / k[0]), ~~(tSrc.shape[1] / k[1]), 4])
  .GLSLKernel(reduceKernel)
  .Compile({ tSrc });

/**
 * @name Histogram
 * @description
 *  Extract histogram for given image and parameters.
 *  Results in [1, histogramRange, 4] float matrix.
 * @example
 *  gm.histogram(tSrc);
 * @example
 *  const op = gm.histogram(tSrc);
 * // ... init, run, read into tOut, see Get Started for details ...
 * tOut.get(0, 0, 0); // get n of entires for lowest value in red channel
 * tOut.get(0, tOut.shape[1] - 1, 4); // get n of entries for highest value in "alpha" channel
 * @param {Tensor} tSrc - Input image
 * @param {number} [layers] -
 *  Number of layers for a parallel reduction (1 by default), impact the performance
 * @param {number} [min] - Minimal value in image
 * @param {number} [max] - Maximum value in image
 * @param {number} [step] - Step between min and max values.
 * @todo Enhance operation to be not sensible to input size and layers count,
 *  now we have danger limit (input width / first layer k) to be less then MAX_TEXTURE_SIZE.
 */

export default (tSrc, layers = 1, min = 0, max = 1, step = 1 / 255) => {
  // TODO: Probably we should refactor arguments priority and add assertion for them
  let steps = [[
    tSrc.shape[0],
    tSrc.shape[1],
  ]];

  const count = ~~((max - min + step) / step);

  if (Array.isArray(layers)) {
    utils.assert(
      parallelReductionCheckSteps2d(tSrc.shape, layers),
      'ImageExtractHistogram: Provided steps doesn\'t converge in 1 px in operation',
    );

    steps = layers;
  } else if (typeof layers === 'number' && layers > 0) {
    steps = parallelReductionGetSteps2d(
      tSrc.shape,
      layers,
      true,
      [ENV.MAX_TEXTURE_SIZE, ENV.MAX_TEXTURE_SIZE / 256 / (ENV.SUPPORTS_FLOAT_TEXTURES ? 1 : 4)],
    );
  }

  let histogramPipe = ImageExtractHistogram(tSrc, steps[0], min, max, step, count);

  for (let i = 1; i < steps.length; i += 1) {
    histogramPipe = ImageReduceHistogram(histogramPipe, steps[i], count);
  }

  return histogramPipe;
};
