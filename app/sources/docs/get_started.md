# Get Started

The library is a high-level abstraction API to create and run operations on different backends (WebGL, WASM, JS). GammaCV also enables you to construct operation graphs and control the flow of execution.

## Installation
To use GammaCV you first need to install it. 
To install the latest stable version run:
`npm install gammacv --save`

## Core Concepts
The basic unit of the library is tensor, `Tensor` allows you to create N-dimensional vector and store it in memory using TypedArrays. The second part of the library is `Operation`, operation under the hood is graph node which will have multiple inputs and always produce a single output. The third component is `Session`, the session is runtime which allows you to run computational graphs on different backends with the same API. For the better understanding of how it works let's create a simple program and run it on GPU using WebGL:

````JS
const imgURL = 'https://avatars1.githubusercontent.com/u/33897736?s=400&v=4';

// load image from URL or base64 string and store a result in input tensor
gm.imageTensorFromURL(imgURL, 'uint8', [400, 400, 4], true).then((input) => {
  // use tesor as input of build in Gaussian Blur operation
  // operation constructor return you compiled operation instance
  const operation = gm.sobelOperator(input);

  // create the tensor for operation output
  const output = gm.tensorFrom(operation);

  // then we need to create Session which will run created
  // graph using GPU power and read result to ouput tensor
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
