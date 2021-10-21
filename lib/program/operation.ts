/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import GraphNode from './graph_node';
import GLUniform from './uniform';
import GLAttribute from './attribute';
import vertexShader from './glsl/pass_trought.glsl';
import glslError from './glsl_error';
import kernelConstructor from './kernel_constructor';
import ENV from './environment';
import * as utils from '../utils';

import type Session from './session';
import type Tensor from './tensor';
import type MediaInput from './media_input';

// TODO: hack
type TPropNames = 'input' | 'uniform' | 'constant' | 'attributes';

export default class Operation extends GraphNode {
  // TODO: need access modifier
  input: Record<string, Tensor | Operation | HTMLVideoElement | HTMLCanvasElement | MediaInput>;
  uniform: Record<string, any>;
  constant: Record<string, string | number | boolean>;
  chunks: any[];
  inputKeys: any[];
  isInitialized: boolean;
  lastCtx: number;
  cache: boolean;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  framebuffer: WebGLFramebuffer;
  shape: number[];
  dtype: DType;
  kernel: string;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  attributes: Record<string, GLAttribute>;
  centroids: Tensor;
  public sequence: string[];

  constructor(name: string) {
    utils.assert(
      typeof name !== 'undefined',
      'Operation: Operation should have a name',
    );
    super(name);
    this.dtype = null;
    this.input = {};
    this.uniform = {};
    this.constant = {};
    this.chunks = [];
    this.inputKeys = [];
    this.isInitialized = false;
    this.lastCtx = Math.random();
    this.cache = true;
  }

  run(sess: Session, ctx: number, isRecalculated?: boolean) {
    utils.assert(
      this.isInitialized,
      'Operation: Unable to run uninitialized operation.',
    );

    const gl = this.gl;
    const outTexture = sess.texture[this.name];

    if (
      ctx === this.lastCtx
      && this.cache
      && !isRecalculated
    ) {
      outTexture.bind(this.program, false, this.inputKeys.length);
      this.bindBuffer();

      return false;
    }

    this.lastCtx = ctx;

    gl.useProgram(this.program);

    for (let i = 0; i < this.inputKeys.length; i += 1) {
      const key = this.inputKeys[i];
      const input = this.input[key];
      // TODO: hack. Looks like opName can be `undefined`
      const opName = (input as Operation).name;
      const texture = sess.texture[opName];

      texture.bind(this.program, key, i);

      if (utils.isTensor(input)) {
        texture.set((input as Tensor));
      }

      if (utils.isMediaInput(input)) {
        texture.set((input as MediaInput).media as HTMLCanvasElement);
      }
    }

    outTexture.bind(this.program, false, this.inputKeys.length);
    this.bindBuffer();

    if (ENV.SUPPORTS_FLOAT_TEXTURES) {
      gl.viewport(0, 0, this.shape[1], this.shape[0]);
    } else {
      gl.viewport(0, 0, (this.dtype === 'float32' ? 4 : 1) * this.shape[1], this.shape[0]);
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    return true;
  }

  unbindBuffer() {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  bindBuffer() {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  init(gl: WebGLRenderingContext) {
    if (!this.isInitialized) {
      this.gl = gl;
      this.program = gl.createProgram();
      this.framebuffer = gl.createFramebuffer();

      if (this.isInitialized) {
        return false;
      }

      this.constant.OUT_VIEW = `vec2(${this.shape[1]}, ${this.shape[0]})`;
      this.kernel = kernelConstructor(this);
      // Initialization:
      // - Kernel compilation
      // - Uniforms initialization

      // Kernel compilation.
      try {
        this.vertexShader = this.getShader('vertex', vertexShader);
        gl.attachShader(this.program, this.vertexShader);
        this.fragmentShader = this.getShader('fragment', this.kernel);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
      } catch (err) {
        glslError(this.kernel, this.name, err);
        throw new Error(`Operation: Error during shader compilation.\n${err.message}`);
      }

      this.attributes = {
        aVertexPosition: new GLAttribute(
          this.gl,
          this.program,
          'aVertexPosition',
          'vec3',
        ),
        aTextureCoords: new GLAttribute(
          this.gl,
          this.program,
          'aTextureCoords',
          'vec2',
        ),
        aIndices: new GLAttribute(
          this.gl,
          this.program,
          'aIndices',
          'int',
        ),
      };

      // Set buffer values
      this.attributes.aVertexPosition.set([1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0]);
      this.attributes.aTextureCoords.set([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
      this.attributes.aIndices.set([0, 1, 2, 0, 2, 3]);

      // Init uniforms and set default values
      const uniformKeys = Object.keys(this.uniform);

      for (let j = 0; j < uniformKeys.length; j += 1) {
        const uniform = this.uniform[uniformKeys[j]];

        this.uniform[uniformKeys[j]] = new GLUniform(
          this.gl,
          this.program,
          uniform.name,
          uniform.dtype,
        );

        if (uniform.defaultValue) {
          this.uniform[uniformKeys[j]].set(uniform.defaultValue);
        }
      }

      this.isInitialized = true;
    }

    return true;
  }

  getShader(type: string, src: string) {
    const gl = this.gl;
    let shader = null;

    if (type === 'fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Operation: An error occurred compiling the shaders.\n${gl.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  traverse(handler: Function, context: any) {
    const inputNames = Object.keys(this.input);

    for (let i = 0; i < inputNames.length; i += 1) {
      const name = inputNames[i];

      if (utils.isOperation(this.input[name])) {
        (this.input[name] as Operation).traverse(handler, context);
      } else {
        handler(this.input[name], context);
      }
    }

    handler(this, context);
  }

  getDependencies() {
    const path: string[] = [];
    const inputNames = Object.keys(this.input);

    for (let i = 0; i < inputNames.length; i += 1) {
      const name = inputNames[i];

      if (utils.isOperation(this.input[name])) {
        const innerDeps = (this.input[name] as Operation).getDependencies();

        for (let j = 0; j < innerDeps.length; j += 1) {
          if (path.indexOf(innerDeps[j]) === -1) {
            path.push(innerDeps[j]);
          }
        }

        path.concat(innerDeps);
      }
    }

    path.push(this.name);

    return path;
  }

  assignInput(name: string, input: Tensor | Operation | MediaInput) {
    this.input[name] = input;

    if (this.inputKeys.indexOf(name) === -1) {
      this.inputKeys.push(name);
    }
  }

  cloneProp(name: TPropNames) {
    const names = Object.keys(this[name]);
    const prop: Record<string, any> = {};

    for (let i = 0; i < names.length; i += 1) {
      const cursor = names[i];

      prop[cursor] = this[name][cursor];
    }

    return prop;
  }

  destroy() {
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
    if (this.vertexShader) {
      this.gl.deleteShader(this.vertexShader);
    }
    if (this.fragmentShader) {
      this.gl.deleteShader(this.fragmentShader);
    }
    if (this.framebuffer) {
      this.gl.deleteFramebuffer(this.framebuffer);
    }
  }

  clone() {
    const op = new Operation(this.name.split(':')[0]);

    op.input = this.cloneProp('input');
    op.uniform = this.cloneProp('uniform');
    op.constant = this.cloneProp('constant');
    op.dtype = this.dtype;
    op.kernel = this.kernel;
    op.chunks = this.chunks;

    return op;
  }
}
