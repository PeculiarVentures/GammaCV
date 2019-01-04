/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import RegisterOperation from '../../program/operation_register';
import GLAttribute from '../../program/attribute';
import vertexKernel from './place_pixels.glsl';
import fillPixelsKernel from './fill.glsl';
import floatPolyfill from './float_polyfill.glsl';
import * as utils from '../../utils';
import ENV from '../../program/environment';

/**
 * @name Histogram
 * @description
 *  Extract histogram for a given image
 * @param {Tensor} tSrc - Input image
 * @param {number} [numOfChanels] - Number of channels to be calculated, min 1, max 4, default 3.
 */
export default (tSrc, numOfChanels = 3) => {
  utils.assert(
    numOfChanels > 0 && numOfChanels < 5 && numOfChanels % 1 === 0,
    'numOfChanels should be an integer in the range [1..4]',
  );

  let res = new RegisterOperation('ImageExtractHistogram')
    .Input('tSrc', tSrc.dtype)
    .Output('float32', true)
    .Uniform('u_colorMult', 'vec4', [0, 0, 0, 0])
    .Uniform('u_resolution', 'vec2', [tSrc.shape[1], tSrc.shape[0]])
    .CustomInit((op) => {
      const length = tSrc.shape[1] * tSrc.shape[0];
      const data = new Float32Array(length);

      op.attributes.pixelId = new GLAttribute(
        op.gl,
        op.program,
        'pixelId',
        'float',
      );

      for (let i = 0; i < length; i += 1) {
        data[i] = i;
      }

      op.attributes.pixelId.enable();
      op.attributes.pixelId.set(data);
    })
    .CustomRun((op, sess) => {
      const gl = op.gl;
      const outTexture = sess.texture[op.name];

      gl.useProgram(op.program);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.enable(gl.BLEND);

      op.bindInputs(sess);

      outTexture.bind(op.program, false, op.inputKeys.length);
      op.bindAttributes();
      op.bindBuffer();

      gl.viewport(0, 0, 256, 1);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      for (let channel = 0; channel < numOfChanels; channel += 1) {
        gl.colorMask(channel === 0, channel === 1, channel === 2, channel === 3);
        op.uniform.u_colorMult.set([
          channel === 0 ? 1 : 0,
          channel === 1 ? 1 : 0,
          channel === 2 ? 1 : 0,
          channel === 3 ? 1 : 0,
        ]);
        gl.drawArrays(gl.POINTS, 0, tSrc.shape[1] * tSrc.shape[0]);
      }
      gl.colorMask(true, true, true, true);
      gl.blendFunc(gl.ONE, gl.ZERO);
      gl.disable(gl.BLEND);
    })
    .SetShapeFn(() => [1, 256, 4])
    .CustomVertexShader(vertexKernel)
    .GLSLKernel(fillPixelsKernel)
    .Compile({ tSrc });

  if (!ENV.SUPPORTS_FLOAT_TEXTURES) {
    res = new RegisterOperation('Cast')
      .Input('tSrc', res.dtype)
      .Output('float32')
      .Constant('W', tSrc.shape[1])
      .Constant('H', tSrc.shape[0])
      .GLSLKernel(floatPolyfill)
      .Compile({ tSrc: res });
  }

  return res;
};
