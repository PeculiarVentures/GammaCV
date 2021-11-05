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
 *  The operation provides an ability to resize input image.
 *  GammaCV supports a few different ways to reduce the dimension of an image, for example,
 *  we support "Nearest Neighbor Scaling" and an approach known as "Bicubic Scaling".
 *  Source of the algorithms source https://www.researchgate.net/publication/272092207_A_Novel_Visual_Cryptographic_Method_for_Color_Images
 * @example
 *  // this line reduces an input image to 128x128
 *  gm.resize(inputImage, 128, 128, 'bicubic');
 * @param {Tensor} tSrc - The source image to be resized.
 * @param {number} w - Width of output image.
 * @param {number} h - Height of output image.
 * @param {string} [type] - Resize support two possible variants of processing
 *  pixels to be resized 'nearest', 'bicubic'.
 */

export default (tSrc: InputType, w: number, h: number, type = 'nearest') => {
  utils.assert(
    type === 'nearest' || type === 'bicubic' || type === 'mean' || type === 'max',
    'ResizeOperation: Unsupported type of operation. Currently supported only "nearest" and "bicubic"',
  );

  if (type === 'mean') {
    utils.deprecationWarning('ResizeOperation: type "mean"', 'use "bicubic" instead');
    // eslint-disable-next-line no-param-reassign
    type = 'bicubic';
  }
  if (type === 'max') {
    utils.deprecationWarning('ResizeOperation: type "max"', 'use "nearest" instead');
    // eslint-disable-next-line no-param-reassign
    type = 'nearest';
  }

  utils.assert(
    w > 0 || h > 0,
    'ResizeOperation: Size of image should be greater than 0',
  );

  let t = 0;

  if (type === 'nearest') {
    t = 0;
  } else if (type === 'bicubic') {
    t = 1;
  }

  return new RegisterOperation('Resize')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .Constant('TX', tSrc.shape[1] / w)
    .Constant('TY', tSrc.shape[0] / h)
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
