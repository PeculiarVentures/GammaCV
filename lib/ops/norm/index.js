/**
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * @license MIT
 */

import RegisterOperation from '../../program/operation_register';
import meanStdOp from '../mean_std';
import minMaxOp from '../minmax';
import l2Kernel from './l2.glsl';
import minMaxKernel from './minmax.glsl';
import * as utils from '../../utils';

const l2Norm = (tSrc, tStdMean) => new RegisterOperation('l2Norm')
  .Input('tSrc', 'uint8')
  .Input('tStdMean', 'uint8')
  .Output('uint8')
  .LoadChunk('pickValue')
  .GLSLKernel(l2Kernel)
  .Compile({ tSrc, tStdMean });

const minMaxNorm = (tSrc, tMinMax) => new RegisterOperation('minMaxNorm')
  .Input('tSrc', 'uint8')
  .Input('tMinMax', 'uint8')
  .Output('uint8')
  .LoadChunk('pickValue')
  .GLSLKernel(minMaxKernel)
  .Compile({ tSrc, tMinMax });

  /**
 * @name Normalization
 * @description Normalize given data by picked normalization type
 * @param {Tensor} tSrc - Input data
 * @param {string} type - normalization type, currently supported ['l2', 'minmax']
 * @param {number} parallelReductionLayers -
 *  Number of layers for a parallel reduction
 */
export default (tSrc, type, parallelReductionLayers = 2) => {
  utils.assert(
    type === 'l2' || type === 'minmax',
    `Unsupported type of normalization operation.
     Currently availiable max and visualize.`,
  );

  let operation = null;

  if (type === 'l2') {
    operation = l2Norm(tSrc, meanStdOp(tSrc, parallelReductionLayers));
  }

  if (type === 'minmax') {
    operation = minMaxNorm(tSrc, minMaxOp(tSrc, parallelReductionLayers));
  }

  return operation;
};
