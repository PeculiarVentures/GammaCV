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

/**
 * @name MotionDetect
 * @description
 *  Promitive motion detector based on subsctruction
 *  of frames.
 * @example
 *  motionDetect(currentImage, previousImage);
 * @param {Tensor} tCurr - Current frame.
 * @param {Tensor} tPrev - Previous frame.
 */

export default (tCurr, tPrev) => {
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
