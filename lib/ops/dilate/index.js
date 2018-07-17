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
 *  Performance is always important, but some algorithms are very expensive to apply
 *  to large picture sizes. To accommodate for this in Computer Vision we often need
 *  reduce an original image to a smaller size before we apply a given algorithm,
 *  GammaCV support a few different ways to reduce the dimension of a image,
 *  for example we support "meaning pixels" and an approach known as "MaxPooling".
 * @example
 *  // this line reduces an input image in 3x
 *  downsample(inputImage, 3, 0);
 * @param {Tensor} tSrc - The source image to be downsampled.
 * @param {number} coeficient - Downsampling coeficient.
 * @param {number} type - Downsampling support two possible variants of processing
 *  pixels to be downsampled 'max', 'mean'.
 */

export default (
  tSrc,
  kernelSize = [2, 2],
  step = [1, 1],
  tStructureElement = false,
) => {
  utils.assert(
    kernelSize.length === 2,
    'Dilation: Kernel size should be shape of rank 2',
  );

  utils.assert(
    step.length === 2,
    'Dilation: Step size should be shape of rank 2',
  );

  if (utils.isTensor(tStructureElement)) {
    utils.assert(
      kernelSize[0] === tStructureElement.shape[0] && kernelSize[1] === tStructureElement.shape[1],
      'Dilation: Structure element has wrong size',
    );
  }

  if (!tStructureElement) {
    tStructureElement = new Tensor('float32', [kernelSize[0], kernelSize[1], 4]);

    for (let x = 0; x < kernelSize[0]; x += 1) {
      for (let y = 0; y < kernelSize[1]; y += 1) {
        tStructureElement.set(x, y, 0, 1);
        tStructureElement.set(x, y, 1, 1);
        tStructureElement.set(x, y, 2, 1);
        tStructureElement.set(x, y, 3, 1);
      }
    }
  }

  return new RegisterOperation('Dilation')
    .Input('tSrc', tSrc.dtype)
    .Input('tStructureElement', 'float32')
    .Output(tSrc.dtype)
    .Constant('KW', kernelSize[0])
    .Constant('KH', kernelSize[1])
    .Constant('SW', step[0])
    .Constant('SH', step[1])
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc, tStructureElement });
};
