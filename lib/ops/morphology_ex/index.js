/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import erode from '../erode';
import dilate from '../dilate';

/**
 * @name MorphTransform
 * @description
 *  Dilation is one of the basic operations in mathematical morphology.
 *  Originally developed for binary images, it has been expanded first to grayscale images,
 *  and then to complete lattices. The dilation operation usually uses a structuring element
 *  for probing and expanding the shapes contained in the input image.
 *  [Wiki](https://en.wikipedia.org/wiki/Dilation_(morphology))
 * @example
 *  gm.dilate(inputImage, [3, 3]);
 * @param {Tensor} tSrc - The source image to be downsampled.
 * @param {Array.<number>} kernelSize - Size of structure element.
 * @param {Array.<number>} step - Discretization step
 * @param {Tensor} tKernel - Optional kernel.
 */

export default (
  tSrc,
  type = 'open',
  kernelSize = [2, 2],
  tKernel = false,
) => {
  switch (type) {
    case 'open':
      return dilate(erode(tSrc, kernelSize, tKernel), kernelSize, tKernel);
    case 'close':
      return erode(dilate(tSrc, kernelSize, tKernel), kernelSize, tKernel);
    default:
      return new Error(`MorphTransform: unsopported operation type ${type}`);
  }
};
