/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018-2021 Peculiar Ventures.
 * All rights reserved.
 */

/* io */

export function initDrawable(canvas: HTMLCanvasElement, output: Tensor, updater?: () => void): void
export function initMouseTracking(canvas: HTMLCanvasElement, handler: (a: number, b: number) => void): Function
export function toImageData(img: Tensor, rgba?: boolean, transposed?: boolean): ImageData
export function getImageData(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number): ImageData
export function putImageData(canvas: HTMLCanvasElement, imageData: ImageData, x?: number, y?: number, dx?: number, dy?: number, dw?: number, dh?: number, clear?: boolean): void

export class CaptureVideo {
  constructor(width: number, height: number);
  start(deviceID?: string, exactFacingMode?: string): Promise<void>;
  stop(): void;
  getImageBuffer(type: 'uint8' | 'float32' | Tensor): Float32Array | Uint8Array | Tensor | ImageData
  getImageBufferTo(dtype: 'uint8' | 'float32' | Tensor, ctx?: CanvasRenderingContext2D, width?: number, height?: number, x?: number, y?: number, w?: number, h?: number, to?: Tensor): void
  getSourceImageBuffer(dtype: 'uint8' | 'float32' | Tensor, x?: number, y?: number, w?: number, h?: number): Float32Array | Uint8Array | Tensor | ImageData
}

export function canvasFromTensor(canvas: HTMLCanvasElement, target: Tensor, rgba?: boolean, transposed?: boolean): void
export function canvasToTensor(canvas: HTMLCanvasElement, target: Tensor): void
export function canvasFill(canvas: HTMLCanvasElement, color?: string): void
export function canvasClear(canvas: HTMLCanvasElement): void
export function canvasInit(canvasId: string, width: number, height: number): void
export function canvasCreate(width: number, height: number): HTMLCanvasElement
export function canvasDrawRect(canvas: HTMLCanvasElement, rect: Rect, color?: string, lineWeight?: number, cross?: boolean, fill?: boolean): void
export function canvasDrawLine(canvas: HTMLCanvasElement, line: Line | number[], color?: string, lineWeight?: number): void
export function canvasDrawCircle(canvas: HTMLCanvasElement, center: number[], radius?: number, color?: string): void
export function canvasFillCircle(canvas: HTMLCanvasElement, center: number[], radius?: number, color?: string): void
export function canvasCreate(width: number, height: number): HTMLCanvasElement

export function imageTensorFromURL<T extends 'uint8' | 'float32' = 'uint8'>(url: string, dtype?: T, shape?: Shape, cors?: boolean): Promise<Tensor<MapDTypeToDataView[T]>>

/* math */

export class Line {
  constructor(input: number[])
  constructor(...args: number[])
  public angle: number
  public x1: number
  public y1: number
  public x2: number
  public y2: number
  public px: number
  public py: number
  public length: number
  public data: number[]
  static Intersection(a: Line, b: Line): number[]
  public clone(): Line
  public fromParallelCoords(a: number, b: number, c: number, d: number, e: number, f: number): void;
  public scale(w: number, h: number): Line
  public set(a: number, b: number, c: number, d: number, x: number, y: number): Line
  public fromArray(array: number[]): Rect
  public toArray(): number[]
}

export class Rect {
  constructor(input: number[])
  constructor(...args: number[])
  public data: Float32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray
  public distA: number
  public distB: number
  public distC: number
  public distD: number
  public distE: number
  public distF: number
  public angleA: number
  public angleB: number
  public angleC: number
  public angleD: number
  public ax: number
  public ay: number
  public bx: number
  public by: number
  public cx: number
  public cy: number
  public dx: number
  public dy: number
  public area: number
  public P: number
  static TriangleS(...args: number[]): number
  static Distance(a: Rect, b: Rect): number
  public scale(w: number, h: number): Rect
  public clone(): Rect
  public clear(): Rect
  public fromDeep(array: number[][]): Rect
  public fromArray(array: number[]): Rect
  public toArray(): number[]
  public toJSON(): number[]
  public fromLines(a: Line, b: Line, c: Line, d: Line): Rect
  public isInRect(x: number, y: number): boolean
  public isNotEmpty(): boolean
  public set(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): Rect
  public assign(rect: Rect): Rect
  public scale(xCoef: number, yCoef: number): Rect
  public mul(coef: number): Rect
  public scaleAt(coef: number): Rect
  public perspective(matrix: Tensor): Rect
}

export class TypedPool<T> {
  constructor(instance: new () => T, count: number)
  public length: number
  at(index: number): T
  push(item: T): void
  release(): void
}

