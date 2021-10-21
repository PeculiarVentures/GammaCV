/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import dirrectionKernel from './dirrection.glsl';
import groupKernel from './group.glsl';
import groupMaxKernel from './group_max.glsl';
import * as utils from '../../utils';
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

const hogDirrection = (tSrc: Tensor | Operation | MediaInput) => new RegisterOperation('HOGDirection')
  .Input('tSrc', 'uint8')
  .Output('float32')
  .Uniform('uWidth', 'float', tSrc.shape[1])
  .Uniform('uHeight', 'float', tSrc.shape[0])
  .LoadChunk('pickValue')
  .GLSLKernel(dirrectionKernel)
  .Compile({ tSrc });

const hogGroup = (tSrc: Tensor | Operation | MediaInput, k: number) => new RegisterOperation('HOG')
  .Input('tSrc', 'uint8')
  .Output('float32')
  .Uniform('uSrcWidth', 'float', tSrc.shape[1])
  .Uniform('uSrcHeight', 'float', tSrc.shape[0])
  .Uniform('uWidth', 'float', ~~(tSrc.shape[1] / k) * 3)
  .Uniform('uHeight', 'float', ~~(tSrc.shape[0] / k) * 3)
  .Constant('PI', Math.PI)
  .Constant('W', ~~(tSrc.shape[1] / k))
  .Constant('H', ~~(tSrc.shape[0] / k))
  .Constant('K', k)
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tSrc.shape[0] / k) * 3, ~~(tSrc.shape[1] / k) * 3, 4])
  .GLSLKernel(groupKernel)
  .Compile({ tSrc });

const hogGroupMax = (tSrc: Tensor | Operation | MediaInput, k: number) => new RegisterOperation('HOGMax')
  .Input('tSrc', 'uint8')
  .Output('float32')
  .Uniform('uSrcWidth', 'float', tSrc.shape[1])
  .Uniform('uSrcHeight', 'float', tSrc.shape[0])
  .Uniform('uWidth', 'float', ~~(tSrc.shape[1] / k))
  .Uniform('uHeight', 'float', ~~(tSrc.shape[0] / k))
  .Constant('PI', Math.PI)
  .Constant('W', ~~(tSrc.shape[1] / k))
  .Constant('H', ~~(tSrc.shape[0] / k))
  .Constant('K', k)
  .LoadChunk('pickValue')
  .SetShapeFn(() => [~~(tSrc.shape[0] / k), ~~(tSrc.shape[1] / k), 4])
  .GLSLKernel(groupMaxKernel)
  .Compile({ tSrc });

/**
 * @name HOG
 * @description
 *  This operation allows to extract Histogram of Oriented Gradients features.
 *  Currently availiable two types:
 *    - `visualize`: will return 9 bin histogram for each segment
 *    - `max`: will return angle with maximum intencity in histogram
 * @example
 *   gm.hog(inputImage, 5, 3);
 * @param {Tensor} tSrc - The source image to be grayscaled.
 * @param {number} k - region size.
 * @param {string} type - Type of HOG features extractor, currently availiable max and visualize.
 */

export default (tSrc: Tensor | Operation | MediaInput, k = 10, type = 'max') => {
  utils.assert(
    type === 'max' || type === 'visualize',
    `Unsupported type of HOG operation.
     Currently availiable max and visualize.`,
  );

  let operation = null;

  if (type === 'max') {
    operation = hogGroupMax(hogDirrection(tSrc), k);
  }

  if (type === 'visualize') {
    operation = hogGroup(hogDirrection(tSrc), k);
  }

  return operation;
};
