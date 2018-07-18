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
import Tensor from '../../program/tensor';

/**
 * @name Dilation
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
  kernelSize = [2, 2],
  tKernel = false,
) => {
  utils.assert(
    kernelSize.length === 2,
    'Dilation: Kernel size should be shape of rank 2',
  );

  if (utils.isTensor(tKernel)) {
    utils.assert(
      kernelSize[0] === tKernel.shape[0] && kernelSize[1] === tKernel.shape[1],
      'Dilation: Structure element has wrong size',
    );
  }

  if (!tKernel) {
    tKernel = new Tensor('float32', [kernelSize[0], kernelSize[1], 4]);

    for (let x = 0; x < kernelSize[0]; x += 1) {
      for (let y = 0; y < kernelSize[1]; y += 1) {
        tKernel.set(x, y, 0, 1);
        tKernel.set(x, y, 1, 1);
        tKernel.set(x, y, 2, 1);
        tKernel.set(x, y, 3, 1);
      }
    }
  }

  return new RegisterOperation('Dilation')
    .Input('tSrc', tSrc.dtype)
    .Input('tKernel', 'float32')
    .Output(tSrc.dtype)
    .Constant('KW', kernelSize[0])
    .Constant('KH', kernelSize[1])
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc, tKernel });
};