export function generateTransformMatrix(rect: Rect, outScale: number[], tMatrix: Tensor): Operation
export function calcIntegralSum(input: Tensor, x: number, y: number, w: number, h: number): Operation
export function calcHAARFeature(input: Tensor, feature: number[], size: number, x: number, y: number, coef: number): Operation

/* ops */

export function histogramEqualization(input: InputType, layers?: number): Operation
export function grayscale(input: InputType): Operation

/** @deprecated */
export function downsample(input: InputType, coef?: number, type: 'max' | 'mean'): Operation
export function downsample(input: InputType, coef?: number, type?: 'nearest' | 'bicubic'): Operation
export function resize(input: InputType, w: number, h: number, type?: 'nearest' | 'bicubic'): Operation
export function gaussianBlur(input: InputType, sigma?: number, ksize?: number): Operation
export function sobelOperator(input: InputType): Operation
export function cannyEdges(input: InputType, lowThreshold?: number, highThreshold?: number): Operation
export function pcLinesTransform(input: InputType, reduction: number): Operation
export function pcLinesEnhance(input: InputType): Operation
export function pcLinesReduceMax(input: InputType, reduction: number, coef: number): Operation
export function conv2d(input: InputType, kernel: InputType, factor?: number, bias?: number): Operation
export function sub(A: InputType, B: InputType): Operation
export function div(A: InputType, B: InputType): Operation
export function add(A: InputType, B: InputType): Operation
export function mult(A: InputType, B: InputType): Operation
export function subScalar(A: InputType, scalar: number): Operation
export function divScalar(A: InputType, scalar: number): Operation
export function addScalar(A: InputType, scalar: number): Operation
export function multScalar(A: InputType, scalar: number): Operation
export function perspectiveProjection(input: InputType, tMatrix: InputType, outScale: number[], dtype?: DType): Operation
export function cast(input: InputType, dtype?: DType): Operation
export function colorSegmentation(input: InputType, numClusters?: number): Operation
export function adaptiveThreshold(input: InputType, boxSize?: number, threshold?: number, pichChanel?: number, integralImage?: InputType): Operation
export function concat(A: InputType, B: InputType, mask?: string[]): Operation
export function dilate(input: InputType, size: number[], kernel?: Tensor): Operation
export function erode(input: InputType, size: number[], kernel?: Tensor): Operation
export function histogram(input: InputType, layers?: number, min?: number, max?: number, step?: number): Operation
export function hog(input: InputType, coef?: number, type?: 'max' | 'visualize'): Operation
export function HSVColor(input: InputType, type?: 'rgb_to_hsv' | 'hsv_to_rgb'): Operation
export function meanStd(input: InputType, layers?: number, ignoreStd?: boolean): Operation
export function minMax(input: InputType, layers?: number): Operation
export function morphologyEx(input: InputType, type: 'open' | 'close' | 'gradient' | 'tophat' | 'blackhat', size?: number[], kernel?: Tensor): Operation
export function motionDetect(A: InputType, B: InputType): Operation
export function norm(input: InputType, type?: 'minmax' | 'l2', layers?: number): Operation
export function pcLines(input: InputType, layers?: number, dStep?: number, rCoef?: number): Operation
export function sat(input: InputType, passes?: number): Operation
export function sqsat(input: InputType, passes?: number): Operation
export function skinTest(input: InputType): Operation
export function slidingWindow(input: InputType, windowSize: number[], stride?: number, strategy?: number): Operation
export function swt(sobel: InputType, canny: InputType, min?: number, max?: number, steps?: number, returnCoords?: boolean, invert?: boolean): Operation
export function threshold(input: InputType, value?: number, axis?: number): Operation
export function transformationMatrix(input: InputType, output: InputType): Operation

/** @deprecated */
export function upsample(input: InputType, coef: number, type: 'max' | 'mean'): Operation
export function upsample(input: InputType, coef: number, type?: 'nearest' | 'bicubic'): Operation

/* program */

type TensorDataView = Float32Array | Float64Array | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Uint8ClampedArray | number[];
type DType =
  'uint8' |
  'uint16' |
  'uint32' |
  'int8' |
  'int16' |
  'int32' |
  'float32' |
  'float64' |
  'uint8c' |
  'array';

type MapDTypeToDataView = {
  'uint8': Uint8Array;
  'uint16': Uint16Array;
  'uint32': Uint32Array;
  'int8': Int8Array;
  'int16': Int16Array;
  'int32': Int32Array;
  'float32': Float32Array;
  'float64': Float64Array;
  'uint8c': Uint8ClampedArray;
  'array': number[];
}

