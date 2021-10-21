/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import * as utils from '../../utils';
import { sat } from '../sat';
import kernel from './kernel.glsl';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

/**
 * @name AdaptiveThreshold
 * @description
 *  Applies an adaptive threshold to the input image,
 *  threshold will be applied to the given channel.
 *  [Original paper](https://www.researchgate.net/publication/220494200_Adaptive_Thresholding_using_the_Integral_Image)
 * @example
 *  gm.adaptiveThreshold(inputImage);
 * @param {Tensor} tSrc - The source to be thresholded.
 * @param {number} [uS] - Size of the avarange box
 * @param {number} [threshold] - Percent of the diff to mark black in range 0-100
 * @param {number} [channel] - Channel to be applied
 * @param {Tensor} [tIntegralImage] - summed area table of the input
 */

export default (
  tSrc: Tensor | Operation | MediaInput,
  uS = 5,
  threshold = 50,
  channel = 0,
  tIntegralImage = sat(tSrc),
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
