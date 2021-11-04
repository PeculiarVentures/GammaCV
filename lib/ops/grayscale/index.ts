/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';

/**
 * @name Grayscale
 * @description
 *  Grayscale of the input image by formula of luminosity
 *  R * 0.2126 + G * 0.7152 + B * 0.0722
 * @example
 *  gm.grayscale(inputImage);
 * @param {Tensor} tSrc - The source image to be grayscaled.
 */

export default (tSrc: InputType) => new RegisterOperation('Grayscale')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .LoadChunk('pickValue')
  .GLSLKernel(kernel)
  .Compile({ tSrc });
