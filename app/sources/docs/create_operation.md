# Create Operation
When building graphs using `GammaCV`, you may want to create a new `Operation`. This article will describe how to create your own `Operation`.

## Prerequisites
This document assumes familiarity with the fundamentals of GammaCV introduced in the Core Concepts section of [Getting Started](/docs/get_started). We recommend completing Core Concepts before reading this tutorial.

## Name operation
To create a shell your operation, you simply need to use `RegisterOperation`

```js
import * as gm from 'gammacv';

const myOperation = new gm.RegisterOperation('MyOp')
```


## Describe inputs and output
### Inputs
You can append input using ```.Input(name <string>, dtype <string>)```

```js
const myOperation = new gm.RegisterOperation('MyOp')
  .Input('src', 'uint8')
```
This code appends input named src and described it as unsigned byte datatype.
At this milestone, we support only `uint8` and `float32` input datatypes.
Each `RegisterOperation` instance method returns itself, so you can pipe multiple inputs.
It is very usefull for future steps to name inputs starting with `t`, like "src" -> "tSrc".
```js
const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Input('tMask', 'float32')
```

### Output
You should describe the output datatype using `.Output(dtype <string>)`, and output shape using `.SetShapeFn(cb <function>)`.
At this milestone, we support only `uint8` and `float32` output datatypes and only shapes that matched `[n, m, 4]`.
By default output datatype and shape are the same as in first input.
You can specify Output just once for one operation.
```js
const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Input('tMask', 'float32')
  .Output('uint8')
  .SetShapeFn(() => [20, 15, 4])
```

In this way, you described that your operation receives two inputs and specify their names and datatypes, and the output will be Tensor('uint8', [20, 15, 4]).

## Describe variables and constants
You may want to have some variables or constants other than the input data.
`.Constant(name <string>, value <string|number>)` - will create a constant that can't be change once operation was compiled.
`.Uniform(name <string>, type <string>, value <string|number>)` - will create a variable which you can change between operation executing, supported types are:
```js
'bool', 'int', 'uint',
'float', 'double',
'vec2', 'vec3', 'vec4',
'mat2', 'mat3', 'mat4'
```

```js
const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Input('tMask', 'float32')
  .Output('uint8')
  .SetShapeFn(() => [20, 15, 4])
  .Constant('TRESHOLD', 0.5)
  .Uniform('uMultiplier', 'float', 0.5)
```

## Write WebGL backend
You can write your WebGL backend as a string or as a separate file and load it via network request or your module bundler. This named as operation kernel.
[WebGL](https://en.wikipedia.org/wiki/WebGL) backend should be written using [GLSL (OpenGL Shading Language)](https://en.wikipedia.org/wiki/OpenGL_Shading_Language). You should use [OpenGL ES 2.0](https://en.wikipedia.org/wiki/OpenGL_ES#OpenGL_ES_2.0) standard to be compatible with devices that support only WebGL 1.0, and you can use [OpenGL ES 3.0](https://en.wikipedia.org/wiki/OpenGL_ES#OpenGL_ES_3.0) for devices compatible with WebGL 2.0.

You shouldn't use `void main` in kernel code!
The entry point for your code is `vec4 operation(float y, float x)` that should be defined.
This entry point will be called for each output component of operation and receives coordinate of this component as float arguments and should return a 4-component vector of the output value.

```glsl
vec4 operation(float y, float x) {
  return vec4(0.0);
}
```
This code will fill output with zeros.

### Use constants and uniforms
Inside your glsl kernel you can use constants defined with RegisterOperation, just type the name of constant or variable, be careful and check the types of your variables.
```js
const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .SetShapeFn(() => [20, 15, 4])
  .Constant('FILL', 1.0)
  .Uniform('uMultiplier', 'float', 0.3)
```
```glsl
vec4 operation(float y, float x) {
  return vec4(y * uMultiplier, x * uMultiplier, TRESHOLD, TRESHOLD);
}
```

### GLSL Chunks
The full documentation for GLSL Chunks, you can find [here](/docs/glsl_chunks)
If you want to get inputs data inside your kernel, you should use pre-defined glsl-chunks, and specify it's loading in RegisterOperation pipe:
```js
const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .SetShapeFn(() => [20, 15, 4])
  .Constant('FILL', 1.0)
  .Uniform('uMultiplier', 'float', 0.3)
  .LoadChunk('pickValue')
```
Then you can use it in glsl code
```glsl
vec4 operation(float y, float x) {
  return pickValue_tSrc(y, x) * pickValue_tSrc(y, x);
}
```

### Append backend to operation
You should use `.GLSLKernel(kernel <string>)` for this.
```js
import kernel from './kernel.glsl';

const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .SetShapeFn(() => [20, 15, 4])
  .Constant('FILL', 1.0)
  .Uniform('uMultiplier', 'float', 0.3)
  .LoadChunk('pickValue')
  .GLSLKernel(kernel)
```

## Provide inputs and compile
To prepare your operation for a run, you should compile it with providing input tensors:
`.Compile(inputs <Object>)`, where inputs object has keys named same as operation's input and contain tensor or operation as values

```js
const tSrc = new gm.Tensor('uint8', [2, 2, 4]);

const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .SetShapeFn(() => [1, 1, 4])
  .Constant('FILL', 1.0)
  .Uniform('uMultiplier', 'float', 0.3)
  .LoadChunk('pickValue')
  .GLSLKernel(kernel)
  .Compile({ tSrc })
```
This method returns `Operation` instance that is ready to provide into `Session`.

## Example

index.js
```js
import * as gm from 'gammacv';
import kernel from './kernel.glsl';

const tSrc = new gm.Tensor('uint8', [2, 2, 4], [
  200, 2, 3, 34,  5, 6, 7, 125,
  9, 6, 7, 0,     3, 4, 5, 0,
]);

const myOperation = new gm.RegisterOperation('MyOp')
  .Input('tSrc', 'uint8')
  .Output('uint8')
  .SetShapeFn(() => [1, 1, 4])
  .Constant('FILL', 1.0)
  .Uniform('uMultiplier', 'float', 0.5)
  .LoadChunk('pickValue')
  .GLSLKernel(kernel)
  .Compile({ tSrc })
```

kernel.glsl
```glsl
// will be called just once since the output is only one pixel
// y and x will be 0.0
vec4 operation(float y, float x) {
  vec4 data = pickValue_tSrc(y, x);
  // data will have value around vec4(0.78, 0.0078, 0.011, 0.13)
  // since uint values are viewed as floats 0..1 that describes (0..255)

  return vec4(data.r * uMultiplier, FILL, FILL, FILL);
  // will return around vec4(0.78 * 0.5 = 0.39, 1.0, 1.0, 1.0)
  // that will be viewed in uint8 as vec4(100, 255, 255, 255).`
}
```

Running this operation will output tensor with next data: [100, 255, 255, 255].