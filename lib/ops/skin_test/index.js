/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018-2021 Peculiar Ventures.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';

/**
 * @name SkinTest
 * @description
 *  To enhance face/human detection we need an ability to test image for color that match skin
 *  color. This operation returns exact the same size image with fully red pixels
 *  rgba(255, 0, 0, 1) for pixels that match skin color and black rgba(0, 0, 0, 1) otherwise.
 * @example
 *  gm.skinTestOp(inputImage);
 * @param {Tensor} tSrc - input image
 * @param {Object} [ths] - thresholds
 *
 * @todo: Please describe a mask formula in description ([@worldthirteen](https://github.com/worldthirteen))
 */

export default (tSrc, ths = {}) => new RegisterOperation('SkinTest')
  .Input('tSrc', tSrc.dtype)
  .Output(tSrc.dtype)
  .Uniform('uRThreshold', 'float', ths.uRThreshold || 95.0)
  .Uniform('uGThreshold', 'float', ths.uGThreshold || 40.0)
  .Uniform('uBThreshold', 'float', ths.uBThreshold || 20.0)
  .Uniform('uRtoMinDiffThreshold', 'float', ths.uRtoMinDiffThreshold || 15.0)
  .Uniform('uRtoGDiffThreshold', 'float', ths.uRtoGDiffThreshold || 15.0)
  .LoadChunk('pickValue')
  .GLSLKernel(kernel)
  .Compile({ tSrc });
