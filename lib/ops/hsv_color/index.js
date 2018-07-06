/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import RGBToHSVKernel from './rgb_to_hsv.glsl';
import HSVToRGBKernel from './hsv_to_rgb.glsl';
import * as utils from '../../utils';

/**
 * @name HSVColorConverter
 * @description
 *  Convert RGB color to HSV spave and vice versa,
 *  [original code](http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl).
 * @example
 *  // this line convert RGB space to HSV
 *  gm.HSVColor(inputImage, 'rgb_to_hsv');
 * @param {Tensor} tSrc - The input image
 * @param {Tensor} type - Operation supports two types of conversion: `rgb_to_hsv`, `hsv_to_rgb`.
 */

export default (tSrc, type = 'rgb_to_hsv') => {
  utils.assert(
    type === 'rgb_to_hsv' || type === 'hsv_to_rgb',
    `Unsupported type ${type}, currenlty avaliable: rgb_to_hsv, hsv_to_rgb.`,
  );

  let kernel = null;

  if (type === 'rgb_to_hsv') {
    kernel = RGBToHSVKernel;
  }

  if (type === 'hsv_to_rgb') {
    kernel = HSVToRGBKernel;
  }

  return new RegisterOperation('HSV')
    .Input('tSrc', tSrc.dtype)
    .Output(tSrc.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernel)
    .Compile({ tSrc });
};
