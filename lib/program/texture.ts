/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import ENV from './environment';
import * as utils from '../utils';
import type Tensor from './tensor';

export default class GPUTexture {
  unit: number;
  dtype: DType;
  gl: WebGLRenderingContext;
  ctx: WebGLTexture;
  shape: number[];
  program: WebGLProgram;

  constructor(dtype: DType, gl: WebGLRenderingContext, unit: number, shape: number[]) {
    if (dtype === 'float32' || dtype === 'uint8') {
      this.unit = unit;
      this.dtype = dtype;
      this.gl = gl;
      this.ctx = gl.createTexture();
      this.shape = shape;

      gl.bindTexture(gl.TEXTURE_2D, this.ctx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.allocate();
    } else {
      throw new Error(`GPUTexture: Invalid texture type, currently supported is: float32, uint8, but got ${dtype} `);
    }
  }

  allocate() {
    const gl = this.gl;
    let width = this.shape[1];
    let type = gl.UNSIGNED_BYTE;

    if (this.dtype === 'float32') {
      if (ENV.SUPPORTS_FLOAT_TEXTURES) {
        type = gl.FLOAT;
      } else {
        width *= 4;
      }
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      this.shape[0],
      0,
      gl.RGBA,
      type,
      null,
    );
  }

  set(src: Tensor | HTMLCanvasElement | HTMLVideoElement = null) {
    const gl = this.gl;

    if (
      utils.isVideoElement(src) || utils.isCanvasElement(src)
    ) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    } else {
      let width = src.shape[1];
      let type = gl.UNSIGNED_BYTE;
      let data = src.data;

      if (src.dtype === 'float32') {
        if (ENV.SUPPORTS_FLOAT_TEXTURES) {
          type = gl.FLOAT;
        } else {
          width *= 4;
          data = src.uint8View;
        }
      }

      // TODO: texImage2D doesn't work with type `number[]`
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        this.shape[0],
        0,
        gl.RGBA,
        type,
        data,
      );
    }
  }

  bind(program: WebGLProgram, name: string | false, unit: number) {
    const gl = this.gl;

    if (name) {
      const location = gl.getUniformLocation(program, name);

      gl.uniform1i(location, unit);
    }

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this.ctx);

    this.unit = unit;
  }

  unbind() {
    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + this.unit);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  delete() {
    const gl = this.gl;

    gl.deleteTexture(this.ctx);
    this.gl = null;
    this.program = null;
    this.ctx = null;
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}
