/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import * as utils from '../../utils';
import kernelSub from './sub.glsl';
import kernelSubScalar from './sub_scalar.glsl';
import kernelAdd from './add.glsl';
import kernelAddScalar from './add_scalar.glsl';
import kernelMult from './mult.glsl';
import kernelMultScalar from './mult_scalar.glsl';
import kernelDiv from './div.glsl';
import kernelDivScalar from './div_scalar.glsl';

const basicValidation = (name, tA, tB) => {
  utils.assert(
    tA.dtype === tB.dtype,
    `${name}: inputs should have the same dtype, got ${tA.dtype} and ${tB.dtype}`,
  );

  utils.assert(
    tA.shape[0] === tB.shape[0] && tA.shape[1] === tB.shape[1] && tA.shape[3] === tB.shape[3],
    `${name}: inputs should have the same shapes, got ${tA.shape} and ${tB.shape}`,
  );
};

/**
 * @name Sub
 * @description
 *  Pixel wise substruction A - B
 * @example
 *  gm.sub(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const sub = (tA, tB) => {
  const name = 'Sub';

  basicValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA)
    .Input('tB', tB)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelSub)
    .Compile({ tA, tB });
};

/**
 * @name Add
 * @description
 *  Pixel wise sum A + B
 * @example
 *  gm.add(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const add = (tA, tB) => {
  const name = 'Add';

  basicValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA)
    .Input('tB', tB)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelAdd)
    .Compile({ tA, tB });
};

/**
 * @name Div
 * @description
 *  Pixel wise divide A / B
 * @example
 *  gm.div(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const div = (tA, tB) => {
  const name = 'Div';

  basicValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA)
    .Input('tB', tB)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelDiv)
    .Compile({ tA, tB });
};

/**
 * @name Mult
 * @description
 *  Pixel wise muliply A * B
 * @example
 *  gm.mult(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const mult = (tA, tB) => {
  const name = 'Mult';

  basicValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA)
    .Input('tB', tB)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelMult)
    .Compile({ tA, tB });
};

export const subScalar = (tA, scalar) => {
  return new RegisterOperation('SubScalar')
    .Input('tA', tA)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelSubScalar)
    .Compile({ tA });
};

export const addScalar = (tA, scalar) => {
  return new RegisterOperation('AddScalar')
    .Input('tA', tA)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelAddScalar)
    .Compile({ tA });
};

export const divScalar = (tA, scalar) => {
  return new RegisterOperation('DivScalar')
    .Input('tA', tA)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelDivScalar)
    .Compile({ tA });
};

export const multScalar = (tA, scalar) => {
  return new RegisterOperation('MultScalar')
    .Input('tA', tA)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelMultScalar)
    .Compile({ tA });
};
