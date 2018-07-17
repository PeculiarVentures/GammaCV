/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Convolutiion from '../conv2d';
import { gaussianBlur } from '../conv2d/kernels';
import * as utils from '../../utils';

/**
 * @name GaussianBlur
 * @description
 *  This operation is default blur operation which actually
 *  convolution with Gaussian kernel.
 * @example
 *  gaussianBlur(inputImage, 5, 3);
 * @param {Tensor} tSrc - The source image to be grayscaled.
 * @param {number} kernelSize - Size of the kernel.
 * @param {number} sigma - Sigma coeficient value.
 */

export default (tSrc, kernelSize = 3, sigma = 3) => {
  utils.assert(
    kernelSize >= 3,
    'Kernel size should be greater equal 3',
  );

  utils.assert(
    sigma > 0,
    'Sigma should be greater then 0',
  );

  return Convolutiion(tSrc, gaussianBlur(sigma));
};
