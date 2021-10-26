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
import type Tensor from '../../program/tensor';
import type Operation from '../../program/operation';
import type MediaInput from '../../program/media_input';

const pixelwiseMathOpValidation = (name: String, tA: any, tB: any) => {
  utils.assert(
    utils.isTensor(tA) || utils.isOperation(tA),
    `${name}: A input is not a Tensor or Operation instance`,
  );

  utils.assert(
    utils.isTensor(tB) || utils.isOperation(tB),
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
    utils.isTensor(tA) || utils.isOperation(tA),
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

export const sub = (tA: Tensor | Operation | MediaInput, tB: Tensor | Operation) => {
  const name = 'Sub';

  pixelwiseMathOpValidation(name, tA, tB);

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
 *  Pixel - wise sum A + B
 * @example
 *  gm.add(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const add = (tA: Tensor | Operation, tB: Tensor | Operation) => {
  const name = 'Add';

  pixelwiseMathOpValidation(name, tA, tB);

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
 *  Pixel-wise divide A / B
 * @example
 *  gm.div(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const div = (tA: Tensor | Operation, tB: Tensor | Operation) => {
  const name = 'Div';

  pixelwiseMathOpValidation(name, tA, tB);

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
 *  Pixel-wise muliply A * B
 * @example
 *  gm.mult(A, B);
 * @param {Tensor} tA - The first input
 * @param {Tensor} tB - The second input
 */

export const mult = (tA: Tensor | Operation, tB: Tensor | Operation) => {
  const name = 'Mult';

  pixelwiseMathOpValidation(name, tA, tB);

  return new RegisterOperation(name)
    .Input('tA', tA)
    .Input('tB', tB)
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

export const subScalar = (tA: Tensor | Operation, scalar: number) => {
  const name = 'SubScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA)
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

export const addScalar = (tA: Tensor | Operation, scalar: number) => {
  const name = 'AddScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA)
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

export const divScalar = (tA: Tensor | Operation, scalar: number) => {
  const name = 'DivScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    .Input('tA', tA)
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

export const multScalar = (tA: Tensor | Operation, scalar: number) => {
  const name = 'MultScalar';

  scalarMathOpValidation(name, tA, scalar);

  return new RegisterOperation(name)
    // TODO: WFT?! If you go into `Input` method you will see that `tA` must be `DType` instead of Tensor! Something wrong
    .Input('tA', tA)
    .Output(tA.dtype)
    .Uniform('uScalar', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(kernelMultScalar)
    .Compile({ tA });
};
