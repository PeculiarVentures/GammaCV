/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

export default class GLBuffer {
  private program: WebGLProgram;
  private gl: WebGLRenderingContext;
  private name: string;
  private dtype: string;
  private location: number;
  private ctx: WebGLBuffer;
  private size: number;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, name: string, dtype: string) {
    this.program = program;
    this.gl = gl;
    this.name = name;
    this.dtype = dtype;
    this.location = gl.getAttribLocation(this.program, this.name);
    this.ctx = gl.createBuffer();
    if (dtype === 'float' || dtype === 'int') {
      this.size = 1;
    } else {
      this.size = parseInt(/\d/g.exec(dtype)[0], 10);
      gl.enableVertexAttribArray(this.location);
    }
  }

  set(data: number[]) {
    const gl = this.gl;

    this.bind();
    if (this.dtype === 'int') {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
  }

  bind() {
    const gl = this.gl;

    if (this.dtype === 'int') {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ctx);
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.ctx);
      gl.vertexAttribPointer(this.location, this.size, gl.FLOAT, false, 0, 0);
    }
  }

  unbind() {
    const gl = this.gl;

    if (this.dtype === 'int') {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.vertexAttribPointer(this.location, this.size, gl.FLOAT, false, 0, 0);
    }
  }

  disable() {
    const gl = this.gl;
    gl.disableVertexAttribArray(this.location);
  }

  enable() {
    const gl = this.gl;
    gl.enableVertexAttribArray(this.location);
  }

  delete() {
    const gl = this.gl;

    gl.deleteBuffer(this.ctx);
    this.program = null;
    this.gl = null;
    this.ctx = null;
  }
}
