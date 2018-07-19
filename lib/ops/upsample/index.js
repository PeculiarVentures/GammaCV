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
 * @name Upsample
 * @description
 *  Your algoritms or other operations may rely on larger input than you have.
 *  You may use this operation to solve this, or for any other purposes.
 * @example
 *  // this line enlarge an input image in 3x
 *  downsample(inputImage, 3);
 * @param {Tensor} tSrc - The source image to be upsampled.
 * @param {number} coeficient - Upsampling coeficient.
 * @param {number} type - Upsampling support two possible variants of processing
 *  pixels to be upsamples 'near', 'mean'.
 */

export default (tSrc, coeficient = 2, type = 'near') => {
  utils.assert(
    type === 'near' || type === 'mean',
    'UpsampleOp: Unsupported type of operation. Currently supported "near" and "mean"',
  );

  let t = 0;

  if (type === 'near') {
    t = 0;
  } else if (type === 'mean') {
    t = 1;
  }

  return new RegisterOperation('Upsample')
    .Input('tSrc', 'uint8')
    .Output('uint8')
    .Constant('K', coeficient)
    .Constant('S', t)
    .SetShapeFn(() => {
      const shape = [~~(tSrc.shape[0] * coeficient), ~~(tSrc.shape[1] * coeficient), 4];

      utils.assert(
        utils.isValidOperationShape(shape),
        'UpsampleOperation: Invalid operation shape',
      );

      return shape;
    })
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
