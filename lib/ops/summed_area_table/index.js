/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernelX from './kernel_x.glsl';
import kernelY from './kernel_y.glsl';

const sum = (tSrc, c = 'x', passIndex = 0, samplesPerPass = 1) =>
  new RegisterOperation('SumedAreaTable')
    .Input('tSrc', tSrc.dtype)
    .Output('float32')
    .LoadChunk('pickValue')
    .Constant('PASSI', passIndex)
    .Constant('LAST', false)
    .Constant('SAMPLES_PER_PASS', samplesPerPass)
    .GLSLKernel(c === 'x' ? kernelX : kernelY)
    .Compile({ tSrc });

/**
 * @name SummedAreaTable
 * @description
 *  A summed-area table operationis quickly and efficiently generate
 *  the sum of values in a rectangular subset of a grid.
 *  [More on wiki](https://en.wikipedia.org/wiki/Summed-area_table).
 *
 *  [Interactive Summed-Area Table Generation... (AMD)](http://developer.amd.com/wordpress/media/2012/10/GDC2005_SATEnvironmentReflections.pdf)
 * @example
 *  summedAreaTable(inputImage);
 * @param {Tensor} tSrc - The source image to be grayscaled.
 * @param {number} [passesPerAxis] - Performance configurator of passes/samplesPerPass
 */
export default (tSrc, passesPerAxis = 2) => {
  const samplesPerPassX = Math.ceil(tSrc.shape[1] ** (1 / passesPerAxis));
  const samplesPerPassY = Math.ceil(tSrc.shape[0] ** (1 / passesPerAxis));

  let pipeline = tSrc;
  const lX = Math.log(tSrc.shape[1]) / Math.log(Math.max(samplesPerPassX + 1, 2));
  const lY = Math.log(tSrc.shape[0]) / Math.log(Math.max(samplesPerPassY + 1, 2));

  for (let i = 0; i < lX; i += 1) {
    pipeline = sum(pipeline, 'x', i, Math.min(samplesPerPassX, tSrc.shape[1] - 1));
  }

  for (let i = 0; i < lY; i += 1) {
    pipeline = sum(pipeline, 'y', i, Math.min(samplesPerPassY, tSrc.shape[0] - 1));
  }

  return pipeline;
};
