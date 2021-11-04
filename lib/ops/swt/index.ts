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
 * @name StrokeWidthTransform
 * @description
 *  Find text on image, using stroke width transform.
 *  [Paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/1509.pdf).
 * @example
 *  // this line reduces an input image in 3x
 *  gm.swt(inputImage, 3, 0);
 * @param {Tensor} tSobel - The output from [SobelOperator](/docs/sobel_operator)
 * @param {Tensor} tCanny - The output from [CannyEdges](/docs/canny_edges)
 * @param {number} [min] - Minimum stroke width
 * @param {number} [max] - Maximum stroke width
 * @param {number} [steps] - How much pixels count between min and max to determine
 * @param {boolean} [retrunCoords] - Pass coordinates as output
 * @param {boolean} [invert] - Find black text on white backgound when true,
 *  and white on black when false.
 */

export default (
  tSobel: InputType,
  tCanny: InputType,
  min = 3,
  max = 10,
  steps = 10,
  returnCoords = false,
  invert = true,
) => new RegisterOperation('ImageStrokeWidthTransform')
  .Input('tSobel', 'float32')
  .Input('tCanny', 'uint8')
  .Output('float32')
  .LoadChunk('pickValue')
  .Uniform('uStrokeMin', 'float', min)
  .Uniform('uStrokeMax', 'float', max)
  .Uniform('uWidth', 'float', tSobel.shape[0])
  .Uniform('uHeight', 'float', tSobel.shape[1])
  .Constant('STEPS', steps)
  .Constant('C', returnCoords ? 1 : 0)
  .Constant('INVERT', invert ? 1 : 0)
  .Constant('PI', Math.PI)
  .GLSLKernel(kernel)
  .Compile({ tCanny, tSobel });
