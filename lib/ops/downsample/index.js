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
 * @name Downsample
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

export default (tSrc, coeficient = 2, type = 'mean') => {
  utils.assert(
    type === 'mean' || type === 'max',
    'DownsampleOp: Unsupported type of operation. Currently sup',
  );

  let t = 0;

  if (type === 'max') {
    t = 0;
  } else if (type === 'mean') {
    t = 1;
  }

  return new RegisterOperation('Downsample')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .Constant('K', coeficient)
    .Constant('S', t)
    .SetShapeFn(() => {
      const shape = [~~(tSrc.shape[0] / coeficient), ~~(tSrc.shape[1] / coeficient), 4];

      utils.assert(
        utils.isValidOperationShape(shape),
        'DownsampleOperation: Invalid operation shape',
      );

      return shape;
    })
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
