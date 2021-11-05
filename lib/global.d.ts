declare module '*.glsl' {
  const value: string;
  export default value;
}

// TODO: ts-migration Now it the same as TypedArray. Maybe prefer it? If we don't want to extend it with new types in future
type TensorDataView =
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
  'uint8c';

interface DTypeMapper {
  'uint8': Uint8Array;
  'uint16': Uint16Array;
  'uint32': Uint32Array;
  'int8': Int8Array;
  'int16': Int16Array;
  'int32': Int32Array;
  'float32': Float32Array;
  'float64': Float64Array;
  'uint8c': Uint8ClampedArray;
}

type AvailableGLSLChunks = 'pickCurrentValue' | 'pickValue' | 'float';


type MediaInputType = HTMLVideoElement | HTMLCanvasElement;


// TEST ONLY

declare module '*.webm' {
  const value: string;

  export default value;
}

declare module '*.mp4' {
  const value: string;

  export default value;
}

declare module '*.ogg' {
  const value: string;

  export default value;
}

declare module '*.png' {
  const value: string;

  export default value;
}

declare module '*.json' {
  const value: ArrayBuffer;

  export default value;
}