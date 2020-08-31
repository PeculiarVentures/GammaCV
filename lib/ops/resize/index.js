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
 * @name Resize
 * @description
 *  Operation provides an ability to resize input image.
 *  GammaCV support a few different ways to reduce the dimension of a image,
 *  for example we support "meaning pixels" and an approach known as "max pooling".
 *  Note: Currently operation support reducing image size, for example 256x128 -> 128x64,
 *  vice versa it may works incorrect.
 * @example
 *  // this line reduces an input image to 128x128
 *  resize(inputImage, 128, 128);
 * @param {Tensor} tSrc - The source image to be resized.
 * @param {number} w - Width of output image.
 * @param {number} h - Height of output image.
 * @param {number} type - Resize support two possible variants of processing
 *  pixels to be resized 'max', 'mean'.
 */

export default (tSrc, w = 2, h = 2, type = 'mean') => {
  utils.assert(
    type === 'mean' || type === 'max',
    'ResizeOperation: Unsupported type of operation. Currently supported only "mean" and "max"',
  );

  let t = 0;

  if (type === 'max') {
    t = 0;
  } else if (type === 'mean') {
    t = 1;
  }

  return new RegisterOperation('Resize')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .Constant('W', tSrc.shape[1] / w)
    .Constant('H', tSrc.shape[0] / h)
    .Constant('S', t)
    .SetShapeFn(() => {
      const shape = [h, w, 4];

      utils.assert(
        utils.isValidOperationShape(shape),
        'ResizeOperation: Invalid operation shape',
      );

      return shape;
    })
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
