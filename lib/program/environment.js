/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import { getCanvas } from '../utils';

const parameters = {};

function testFloatTextures() {
  const canvas = getCanvas();
  const gl = canvas.getContext('webgl');

  if (!gl) {
    return false;
  }

  if (!gl.getExtension('OES_texture_float')) {
    return false;
  }

  const frameBuffer = gl.createFramebuffer();
  const texture = gl.createTexture();

  parameters.MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  const frameBufferComplete =
    gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

  let noError;

  try {
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));
    noError = gl.getError() === gl.NO_ERROR;
  } catch (err) {
    noError = false;
  }

  return frameBufferComplete && noError;
}

const SOURCE_ENV = {
  SUPPORTS_FLOAT_TEXTURES: testFloatTextures(),
  DEBUG: false,
  MAX_TEXTURE_SIZE: parameters.MAX_TEXTURE_SIZE,
};


const ENV = Object.assign({}, SOURCE_ENV);

export default ENV;

export const setEnv = (key, value) => { ENV[key] = value; };
export const setSourceEnv = (key) => { ENV[key] = SOURCE_ENV[key]; };
