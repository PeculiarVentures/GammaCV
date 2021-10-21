/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */


import resizeOp from '../resize';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

/**
 * @name Downsample
 * @description
 *  Performance is always important, but some algorithms are very expensive to apply
 *  to large picture sizes. To accommodate for this in Computer Vision we often need
 *  reduce an original image to a smaller size before we apply a given algorithm.
 * @example
 *  // this line reduces an input image in 3x
 *  gm.downsample(inputImage, 3, 'nearest');
 * @param {Tensor} tSrc - The source image to be downsampled.
 * @param {number} coefficient - Downsampling coefficient.
 * @param {string} [type] - Downsampling support two possible variants of processing
 *  pixels to be downsampled 'bicubic', 'nearest'.
 */

export default (tSrc: Tensor | Operation | MediaInput, coefficient = 2, type = 'nearest') => {
  const newW = ~~(tSrc.shape[1] / coefficient);
  const newH = ~~(tSrc.shape[0] / coefficient);

  return resizeOp(tSrc, newW, newH, type);
};
