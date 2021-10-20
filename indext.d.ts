declare module '*.glsl' {
  const value: string;
  export default value;
}

type TensorDataView =
  number[] |
  Float32Array |
  Float64Array |
  Uint8Array |
  Uint16Array |
  Uint32Array |
  Int8Array |
  Int16Array |
  Int32Array |
  Uint8ClampedArray;

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