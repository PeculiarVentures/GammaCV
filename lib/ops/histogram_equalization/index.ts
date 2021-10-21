/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import histogramOp from '../histogram';
import histKernel from './hist.glsl';
import histCumulateKernel from './hist_cumulative.glsl';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

const cumulateHistEq = (tSrc: Tensor | Operation | MediaInput) => new RegisterOperation('histogramCumulation')
  .Input('tSrc', 'float32')
  .Output('float32')
  .LoadChunk('pickValue')
  .GLSLKernel(histCumulateKernel)
  .Compile({ tSrc });

const histEq = (tSrc: Tensor | Operation | MediaInput, tHist: Tensor | Operation | MediaInput) => new RegisterOperation('histogramEqualization')
  .Input('tSrc', 'uint8')
  .Input('tHist', 'float32')
  .Output('uint8')
  .LoadChunk('pickValue')
  .GLSLKernel(histKernel)
  .Compile({ tSrc, tHist });


/**
 * @name Histogram Equalization
 * @description
 *  Equalize histogram for given image
 * @param {Tensor} tSrc - Input image
 * @param {number} parallelReductionLayers -
 *  Number of layers for a parallel reduction of histogram extraction
 */

export default (tSrc: Tensor | Operation | MediaInput, parallelReductionLayers = 2) =>
  histEq(tSrc, cumulateHistEq(histogramOp(tSrc, parallelReductionLayers)));
