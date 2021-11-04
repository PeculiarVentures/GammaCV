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
 *  threshold will be applied to the given channel.
 * @example
 *  gm.threshold(inputImage, 0.5);
 * @param {Tensor} tSrc - The source to be thresholded.
 * @param {number} threshold - Value to be applied
 * @param {number} channel - Channel to be applied
 */

export default (tSrc: InputType, threshold = 0.5, channel = 0) => {
  utils.assert(
    typeof threshold === 'number',
    'Only number available as a threshold value.',
  );

  utils.assert(
    channel === 0 || channel === 1 || channel === 2 || channel === 3,
    'Only RGBA available: 0, 1, 2, 3',
  );

  return new RegisterOperation('Threshold')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .Constant('C', channel)
    .Uniform('uT', 'float', threshold)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