export class Tensor<T = TensorDataView> {
  shape: Shape;
  size: number;
  stride: number[];
  offset: number;
  constructor(
    type: DType,
    shape: Shape,
    data?: T,
    stride?: Shape,
    offset?: number,
  )
  public data: T
  public get(...args: number[]): number
  public set(...args: number[]): void
  public index(...args: number[]): number
  public assign(input: T): void
  /** @deprecated */
  public relese(): this
  public release(): this
  public clone(): Tensor

  static IndexToCoord(shape: Shape, index: number): number[]
  static CoordToIndex(shape: Shape, coords: number[]): number
  static Malloc(dtype: DType, size: number): TensorDataView
  static DefineType(data: TensorDataView): DType
  static GetTypedArray(dtype: DType, data: TensorDataView): TensorDataView
  static GetSize(shape: Shape): number
}

type Chunk = 'pickCurrentValue' | 'pickValue' | 'float' | string;

export class RegisterOperation {
  constructor(name: string)
  GLSLKernel(kernel: string): this
  LoadChunk(...chunks: Chunk[]): this
  Input(name: string, dtype: DType): this
  Output(dtype: DType): this
  Uniform(name: string, dtype: string, defaultValue: number | number[]): this // ?
  Constant(name: string, value: number | string): this
  SetShapeFn(fn: () => Shape): this
  PreCompile(fn: Function): this
  PostCompile(fn: Function): this
  Compile(input: { [key: string]: InputType }): Operation
}

export class Session {
  init(op: Operation): void
  runOp(op: Operation, frame: number, out?: Tensor | HTMLCanvasElement): boolean
  destroy(): void
  readToTensor(tensor: Tensor<Uint8Array | Float32Array>)
}

export class Operation {
  constructor(name: string)
  public shape: Shape
  run(sess: Session, ctx?: number, isRecalculated?: boolean): void
  init(gl: WebGLObject): void
  assignInput(name: string, input: InputType): void
  destroy(): void
  clone(): Operation
}

export class MediaInput {
  constructor(media?: MediaInputType, shape?: Shape)
  assignMedia(media?: MediaInputType, shape?: Shape): void
  public shape: Shape
}

/* tensor utils */

export function range(n: number): number[]
export function tensorFrom(input: InputType, dtype?: DType): Tensor | null
export function tensorClone(from: Tensor, to: Tensor): void
export function tensorInvert(input: Tensor, output?: Tensor, invertShape?: Shape): Tensor
export function tensorAssertEqual(actual: Tensor, expected: Tensor): boolean
export function tensorAssertCloseEqual(actual: Tensor, expected: Tensor, delta: number): boolean
export function tensorAssertMSEEqual(actual: Tensor, expected: Tensor, delta: number): boolean
export function flipTensor(input: Tensor, output?: Tensor, invertShape?: Shape): Tensor
export function tensorMap(input: Tensor, cb: (a: number, i: number) => void, output?: Tensor)
export function tensorOnes(dtype: DType, shape: number[]): Tensor
export function tensorFromFlat(arr: TensorDataView, shape?: Shape, dtype?: DType, alpha?: number): Tensor

/* utils */

export function assert(expression: boolean, msg: string): void
export function assertShapesAreEqual(a: Shape, b: Shape): boolean
export function isVideoElement(element: any): boolean
export function isValidShape(shape: Shape): boolean
export function isOperation(op: any): boolean
export function isTensor(tensor: any): boolean
export function isValidGLSLChunk(name: string): boolean
export function isValidGLSLVariableName(name: string): boolean
export function isValidOperationShape(shape: Shape): boolean
export function deprecationWarning(name: string, msg: string): void
export function deprecationError(name: string, msg: string): void
export class DeprecationError extends Error {}

/* math utils */

export function sortPoints(points: number[], canvas?: HTMLCanvasElement): number[]
export function angleBetweenLines(A: Line, B: Line): number
export function transformPoint(px: number, py: number, transformation: Tensor): [number, number]
export function generateTransformMatrix(rect: Rect, dstBounds: [number, number], transformMatrix: Tensor, pad?: number): Tensor
export function calcIntegralSum(img: Tensor, x: number, y: number, w: number, h: number): number
export function calcHAARFeature(img: Tensor, feature: number[][], size: number, dx: number, dy: number, dStep: number): number

/* common */

type InputType = Tensor | Operation | MediaInput;
type MediaInputType = HTMLVideoElement | HTMLCanvasElement;

/**
 * Array of positive integers, that describe n-dimensional shape, should contain n elements
 */
type Shape = number[];
