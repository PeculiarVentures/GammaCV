/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2020 Peculiar Ventures.
 * All rights reserved.
 */

import * as gm from '../../';
import kernel from './kernel.glsl';

/**
 * @name Linearize
 * @description
 *  Pack the r channel of each pixel into a raw array,
 *  as op output of calculated shape
 *  Could be useful when need only 1-depth data per pixel (for ex. grayscaled)
 *  and want to get a raw array output.
 * @example
 *  const tensor = new gm.Tensor([2, 2, 4], 'uint8', new Uint8Array([
 *    1, 0, 0, 0, 2, 0, 0, 0,
 *    3, 0, 0, 0, 4, 0, 0, 0,
 *  ]))
 *  tSrc(input);
 *  will output:
 *  new gm.Tensor([1, 1, 4], 'uint8', new Uint8Array([
 *    1, 2, 3, 4,
 *  ]))
 * @param {Tensor|Operation} tSrc - Input data to linerize.
 */


export default (tSrc) => {
  const pixels = tSrc.shape[1] * tSrc.shape[0];
  const height = Math.ceil(Math.min(tSrc.shape[0], tSrc.shape[1]) / 4);
  const width = Math.ceil((pixels / 4) / height);

  return new gm.RegisterOperation('LinearizePixels')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .SetShapeFn(() => [height, width, 4])
    .Constant('INPUT_SHAPE', `vec2(${tSrc.shape[1]}, ${tSrc.shape[0]})`)
    .GLSLKernel(kernel)
    .LoadChunk('pickValue')
    .Compile({ tSrc });
};
