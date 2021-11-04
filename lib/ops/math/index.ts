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
import kernelAdd from './add.glsl';
import kernelMult from './mult.glsl';
import kernelDiv from './div.glsl';
import kernelSubScalar from './sub_scalar.glsl';
import kernelAddScalar from './add_scalar.glsl';
import kernelMultScalar from './mult_scalar.glsl';
import kernelDivScalar from './div_scalar.glsl';

const pixelwiseMathOpValidation = (name: String, tA: any, tB: any) => {
  utils.assert(
    utils.isTensor(tA) || utils.isOperation(tA) || utils.isMediaInput(tA),
    `${name}: A input is not a Tensor or Operation instance`,
  );

  utils.assert(
    utils.isTensor(tB) || utils.isOperation(tB) || utils.isMediaInput(tB),
    `${name}: B input is not a Tensor or Operation instance`,
  );

  utils.assert(
    tA.dtype === tB.dtype,
    `${name}: inputs should have the same dtype, got ${tA.dtype} and ${tB.dtype}`,
  );

  utils.assert(
    tA.shape[0] === tB.shape[0] && tA.shape[1] === tB.shape[1] && tA.shape[3] === tB.shape[3],
    `${name}: inputs should have the same shapes, got ${tA.shape} and ${tB.shape}`,
  );
};

const scalarMathOpValidation = (name: String, tA: any, scalar: any) => {
  utils.assert(
    typeof scalar === 'number',
    `${name}: scalar value is not a number`,
  );

  utils.assert(
    utils.isTensor(tA) || utils.isOperation(tA) || utils.isMediaInput(tA),
    `${name}: A input is not a Tensor or Operation instance`,
  );
};

/**
 * @name Basic
 * @description
 *  Basic mathematical operations
 */

/**
 * @name Sub
 * @description
 *  Pixel-wise substruction A - B
 * @example
 *  gm.sub(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const sub = (tA: InputType, tB: InputType) => {
  const name = 'Sub';

  pixelwiseMathOpValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Input('tB', tB.dtype)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelSub)
    .Compile({ tA, tB });
};

/**
 * @name Add
 * @description
 *  Pixel - wise sum A + B
 * @example
 *  gm.add(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const add = (tA: InputType, tB: InputType) => {
  const name = 'Add';

  pixelwiseMathOpValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Input('tB', tB.dtype)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelAdd)
    .Compile({ tA, tB });
};

/**
 * @name Div
 * @description
 *  Pixel-wise divide A / B
 * @example
 *  gm.div(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const div = (tA: InputType, tB: InputType) => {
  const name = 'Div';

  pixelwiseMathOpValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Input('tB', tB.dtype)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelDiv)
    .Compile({ tA, tB });
};

/**
 * @name Mult
 * @description
 *  Pixel-wise muliply A * B
 * @example
 *  gm.mult(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const mult = (tA: InputType, tB: InputType) => {
  const name = 'Mult';

  pixelwiseMathOpValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Input('tB', tB.dtype)
    .Output(tA.dtype)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelMult)
    .Compile({ tA, tB });
};

/**
 * @name SubScalar
 * @description
 *  A - scalar
 * @example
 *  gm.subScalar(A, 0.5);
 * @param {Tensor} tA - Input
 * @param {number} scalar - Scalar
 */

export const subScalar = (tA: InputType, scalar: number) => {
  const name = 'SubScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelSubScalar)
    .Compile({ tA });
};

/**
 * @name AddScalar
 * @description
 *  A + scalar
 * @example
 *  gm.addScalar(A, 0.5);
 * @param {Tensor} tA - Input
 * @param {number} scalar - Scalar
 */

export const addScalar = (tA: InputType, scalar: number) => {
  const name = 'AddScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelAddScalar)
    .Compile({ tA });
};

/**
 * @name DivScalar
 * @description
 *  A / scalar
 * @example
 *  gm.divScalar(A, 0.5);
 * @param {Tensor} tA - Input
 * @param {number} scalar - Scalar
 */

export const divScalar = (tA: InputType, scalar: number) => {
  const name = 'DivScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelDivScalar)
    .Compile({ tA });
};

/**
 * @name MultScalar
 * @description
 *  A * scalar
 * @example
 *  gm.multScalar(A, 0.5);
 * @param {Tensor} tA - Input
 * @param {number} scalar - Scalar
 */

export const multScalar = (tA: InputType, scalar: number) => {
  const name = 'MultScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA.dtype)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelMultScalar)
    .Compile({ tA });
};
