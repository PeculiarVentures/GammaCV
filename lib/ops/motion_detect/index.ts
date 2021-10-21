/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';
import * as utils from '../../utils';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

/**
 * @name MotionDetect
 * @description
 *  Primitive motion detector based on subtraction
 *  of frames.
 * @example
 *  gm.motionDetect(currentImage, previousImage);
 * @param {Tensor} tCurr - Current frame.
 * @param {Tensor} tPrev - Previous frame.
 */

export default (tCurr: Tensor | Operation | MediaInput, tPrev: Tensor | Operation | MediaInput) => {
  utils.assert(
    utils.assertShapesAreEqual(tCurr, tPrev),
    'MotionDetect: Current and previous input should have the same shape.',
  );

  return new RegisterOperation('MotionDetect')
    .Input('tCurr', tCurr.dtype)
    .Input('tPrev', tPrev.dtype)
    .Output(tCurr.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tCurr, tPrev });
};
