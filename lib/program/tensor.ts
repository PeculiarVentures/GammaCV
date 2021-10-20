/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import { range, tensorClone } from './tensor_utils';
import GraphNode from './graph_node';
import * as utils from '../utils';
import ENV from './environment';

/**
 * N Dimensional data view, that helps create, store, manipulate data.
 */
class Tensor<T extends TensorDataView = TensorDataView> extends GraphNode {
  dtype: DType;
  shape: number[];
  size: number;
  stride: number[];
  offset: number;
  data: TensorDataView;
  empty: TensorDataView;
  uint8View: Uint8Array;

  // methods defined in other methods
  // TODO: HACK looks like need to move description here
  get(..._args: number[]): number {
    return 0;
  }
  set(..._args: number[]) {}
  index(..._args: number[]): number {
    return 0;
  }

  /**
   * @param {string} dtype - the data type for tensor instance
   * @param {Array.<number>} shape - the list of integers,
   * @param {TypedArray|Array} [data] - initial data to store
   * @param {Array.<number>} [stride] - custom mapping from plain to NDArray
   * @param {number} [offset] - number of data elements to skip
   */
  constructor(dtype: DType, shape: number[], data?: T, stride?: number[], offset = 0) {
    super('Tensor');
    this.dtype = dtype;
    this.shape = shape || [data.length];

    utils.assert(utils.isValidShape(this.shape), 'Tensor: Shape is not valid');
    if (stride) {
      utils.assert(utils.isValidShape(stride), 'Tensor: Stride is not valid');
      utils.assert(this.shape.length === stride.length, 'Tensor: Stride length should be equal to shape length');
    }
    utils.assert(typeof offset === 'number' && offset % 1 === 0, `Tensor: Offset should be integer, but got ${offset}`);

    this.size = Tensor.GetSize(this.shape);
    this.stride = stride || this._defineStride(this.shape);
    this.offset = offset;


    this._compileJITMethods();

    if (typeof data === 'undefined') {
      this.data = Tensor.Malloc(dtype, this.size);
      this.empty = Tensor.Malloc(dtype, this.size);
    } else {
      this.assign(data);
    }

    if (!ENV.SUPPORTS_FLOAT_TEXTURES && dtype === 'float32') {
      this.uint8View = new Uint8Array((this.data as Float32Array).buffer);
    }
  }

  _compileJITMethods() {
    const indices = range(this.shape.length);
    const argsStr = indices.map(i => `i${i}`).join(',');
    const indexStr = `${this.offset}+${indices.map(i => `${this.stride[i]}*i${i}`).join('+')}`;

    /**
     * @name get
     * @method
     * @description Get data element by coordinates
     * @param {...number} x - coordinates
     *
     * Require N number arguments, where n - dimention of a tensor.
     * @return {number}
     * @example
     * const t = new gm.Tensor('uint8', [2, 3], new Uint8Array([1, 2, 3, 4, 5, 6]));
     * t.get(0, 0); // 1
     * t.get(0, 1); // 2
     * t.get(1, 2); // 6
     */
    this.get = new Function(`return function get(${argsStr}) { return this.data[${indexStr}]; }`)(); // eslint-disable-line
    
    /**
     * @name set
     * @method
     * @description Put value to tensor by coordinates
     * @param {...number} x - coordinates
     * @param {number} v - value
     *
     * @example
     * const t = new gm.Tensor('uint8', [2, 3], new Uint8Array([1, 2, 3, 4, 5, 6]));
     * t.set(0, 0, 10); // 1
     * t.set(0, 1, 15); // 2
     * t.set(1, 2, 20); // 6
     *
     * console.log(t.data); // <Uint8Array[10, 15, 3, 4, 5, 20]>
     */
    this.set = new Function(`return function get(${argsStr}, v) { this.data[${indexStr}] = v; }`)(); // eslint-disable-line

    /**
     * @name index
     * @method
     * @description Get's index in plain data view of data element specified by coordinates
     * @param {...number} x - coordinates
     *
     * Require N number arguments, where n - dimention of a tensor.
     * @return {number}
     * @example
     * const t = new gm.Tensor('uint8', [2, 3], new Uint8Array([1, 2, 3, 4, 5, 6]));
     * t.index(0, 0); // 0
     * t.index(0, 1); // 1
     * t.index(1, 2); // 5
     */
    this.index = new Function(`return function get(${argsStr}, v) { return ${indexStr}; }`)(); // eslint-disable-line
  }

  _defineStride(shape: number[]) {
    const d = shape.length;
    const stride = new Array(d);

    for (let i = d - 1, sz = 1; i >= 0; i -= 1) {
      stride[i] = sz;
      sz *= this.shape[i];
    }

    return stride;
  }

  /**
   * @name Tensor.assign
   * @param {TypedArray|Array} data
   * @returns {Tensor} self
   */
  assign(data: TensorDataView) {
    const nextDtype = Tensor.DefineType(data);
    const nextLength = data.length;

    utils.assert(nextDtype === this.dtype, `Tensor: Different dtypes assigned: \n   expected - ${this.dtype} \n   actual - ${nextDtype}`);
    utils.assert(nextLength === this.size + this.offset, `Tensor: Different sizes assigned: \n   expected - ${this.size + this.offset} \n   actual - ${nextLength}`);

    this.data = data;

    return this;
  }

