/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import resizeOp from '../resize';

/**
 * @name Upsample
 * @description
 *  Your algorithms or other operations may rely on larger input than you have.
 *  You may use this operation to solve this, or for any other purposes.
 * @example
 *  // this line enlarge an input image in 3x
 *  upsample(inputImage, 3);
 * @param {Tensor} tSrc - The source image to be upsampled.
 * @param {number} coefficient - Upsampling coefficient.
 * @param {string} [type] - Upsampling support two possible variants of interpolation
 *  'nearest', 'bicubic'.
 */

export default (tSrc, coefficient = 2, type = 'nearest') => {
  const newW = ~~(tSrc.shape[1] * coefficient);
  const newH = ~~(tSrc.shape[0] * coefficient);

  return resizeOp(tSrc, newW, newH, type);
};

