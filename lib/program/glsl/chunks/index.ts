/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import main from './main.js';
import floatCode from './float.glsl';
import pickValue from './pick_value';

/**
 * @name GLSLChunks
 * @description WebGL chunks is a set of helper functions that help enable code reuse
 * and utilize higher-level abstractions in your GPU kernels.
 * To use chunk, you must type `operationsRegister.LoadChunk(...chunkNames)`.
 * Some chunks are used under the hood, it is:
 * - `main` - Used to wrap operations into a smart entry point.
 * - `float` - Used as a polyfill the float textures on some devices.
 */

/**
 * @name pickValue_INPUTNAME
 * @function
 * @description Returns pixel data of `texture` with the same
 * coordinates as current operation pixel.
 * @param {float} y - coordinate of needed pixel
 * @param {float} x - coordinate of needed pixel
 * @returns {vec4}
*/

const float = () => floatCode;

export {
  main,
  pickValue,
  float,
};
