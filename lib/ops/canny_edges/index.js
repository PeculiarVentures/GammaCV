/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import nmsKernel from './nms.glsl';
import hysteresisKernel from './hysteresis.glsl';
import * as utils from '../../utils';

const CannyNMS = tSrc => new RegisterOperation('ImageCannyEdgesNMS')
  .Input('tSrc', tSrc.dtype)
  .Output(tSrc.dtype)
  .LoadChunk('pickValue')
  .Uniform('uSize', 'float', 1)
  .Constant('PI', Math.PI)
  .GLSLKernel(nmsKernel)
  .Compile({ tSrc });

const CannyHysteresis = (tSrc, low, high) => {
  utils.assert(
    low >= 0,
    'Canny low threshold should be greater equal 0',
  );

  utils.assert(
    high <= 1,
    'Canny high threshold should be less equal 1',
  );

  return new RegisterOperation('ImageCannyEdgesHysteresis')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .LoadChunk('pickValue')
    .Uniform('uSize', 'float', 1)
    .Uniform('uThresholdLow', 'float', low)
    .Uniform('uThresholdHigh', 'float', high)
    .GLSLKernel(hysteresisKernel)
    .Compile({ tSrc });
};

/**
 * @name CannyEdges
 * @description
 *  The Canny edge detector is an edge detection operator that uses
 *  a multi-stage algorithm to detect a wide range of edges in images.
 *  [Read more on Wiki](https://en.wikipedia.org/wiki/Canny_edge_detector).
 * @example
 *  cannyEdges(inputImage, 0.25, 0.75);
 * @param {Tensor} sobel - Sobel derivatives operation output [sobelOperator](https://en.wikipedia.org/wiki/Canny_edge_detector).
 * @param {number} low - Low threshold to be applied.
 * @param {number} high - High threshold to be applied.
 */

export default (input, low = 0.25, high = 0.75) => CannyHysteresis(CannyNMS(input), low, high);
