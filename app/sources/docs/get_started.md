# Get Started

The library is a high-level abstraction API to create and run operations on different backends (WebGL, WASM, JS). GammaCV also enables you to construct operation graphs and control the flow of execution.

## Installation
To use GammaCV you first need to install it. 
To install the latest stable version run:
`npm install gammacv --save`

## Core Concepts
To use GammaCV, you need to understand three core concepts: tensors, operations, and sessions. The basic unit of this library is a tensor. `Tensor` allows you to create N-dimensional vector and store it in memory using TypedArrays. The second part of the library is an operation. `Operation` under the hood is graph node which will have multiple inputs and always produce a single output. The third component is a session. `Session` is a runtime which allows you to run computational graphs on different backends with the same API. For a better understanding of how it works let's create a simple program and run it on the GPU using WebGL:

````JS
const imgURL = 'https://source.unsplash.com/random/500x400';
const width = 500;
const heigth = 400;

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
  const canvas = gm.canvasCreate(width, heigth);

  document.body.appendChild(canvas);
  sess.runOp(operation, 0, output);

  gm.canvasFromTensor(canvas, output);
});
````

## Chaining / Pipelining operations
For real world applications, you'll often need to combine multiple operations in sequence. With GammaCV this is as easy as creating a pipeline. This is just a semantic nuance, if you've followed the example above, you've already created one.

```JS
import * as gm from 'gammacv';

const imgURL = 'https://source.unsplash.com/random/500x400';
const width = 500;
const heigth = 400;

// load image from URL or base64 string and store a result in input tensor
gm.imageTensorFromURL(imgURL, 'uint8', [heigth, width, 4], true).then((input) => {
  // the input is already a valid operation that can be chained
  // notice the use of 'let'. We are going to reuse the pipeline variable
  let pipeline = input

  // operations always return a valid input for another operation.
  // if you are a functional programmer, you could easily compose these.
  pipeline = gm.grayscale(pipeline);
  pipeline = gm.gaussianBlur(pipeline, 3, 3);
  pipeline = gm.sobelOperator(pipeline);
  pipeline = gm.cannyEdges(pipeline, 0.25, 0.75);

  // allocate output tensor
  const output = gm.tensorFrom(pipeline);

  sess.init(pipeline);

  // run your operation
  sess.runOp(pipeline, 0, output);

  // display your output
  const canvasOriginal = gm.canvasCreate(width, heigth);
  const canvasProcessed = gm.canvasCreate(width, heigth);

  document.body.appendChild(canvasOriginal);
  document.body.appendChild(canvasProcessed);
  gm.canvasFromTensor(canvasOriginal, input);
  gm.canvasFromTensor(canvasProcessed, output);
});
```

## Run fast real time processing

```JS
import * as gm from 'gammacv';

const width = 500;
const heigth = 400;
// initialize WebRTC stream and session for runing operations on GPU
const stream = new gm.CaptureVideo(width, heigth);
const sess = new gm.Session();
const canvasProcessed = gm.canvasCreate(width, heigth);

// session uses a context for optimize calculations and prevent recalculations
// context actually a number which help algorythm to run operation efficiently  
let context = 0;
// allocate memeory for storing a frame and calculations output
const input = new gm.Tensor('uint8', [heigth, width, 4]);
// construct operation grap which is actially a Canny Edge Detector
let pipeline = input

pipeline = gm.grayscale(pipeline);
pipeline = gm.gaussianBlur(pipeline, 3, 3);
pipeline = gm.sobelOperator(pipeline);
pipeline = gm.cannyEdges(pipeline, 0.25, 0.75);

// initialize graph
sess.init(pipeline);

// allocate output
const output = gm.tensorFrom(pipeline);

// create loop
const tick = () => {
    requestAnimationFrame(tick);
    // Read current in to the tensor
    stream.getImageBuffer(input);

    // Finaly run operation on GPU and then write result in to output tensor
    sess.runOp(pipeline, context, output);

    // Draw result into canvas
    gm.canvasFromTensor(canvasProcessed, output);

    // if we would like to be graph recalculated we need 
    // to change the context for next frame
    context += 1;
}

// Start capturing a camera and run loop
stream.start();
tick();

document.body.appendChild(stream.canvas);
document.body.appendChild(canvasProcessed);
```
