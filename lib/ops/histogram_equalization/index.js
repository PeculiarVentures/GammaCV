/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2022 Peculiar Ventures.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import histogramOp from '../histogram';
import histKernel from './hist.glsl';
import histCumulateKernel from './hist_cumulative.glsl';

const cumulateHistEq = tSrc => new RegisterOperation('histogramCumulation')
  .Input('tSrc', 'float32')
  .Output('float32')
  .LoadChunk('pickValue')
  .GLSLKernel(histCumulateKernel)
  .Compile({ tSrc });

const histEq = (tSrc, tHist) => new RegisterOperation('histogramEqualization')
  .Input('tSrc', 'uint8')
  .Input('tHist', 'float32')
  .Output('uint8')
  .LoadChunk('pickValue')
  .GLSLKernel(histKernel)
  .Compile({ tSrc, tHist });


/**
 * @name Histogram Equalization
 * @description
 *  Equalize histogram for given image, result has same dimensions as input image.
 * @example
 *  gm.equalizeHistogram(tSrc);
 * @param {Tensor} tSrc - Input image
 * @param {number} [parallelReductionLayers] -
 *  Number of layers for a parallel reduction of histogram extraction (2 by default)
 */

export default (tSrc, parallelReductionLayers = 2) =>
  histEq(tSrc, cumulateHistEq(histogramOp(tSrc, parallelReductionLayers)));
