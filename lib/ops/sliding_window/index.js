/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import { clacConvolution } from '../../program/utils';
import kernel from './kernel.glsl';
import kernelFlat from './kernel_flat.glsl';

function getParam(param, name) {
  if (typeof param === 'number' && param > 0 && isFinite(param)) {
    return [param, param];
  }

  if (Array.isArray(param) && param.length === 2) {
    return param;
  }

  throw new Error(`Invalid parameter "${name}", expected a positive finite number or array with 2 those numbers, but got ${String(param)}`);
}

/**
 * @name SlidingWindow
 * @description
 *  We want to keep our algorythms clear, so to prepare a data for another
 *  algorythm we need a kind of getting data in different view. SlidingWindow is a helper
 *  in searching objects in an image, putting each window snaphot as a column,
 *  this makes easier to apply another algorythms that should wokrs with that data.
 * @example
 *  // this operation will output data in next stragtegy:
 *  // |xyzw|    |xyzqwe|
 *  // |qwer| -> |yzwwer|
 *  // |asdf|    |qweasd|
 *  //           |wersdf|
 *  // where each column is a one state of sliding window,
 *  // and each pixel in a row is a one pixel in a sliding window.
 *  slidingWindowOp(inputImage, 2, 1, 0);
 * @param {Tensor} tSrc - The source data to be processed.
 * @param {number|Array.<number>} windowSize
 * @param {number|Array.<number>} [stride] - window stride.
 * @param {number} [strategy] - output shape strategy.
 *  ENUM:
 *    0(default): [WH * WW, N, 4];
 *    1: [N, WH * WW, 4];
 *    2: [1, WH * WW * N, 4];
 *    2: [WH * WW * N, 1, 4];
 *  LEGEND:
 *    WH - window height,
 *    WW - window width,
 *    N - number of possible windows.
 *
 * TODO: Reviw description ([@worldthirteen](https://github.com/worldthirteen), [@apilguk](https://github.com/apilguk))
 * TODO: Review strategy API
 */

const slidingWindowOp = (tSrc, windowSize, stride = 1, stragtegy = 0) => {
  const win = getParam(windowSize, 'windowSize');
  const str = getParam(stride, 'stride');
  const SX = clacConvolution(tSrc.shape[1], win[0], str[0]);
  const SY = clacConvolution(tSrc.shape[0], win[1], str[1]);

  let outputShape;
  let kernelCode;
  let SWAP_COORDS;

  switch (stragtegy) {
    case 1:
      outputShape = [SX * SY, win[0] * win[1], 4];
      SWAP_COORDS = true;
      kernelCode = kernel;
      break;
    case 2:
      outputShape = [1, SX * SY * win[0] * win[1], 4];
      SWAP_COORDS = false;
      kernelCode = kernelFlat;
      break;
    case 3:
      outputShape = [SX * SY * win[0] * win[1], 1, 4];
      SWAP_COORDS = true;
      kernelCode = kernelFlat;
      break;
    case 0:
    default:
      outputShape = [win[0] * win[1], SX * SY, 4];
      SWAP_COORDS = false;
      kernelCode = kernel;
  }

  return new RegisterOperation('SlidingWindow')
    .Input('tSrc', 'float32')
    .Output('float32')
    .Constant('WIDTH', tSrc.shape[1])
    .Constant('HEIGHT', tSrc.shape[0])
    .Constant('SX', SX)
    .Constant('SY', SY)
    .Constant('STRIDE_Y', str[1])
    .Constant('STRIDE_X', str[0])
    .Constant('WIN_SIZE_X', win[0])
    .Constant('WIN_SIZE_Y', win[1])
    .Constant('SWAP_COORDS', SWAP_COORDS)
    .LoadChunk('pickValue')
    .SetShapeFn(() => outputShape)
    .GLSLKernel(kernelCode)
    .Compile({ tSrc });
};

export default slidingWindowOp;
