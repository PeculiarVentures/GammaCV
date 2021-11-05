/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

export default class GLUniform {
  private gl: WebGLRenderingContext;
  public name: string;
  public dtype: string;
  private location: WebGLUniformLocation;
  public defaultValue: string | number | number[];

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, name: string, dtype: string) {
    this.gl = gl;
    this.name = name;
    this.dtype = dtype;
    this.location = gl.getUniformLocation(program, this.name);
  }

  public set(value: string | number | number[]) {
    const gl = this.gl;

    if (Array.isArray(value)) {
      switch (this.dtype) {
        case 'vec2':
          gl.uniform2fv(this.location, value);
          break;
        case 'vec3':
          gl.uniform3fv(this.location, value);
          break;
        case 'vec4':
          gl.uniform4fv(this.location, value);
          break;
        case 'mat3':
          gl.uniformMatrix3fv(this.location, false, value);
          break;
        case 'mat4':
          gl.uniformMatrix4fv(this.location, false, value);
          break;
        default:
          return false;
      }
    } else if (typeof value === 'number') {
      switch (this.dtype) {
        case 'int':
          gl.uniform1i(this.location, value);
          break;
        case 'float':
          gl.uniform1f(this.location, value);
          break;
        default:
          return false;
      }
    }

    return true;
  }
}