  /**
   * @description Write zeros into tensor's data
   * @return {Tensor} self
   */
  release() {
    if (this.empty) {
      // TODO: hack
      (this.data as Uint8Array).set(this.empty);
    } else {
      this.data = Tensor.Malloc(this.dtype, this.size);
    }

    return this;
  }

  relese() {
    utils.deprecationWarning('Tensor: relese');
    this.release();

    return this;
  }

  /**
   * @return {Tensor} a shallow copy, new instance
   */
  clone() {
    const result = new Tensor(this.dtype, this.shape, undefined, this.stride, this.offset);

    tensorClone(this, result);

    return result;
  }

  /**
   * @param {Array.<number>} shape
   * @param {number} index
   * @return {Array.<number>} coordinets that maps to the entered index
   */
  static IndexToCoord(shape: number[], index: number) {
    const res = new Array<number>(shape.length);
    let _index = index;
    let shapeSum = shape.reduce((s, b) => s * b);

    for (let i = 0; i <= shape.length - 2; i += 1) {
      shapeSum /= shape[i];
      const r = ~~(_index / shapeSum);

      _index %= shapeSum;
      res[i] = r;
    }
    res[res.length - 1] = _index % shape[shape.length - 1];

    return res;
  }

  /**
   * @static
   * @param {Array.<number>} shape
   * @param {Array.<number>} coords
   * @return {number} index that mapped from entered coords
   */
  static CoordToIndex(shape: number[], coords: number[]) {
    let shapeSum = 1;
    let sum = 0;

    for (let i = shape.length - 1; i >= 0; i -= 1) {
      sum += shapeSum * coords[i];
      shapeSum *= shape[i];
    }

    return sum;
  }

  /**
   * @static
   * @param {string} dtype
   * @param {number} size
   * @return {Tensor}
   */
  static Malloc(dtype: DType, size: number) {
    switch (dtype) {
      case 'uint8':
        return new Uint8Array(size);
      case 'uint16':
        return new Uint16Array(size);
      case 'uint32':
        return new Uint32Array(size);
      case 'int8':
        return new Int8Array(size);
      case 'int16':
        return new Int16Array(size);
      case 'int32':
        return new Int32Array(size);
      case 'float32':
        return new Float32Array(size);
      case 'float64':
        return new Float64Array(size);
      case 'uint8c':
        return new Uint8ClampedArray(size);
      case 'array':
        return new Array(size);
      default:
        throw new Error(`Tensor: Unexpected type: ${dtype}.`);
    }
  }

  /**
   * @static
   * @description Define data type of an argument
   * @param {TypedArray|Array} data
   * @return {string}
   * @example
   * gm.Tensor.DefineType(new Float32Array()); // float32
   */
  static DefineType(buffer: TensorDataView) {
    const str = Object.prototype.toString.call(buffer);

    switch (str) {
      case '[object Uint8Array]':
        return 'uint8';
      case '[object Uint16Array]':
        return 'uint16';
      case '[object Uint32Array]':
        return 'uint32';
      case '[object Int8Array]':
        return 'int8';
      case '[object Int16Array]':
        return 'int16';
      case '[object Int32Array]':
        return 'int32';
      case '[object Float32Array]':
        return 'float32';
      case '[object Float64Array]':
        return 'float64';
      case '[object Uint8ClampedArray]':
        return 'uint8c';
      case '[object Array]':
        return 'array';
      default:
        throw new Error(`Tensor: Unknown dtype: ${str}.`);
    }
  }

  /**
   * @static
   * @description Generate TypedArray
   * @param {string} dtype - data type of view
   * @param {TypedArray|Array} data - initial data
   * @return {TypedArray|Array}
   */
  static GetTypedArray(dtype: DType, data: TensorDataView): TensorDataView {
    if (dtype === Tensor.DefineType(data)) {
      return data;
    }

    switch (dtype) {
      case 'uint8':
        return new Uint8Array(data);
      case 'uint16':
        return new Uint16Array(data);
      case 'uint32':
        return new Uint32Array(data);
      case 'int8':
        return new Int8Array(data);
      case 'int16':
        return new Int16Array(data);
      case 'int32':
        return new Int32Array(data);
      case 'float32':
        return new Float32Array(data);
      case 'float64':
        return new Float64Array(data);
      case 'uint8c':
        return new Uint8ClampedArray(data);
      case 'array':
        // TODO: ALERT! HACK! new Array(data) return [data] instead of [...data]! Is it correct?
        return new Array(data) as any;
      default:
        throw new Error(`Unknown type: ${dtype}.`);
    }
  }

  /**
   * @static
   * @param {Array.<number>} shape
   * @return {number} Number of elements that described by shape
   */
  static GetSize(shape: number[]) {
    return shape.reduce((a, b) => a * b, 1);
  }
}

export default Tensor;
