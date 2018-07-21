/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import * as utils from '../../utils';
import summedAreaTable from '../summed_area_table';
import kernel from './kernel.glsl';

/**
 * @name AdaptiveThreshold
 * @description
 *  Applyes an adaptive threshold to the input image,
 *  threshold will be applied to the given channel.
 *  [Original paper](https://www.researchgate.net/publication/220494200_Adaptive_Thresholding_using_the_Integral_Image)
 * @example
 *  gm.adaptiveThreshold(inputImage);
 * @param {Tensor} tSrc - The source to be thresholded.
 * @param {Tensor} [uS] - Size of the avarange box
 * @param {number} [threshold] - Percent of the diff to mark black
 * @param {number} [channel] - Channel to be applied
 * @param {number} [tIntegralImage] - summed area table of the input
 */

export default (
  tSrc,
  uS = 5,
  threshold = 50,
  channel = 0,
  tIntegralImage = summedAreaTable(tSrc),
) => {
  utils.assert(
    typeof threshold === 'number',
    'Only number available as a threshold value.',
  );

  utils.assert(
    typeof uS === 'number',
    'Only number available as a size value.',
  );

  utils.assert(
    channel === 0 || channel === 1 || channel === 2 || channel === 3,
    'Only RGBA available: 0, 1, 2, 3',
  );

  return new RegisterOperation('Threshold')
    .Input('tSrc', tSrc.dtype)
    .Input('tIntegralImage', tIntegralImage.dtype)
    .Output(tSrc.dtype)
    .Constant('C', channel)
    .Uniform('uS', 'float', uS)
    .Uniform('uT', 'float', threshold)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc, tIntegralImage });
};
