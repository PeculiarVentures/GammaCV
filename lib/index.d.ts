

/* io */

export class CaptureVideo {
  constructor(width: number, height: number);
  getImageBuffer(type: 'uint8' | 'float32'): Float32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray
  start(): void;
  stop(): void;
}

export function canvasFromTensor(canvas: HTMLCanvasElement, target: Tensor): void
export function canvasDrawRect(canvas: HTMLCanvasElement, rect: Rect, color?: string, lineWeight?: number): void
export function canvasDrawLine(canvas: HTMLCanvasElement, line: Line, color?: string, lineWeight?: number): void
export function canvasDrawCircle(canvas: HTMLCanvasElement, center: number[], radius?: number, color?: string): void
export function canvasCreate(width: number, height: number): HTMLCanvasElement
export function imageTensorFromURL(url: string, dtype: 'uint8' | 'float32', size?: number[]): void

/* math */

export class Line {
  constructor(input: number[])
  constructor(...args: number[])
  static Intersection(a: Line, b: Line): number[]
  public angle: number
  public x1: number
  public y1: number
  public x2: number
  public y2: number
  public data: number[]
  public clone(): Line
  fromParallelCoords(a, b, c, d, e, f): void;
  public scale(w: number, h: number): Line
}

export class Point {
  public clone(): Point
  public scale(w: number, h: number): Point
}

export class Rect {
  public data: Float32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray
  static TriangleS(...args: number[])
  constructor(data?: number[])
  static Distance(a: Rect, b: Rect): number
  public scale(w: number, h: number): Rect
  public clone(): Rect
  public fromLines(a: Line, b: Line, c: Line, d: Line): Rect
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
  isInRect(rect: Rect)
}

export class TypedPool<T = any> {
  constructor(instance: T, count: number)
  public length: number
  at(index: number): T
  push(item: T): void
  release(): void
}

export function generateTransformMatrix(rect: Rect, outScale: number[], tMatrix: InputType): Operation
export function calcIntegralSum(input: Tensor, x: number, y: number, w: number, h: number): Operation
export function calcHAARFeature(input: Tensor, feature: number[], size: number, x: number, y: number, coef: number): Operation

/* ops */

export function histogramEqualization(input: InputType, layers?: number): Operation
export function grayscale(input: InputType): Operation
export function downsample(input: InputType, coef?: number, type?: 'mean' | 'max'): Operation
export function gaussianBlur(input: InputType, sigma?: number, ksize?: number): Operation
export function sobelOperator(input: InputType): Operation
export function cannyEdges(input: InputType, lowThreshold?: number, highThreshold?: number): Operation
export function pcLinesTransform(input: InputType, reduction: number): Operation
export function pcLinesEnhance(input: InputType): Operation
export function pcLinesReduceMax(input: InputType, reduction: number): Operation
export function pcLinesReduceMax(input: InputType, reduction: number, coef: number): Operation
export function conv2d(inout: Tensor, kernel: Tensor, factor?: number, bias?: number): Operation
export function sat(input: InputType): Operation
export function sqsat(input: InputType): Operation
export function tensorFrom(target: InputType | Operation): Tensor
export function sub(A: InputType, B: InputType): Operation
export function div(A: InputType, B: InputType): Operation
export function add(A: InputType, B: InputType): Operation
export function mult(A: InputType, B: InputType): Operation
export function subScalar(A: InputType, scalar: number): Operation
export function divScalar(A: InputType, scalar: number): Operation
export function addScalar(A: InputType, scalar: number): Operation
export function multScalar(A: InputType, scalar: number): Operation
export function perspectiveProjection(input: InputType, tMatrix: InputType, outScale: number[]): Operation
export function swt(sobel: InputType, canny: InputType): Operation

export function cast(input: Tensor, dtype?: DType): Operation
export function colorSegmentation(input: Tensor, numClusters?: number): Operation
export function adaptiveThreshold(input: Tensor, boxSize?: number, threshold?: number, pichChanel?: number, integralImage?: Tensor): Operation
export function concat(A: Tensor, B: Tensor, mask?: string[]): Operation
export function dilate(input: Tensor, size: number[], kernel?: boolean): Operation
export function erode(input: Tensor, size: number[], kernel?: boolean): Operation
export function histogram(input: Tensor, layers?: number, min?: number, max?: number, step?: number): Operation
export function hog(input: Tensor, max: number, type: 'max' | 'visualize'): Operation

/* program */

type TensorDataView = Float32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | number[];
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
  'array'

export class Tensor<T extends TensorDataView = Uint8Array> {
  shape: number[];
  size: number;
  stride: number[];
  offset: number;
  constructor(
    type: DType,
    shape: number[],
    data?: T,
    stride?: number[],
    offset?: number,
  )
  public data: T
  public get(...args: number[]): number
  public set(...args: number[]): void
  public index(...args: number[]): number
  public assign(input: T): void
  public relese(): this
  public clone(): Tensor<T>

  static IndexToCoord(shape: number[], index: number): number[]
  static CoordToIndex(shape: number[], coords: number[]): number
  static Malloc(dtype: DType, size: number): TensorDataView
  static DefineType(data: TensorDataView): DType
  static GetTypedArray(dtype: DType, data: TensorDataView): TensorDataView
  static GetSize(shape: number[]): number

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
  SetShapeFn(fn: () => number[]): this
  PreCompile(fn: Function): this
  PostCompile(fn: Function): this
  Compile(input: { [key: string]: InputType }): Operation
}

export class Session {
  init(op: Operation): void
  runOp(op: Operation, frame: number, out: Tensor): boolean
  destroy(): void
  readToTensor(tensor: Tensor<Uint8Array | Float32Array>)
}

export class Operation {
}

/* Common */
type InputType = Tensor | Operation;