/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

export default class GLUniform {
  gl: WebGLRenderingContext
  name: string;
  dtype: string;
  location: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, name: string, dtype: string) {
    this.gl = gl;
    this.name = name;
    this.dtype = dtype;
    this.location = gl.getUniformLocation(program, this.name);
  }

  // TODO: HACK!!! Need to update function! value must be `number | number[]`
  set(value: number) {
    const gl = this.gl;

    switch (this.dtype) {
      case 'int':
        gl.uniform1i(this.location, value);
        break;
      case 'float':
        gl.uniform1f(this.location, value);
        break;
      case 'vec2':
        gl.uniform2fv(this.location, (value as any));
        break;
      case 'vec3':
        gl.uniform3fv(this.location, (value as any));
        break;
      case 'vec4':
        gl.uniform4fv(this.location, (value as any));
        break;
      case 'mat3':
        gl.uniformMatrix3fv(this.location, false, (value as any));
        break;
      case 'mat4':
        gl.uniformMatrix4fv(this.location, false, (value as any));
        break;
      default:
        return false;
    }

    return true;
  }
}
