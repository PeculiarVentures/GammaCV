# Get Started

The library is a high-level abstraction API to create and run operations on different backends (WebGL, WASM, JS). GammaCV also enables you to construct operation graphs and control the flow of execution.

## Installation
To use GammaCV you first need to install it. 
To install the latest stable version run:
`npm install gammacv --save`

## Core Concepts
To use GammaCV, you need to understand three core concepts: tensors, operations, and sessions. The basic unit of this library is a tensor. `Tensor` allows you to create an N-dimensional vector and store it in memory using TypedArrays. The second part of the library is an operation. `Operation` under the hood is graph node which will have multiple inputs and always produce a single output. The third component is a session. `Session` is a runtime which allows you to run computational graphs on different backends with the same API. For a better understanding of how it works let's create a simple program and run it on the GPU using WebGL:

````JS
const imgURL = 'https://avatars1.githubusercontent.com/u/33897736?s=400&v=4';

// load image from URL or base64 string and store a result in input tensor
gm.imageTensorFromURL(imgURL, 'uint8', [400, 400, 4], true).then((input) => {
  // use the image tensor as the input for the sobelOperator operation
  // operations return a compiled operation instance
  const operation = gm.sobelOperator(input);

  // create the tensor for operation output
  const output = gm.tensorFrom(operation);

  // then we need to create Session which will run created
  // graph using GPU power and read result to output tensor
  const sess = new gm.Session();
  // then you should init operation for current session
  sess.init(operation);
  // and finaly for visualize result we need create canvas
  const canvas = gm.canvasCreate(400, 400);

  document.body.appendChild(canvas);
  sess.runOp(operation, 0, output);

  gm.canvasFromTensor(canvas, output);
});
````

## Chaining / Pipelining operations
For real world applications, you'll often need to combine multiple operations in sequence. With GammaCV this is as easy as creating a pipeline. This is just a semantic nuance, if you've followed the example above, you've already created one.

```JS
const imgURL = 'https://avatars1.githubusercontent.com/u/33897736?s=400&v=4';

// load image from URL or base64 string and store a result in input tensor
gm.imageTensorFromURL(imgURL, 'uint8', [400, 400, 4], true).then((input) => {
  // The input is already a valid operation that can be chained.
  // notice the use of 'let'. We are going to reuse the pipeline variable.
  let pipeline = input

  // Operations always return a valid input for another operation.
  // If you are a functional programmer, you could easily compose these.
  pipeline = gm.grayscale(pipeline);
  pipeline = gm.gaussianBlur(pipeline, 3, 3);
  pipeline = gm.sobelOperator(pipeline);
  pipeline = gm.cannyEdges(pipeline, 1, 1);

  // Run your operation
  const output = gm.tensorFrom(pipeline);
  const sess = new gm.Session();
  sess.init(pipeline);
  sess.runOp(pipeline, 0, output);
  
  // display your output
  const canvas = gm.canvasCreate(400, 400);
  document.body.appendChild(canvas);
  gm.canvasFromTensor(canvas, output);
});
```
