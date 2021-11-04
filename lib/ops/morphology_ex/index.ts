/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import erode from '../erode';
import dilate from '../dilate';
import { sub } from '../math';

/**
 * @name MorphTransform
 * @example
 *  gm.morphologyEx(inputImage, 'open', [3, 3]);
 * @param {Tensor} tSrc - The source image to be downsampled.
 * @param {string} type - Size of structure element.
 * @param {Array.<number>} kernelSize - Size of structure element
 * @param {Tensor} tKernel - Optional kernel.
 */

export default (
  tSrc: InputType,
  type = 'open',
  kernelSize = [2, 2],
  tKernel?: InputType,
) => {
  switch (type) {
    case 'open':
      return dilate(erode(tSrc, kernelSize, tKernel), kernelSize, tKernel);
    case 'close':
      return erode(dilate(tSrc, kernelSize, tKernel), kernelSize, tKernel);
    case 'gradient':
      return sub(
        dilate(tSrc, kernelSize, tKernel),
        erode(tSrc, kernelSize, tKernel),
      );
    case 'tophat':
      return sub(
        tSrc,
        dilate(erode(tSrc, kernelSize, tKernel), kernelSize, tKernel),
      );
    case 'blackhat':
      return sub(
        erode(dilate(tSrc, kernelSize, tKernel), kernelSize, tKernel),
        tSrc,
      );
    default:
      return new Error(`MorphTransform: unsopported operation type ${type}`);
  }
};
