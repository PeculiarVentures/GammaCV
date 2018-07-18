/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import Tensor from '../../program/tensor';
import kernel from './kernel.glsl';
import * as utils from '../../utils';

/**
 * @name Erosion
 * @description
 *  Erosion is one of two fundamental operations (the other being dilation)
 *  in morphological image processing from which all other morphological operations are based.
 *  It was originally defined for binary images, later being extended to grayscale images,
 *  and subsequently to complete lattices.
 *  [Wiki](https://en.wikipedia.org/wiki/Erosion_(morphology))
 * @example
 *  gm.erode(inputImage, [3, 3]);
 * @param {Tensor} tSrc - The source image to be downsampled.
 * @param {Array.<number>} kernelSize - Size of structure element.
 * @param {Array.<number>} step - Discretization step
 * @param {Tensor} tKernel - Optional kernel.
 */


export default (
  tSrc,
  kernelSize = [2, 2],
  step = [1, 1],
  tKernel = false,
) => {
  utils.assert(
    kernelSize.length === 2,
    'Erosion: Kernel size should be shape of rank 2',
  );

  utils.assert(
    step.length === 2,
    'Erosion: Step size should be shape of rank 2',
  );

  if (utils.isTensor(tKernel)) {
    utils.assert(
      kernelSize[0] === tKernel.shape[0] && kernelSize[1] === tKernel.shape[1],
      'Erosion: Structure element has wrong size',
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

  return new RegisterOperation('Erosion')
    .Input('tSrc', tSrc.dtype)
    .Input('tKernel', 'float32')
    .Output(tSrc.dtype)
    .Constant('KW', kernelSize[0])
    .Constant('KH', kernelSize[1])
    .Constant('SW', step[0])
    .Constant('SH', step[1])
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc, tKernel });
};
