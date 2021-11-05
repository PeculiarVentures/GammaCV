/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Operation from './operation';
import Tensor from './tensor'
import * as utils from '../utils';


/**
 * @name RegisterOperation
 */
export default class RegisterOperation {
  private op: Operation;
  private preCompile: Function;
  private postCompile: Function;
  public name: string;

  private checkShape: (a: Record<string, number[]>) => number[];

  constructor(name: string) {
    this.op = new Operation(name);
    this.name = name;

    this.checkShape = (a) => {
      const keys = Object.keys(a);

      return a[keys[0]];
    };
    this.preCompile = () => {};
    this.postCompile = () => {};

  }

  public GLSLKernel(kernel: string) {
    utils.assert(
      typeof kernel === 'string',
      'RegisterOperation: The kernel should be a string but it is not.',
    );
    this.op.kernel = kernel;

    return this;
  }

  public LoadChunk(...chunks: AvailableGLSLChunks[]) {
    for (const chunk of chunks) {
      utils.assert(
        utils.isValidGLSLChunk(chunk),
        `RegisterOperation: There is no available GLSL chunk supported: ${chunk}`,
      );
    }

    this.op.chunks = this.op.chunks.concat(chunks);

    return this;
  }

  public Input(name: string, dtype: DType) {
    utils.assert(utils.isValidGLSLVariableName(name), 'RegisterOperation: Input name can contain only letters');
    // TODO: remove soft hack by reorganizing op register, so Op itself has stale signature
    const op = new Tensor(dtype, [0]);

    op.name = name;
    this.op.input[name] = op;

    return this;
  }

  public Output(dtype: DType) {
    utils.assert(
      this.op.dtype === null,
      'RegisterOperation: The operation allows a single output.',
    );

    this.op.dtype = dtype;

    return this;
  }

  public Constant(name: string, value: number | string | boolean) {
    utils.assert(utils.isValidGLSLVariableName(name), 'RegisterOperation: Constant name can contain only letters');
    this.op.constant[name] = value;

    return this;
  }

  public SetShapeFn(fn: (a: Record<string, number[]>) => number[]) {
    utils.assert(
      typeof fn === 'function',
      'RegisterOperation: SetShapeFn should receive function in first argument',
    );
    this.checkShape = fn;

    return this;
  }

  public PreCompile(fn: Function) {
    utils.assert(
      typeof fn === 'function',
      'RegisterOperation: PreCompile should receive function in first argument',
    );
    this.preCompile = fn;

    return this;
  }

  public PostCompile(fn: Function) {
    utils.assert(
      typeof fn === 'function',
      'RegisterOperation: PostCompile should receive function in first argument',
    );
    this.postCompile = fn;

    return this;
  }

  Uniform(name: string, dtype: string, defaultValue: string | number | number[]) {
    utils.assert(utils.isValidGLSLVariableName(name), 'RegisterOperation: Uniform name can contain only letters');
    // TODO: ts-migration uniform has 2 states - before compile and after
    this.op.uniform[name] = ({ name, dtype, defaultValue } as any);

    return this;
  }

  Compile(input: { [key: string]: InputType }) {
    const op = this.op.clone();
    const inputShapes: Record<string, number[]> = {};
    const keys = Object.keys(input);

    this.preCompile(op);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const inputNode = input[key];

      utils.assert(
        !!inputNode,
        `RegisterOperation:${op.name}.${key}:
         Can't compile operation with undefined input.`,
      );

      utils.assert(
        utils.isTensor(inputNode)
        || utils.isMediaInput(inputNode)
        || utils.isOperation(inputNode),
        `RegisterOperation:${op.name}.${key}:
         Can't compile operation with invalid input type.
         You can only use Tensor or another Operation to be an input`,
      );

      inputShapes[key] = input[key].shape;

      op.assignInput(key, input[key]);
    }

    op.shape = this.checkShape(inputShapes);
    op.sequence = op.getDependencies();

    this.postCompile(op);

    return op;
  }
}
