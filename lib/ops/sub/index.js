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
 * @name Substract
 * @description
 *  Pixel wise substruction tensor A from tensor B
 * @example
 *  Concat(inputImage1, inputImage2, ['1.r', '1.g', '2.b', '2.a']);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export default (tA, tB) => {
  utils.assert(
    tA.dtype === tB.dtype,
    `Substract: inputs should have the same dtype, got ${tA.dtype} and ${tB.dtype}`,
  );

  utils.assert(
    tA.shape[0] === tB.shape[0] && tA.shape[1] === tB.shape[1] && tA.shape[3] === tB.shape[3],
    `Substract: inputs should have the same shapes, got ${tA.shape} and ${tB.shape}`,
  );

  return new RegisterOperation('Substract')
    .Input('tA', tA)
    .Input('tB', tB)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tA, tB });
};
