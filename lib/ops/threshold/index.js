/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import * as utils from '../../utils';
import kernel from './kernel.glsl';

/**
 * @name Threshold
 * @description
 *  Applyes a threshold to the input image,
 *  threshold will be applied to the given chanel.
 * @example
 *  gm.threshold(inputImage, 0.5);
 * @param {Tensor} tSrc - The source to be thresholded.
 * @param {number} threshold - Value to be applied
 * @param {number} chanel - Chanel to be applied
 */

export default (tSrc, threshold = 0.5, chanel = 0) => {
  utils.assert(
    typeof threshold === 'number',
    'Only number available as a threshold value.',
  );

  utils.assert(
    chanel === 0 || chanel === 1 || chanel === 2,
    'Only RGB available: 0, 1, 2',
  );

  return new RegisterOperation('Threshold')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .Constant('C', chanel)
    .Uniform('uT', 'float', threshold)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
