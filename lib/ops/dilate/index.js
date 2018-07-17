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
  type = 'SQUARE',
) => {
  utils.assert(
    kernelSize === 2,
    'Erosion: Kernel size should be shape of rank 2',
  );

  utils.assert(
    step === 2,
    'Erosion: Step size should be shape of rank 2',
  );

  return new RegisterOperation('Dilation')
    .Input('tSrc', tSrc.dtype)
    .Input('tStructElem', 'float32')
    .Output(tSrc.dtype)
    .Constant('KW', kernelSize[0])
    .Constant('KH', kernelSize[1])
    .Constant('SW', step[0])
    .Constant('SH', step[1])
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc, tStructElem: getStructureElement(type, kernelSize) });
}