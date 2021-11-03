/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Operation from './operation';
import GLTexture from './texture';
import ENV from './environment';
import * as utils from '../utils';

import type Tensor from './tensor';

/**
 * This is a runtime which allows you to run computational graphs on different backends
 */
class Session {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private operation: Record<string, Operation>;
  private textureCount: number;
  private gl: WebGLRenderingContext;

  public texture: Record<string, GLTexture>;

  constructor() {
    this.canvas = utils.getCanvas();
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.initWebGL(this.canvas);

    this.operation = {};
    this.texture = {};
    this.textureCount = 0;
  }

  private initWebGL(canvas: HTMLCanvasElement | OffscreenCanvas, opts?: WebGLContextAttributes) {
    this.canvas = canvas;
    const gl = this.canvas.getContext('webgl', opts);

    utils.assert(
      !!gl,
      'Session: WebGL not supported.',
    );

    const float32Ext = gl.getExtension('OES_texture_float');

    utils.assert(
      !!float32Ext,
      'Session: Unable to find extension OES_texture_float',
    );

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.gl = gl;
  }

  /**
   * @description Intialize operations for session
   * @param {Operation} node - operation chain to be used in session
   */
  public init(node: Operation) {
    // Make sure we trying to initialize true Operation
    utils.assert(
      !!node,
      'Session: Unable to initialize undefined operation',
    );

    utils.assert(
      utils.isOperation(node) || utils.isTensor(node),
      'Session: Unable to initialize operation with invalid input type',
    );

    if (utils.isOperation(node)) {
      // Traversing of all the operations and flatten it to key-value storage
      node.traverse((input: Operation, sess: Session) => {
        sess.operation[input.name] = input;
      }, this);
    }

    if (utils.isTensor(node) || utils.isMediaInput(node)) {
      this.operation[node.name] = node;
    }

    this.update();
  }

  private update() {
    const gl = this.gl;
    const opKeys = Object.keys(this.operation);

    for (let i = 0; i < opKeys.length; i += 1) {
      const operation = this.operation[opKeys[i]];

      if (operation instanceof Operation) {
        operation.init(this.gl);
      }

      if (!this.texture[opKeys[i]]) {
        this.texture[opKeys[i]] = new GLTexture(
          operation.dtype,
          this.gl,
          this.textureCount,
          operation.shape,
        );

        if (operation instanceof Operation) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, operation.framebuffer);
          gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            this.texture[opKeys[i]].ctx,
            0,
          );
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        this.textureCount += 1;
      }
    }
  }

  /**
   * @description Run Operation
   * @param {Operation} op - operation to run
   * @param {*} ctx - context of a run, passing the same context twice in a raw
   *    will use cached result
   * @param {Tensor | HTMLCanvasElement} [output] - if passed, the output is put into it.
   */
  public runOp(op: Operation, ctx: number, output?: Tensor | HTMLCanvasElement) {
    const sequence = op.sequence;
    let isRecalculated = false;

    for (let i = 0; i < sequence.length; i += 1) {
      const key = sequence[i];
      const operation = this.operation[key];
      const isLastOp = i === (sequence.length - 1);

      utils.assert(
        !!operation,
        `Session: Unable to run uninitialized operation ${op.name}.`,
      );

      if (utils.isCanvasElement(output) && isLastOp) {
        if (
          this.canvas.width !== operation.shape[1]
          || this.canvas.height !== operation.shape[0]
        ) {
          this.canvas.width = operation.shape[1];
          this.canvas.height = operation.shape[0];
        }

        operation.framebuffer = null;
      }

      if (operation.run(this, ctx, isRecalculated)) {
        isRecalculated = true;
      } else {
        isRecalculated = false;
      }

      if (output && isLastOp && utils.isTensor(output)) {
        this.readToTensor(output as Tensor);
      }

      if (output && isLastOp && utils.isCanvasElement(output)) {
        this.readToCanvas(output as HTMLCanvasElement, operation.shape);
      }
    }
  }

  /**
   * @description Destroy all initialized operations,
   * textures and other data connected to this session.
   */
  public destroy() {
    const glLoseContext = this.gl.getExtension('WEBGL_lose_context');
    const textures = Object.keys(this.texture);
    const operations = Object.keys(this.operation);

    if (glLoseContext) {
      glLoseContext.loseContext();
    }

    for (let i = 0; i < textures.length; i += 1) {
      this.texture[textures[i]].delete();
    }

    for (let i = 0; i < operations.length; i += 1) {
      const op = this.operation[operations[i]];

      if (op instanceof Operation) {
        op.destroy();
      }
    }

    this.canvas = null;
    this.operation = {};
    this.texture = {};
    this.gl = null;
    this.textureCount = 0;
  }

  private readToTensor(tensor: Tensor) {
    const gl = this.gl;
    const height = tensor.shape[0];
    let width = tensor.shape[1];
    let type = gl.UNSIGNED_BYTE;
    let data = tensor.data;

    if (tensor.dtype === 'float32') {
      if (ENV.SUPPORTS_FLOAT_TEXTURES) {
        type = gl.FLOAT;
      } else {
        width *= 4;
        data = tensor.uint8View;
      }
    }

    gl.readPixels(
      0,
      0,
      width,
      height,
      gl.RGBA,
      type,
      data,
    );
  }

  private readToCanvas(canvas: HTMLCanvasElement, shape: number[]) {
    const ctx = canvas.getContext('2d');

    canvas.width = shape[1];
    canvas.height = shape[0];

    ctx.drawImage(
      this.canvas,
      0, 0, shape[1], shape[0],
      0, 0, shape[1], shape[0],
    );
  }
}

export default Session;
