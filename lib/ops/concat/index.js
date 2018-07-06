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
 * @name Concat
 * @description
 *  Concat two inputs in one image
 * @example
 *  Concat(inputImage1, inputImage2, ['1.r', '1.g', '2.b', '2.a']);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 * @param {Array.<string>} [mask] - Array that should describe the needed output.
 *  This should be an array of strings in format "{number of input}.{vector component}",
 *  see example for more.
 *
 *  ⚠️ STILL UNDER DEVELOPMENT (EXPERIMENTAL, API COULD BE CHANGED OR DEPRECATED)
 */

export default (tA, tB, mask = ['1.r', '1.g', '2.b', '2.a']) => {
  utils.assert(
    tA.dtype === tB.dtype,
    `Concat operation: inputs should have the same dtype, got ${tA.dtype} and ${tB.dtype}`,
  );

  utils.assert(
    mask.length === 4,
    'Concat operation: wrong input',
  );

  for (let i = 0; i < mask.length; i += 1) {
    utils.assert(
      typeof mask[i] === 'string' || !/^\d\.(r|g|b|a|x|y|z|w)$/.test(mask[i]),
      'Concat operation: wrong input',
    );
  }

  return new RegisterOperation('Concat')
    .Input('tA', tA)
    .Input('tB', tB)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel.replace('RESULT', `vec4(${mask.map(s => `chanels${s}`).join(', ')})`))
    .Compile({ tA, tB });
};
