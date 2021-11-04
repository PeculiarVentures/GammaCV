/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

 import type Tensor from './program/tensor';
 import type Operation from './program/operation';
 import type MediaInput from './program/media_input';

 declare global {
  type InputType = Tensor | Operation | MediaInput;
 }

export type TensorDataView =
  Float32Array |
  Float64Array |
  Uint8Array |
  Uint16Array |
  Uint32Array |
  Int8Array |
  Int16Array |
  Int32Array |
  Uint8ClampedArray;

export type DType =
  'uint8' |
  'uint16' |
  'uint32' |
  'int8' |
  'int16' |
  'int32' |
  'float32' |
  'float64' |
  'uint8c';

export interface DTypeMapper {
  'uint8': Uint8Array;
  'uint16': Uint16Array;
  'uint32': Uint32Array;
  'int8': Int8Array;
  'int16': Int16Array;
  'int32': Int32Array;
  'float32': Float32Array;
  'float64': Float64Array;
  'uint8c': Uint8ClampedArray;
}

export type MediaInputType = HTMLVideoElement | HTMLCanvasElement;
export type InputType = Tensor | Operation | MediaInput;

export { default as Session } from './program/session';
export { default as GLTexture } from './program/texture';
export { default as RegisterOperation } from './program/operation_register';
export { default as Tensor } from './program/tensor';
export { default as Operation } from './program/operation';
export { default as MediaInput } from './program/media_input';

export * from './io';
export * from './utils';
export * from './ops';
export * from './program/tensor_utils';
export * from './math';
