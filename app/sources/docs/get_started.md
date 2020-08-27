# Get Started

The library is a high-level abstraction API to create and run operations on different backends (WebGL, WASM, JS). GammaCV also enables you to construct operation graphs and control the flow of execution.

## Installation
To use GammaCV you first need to install it. 
To install the latest stable version run:
`npm install gammacv --save`

## Core Concepts
To use GammaCV, you need to understand three core concepts: tensors, operations, and sessions. The basic unit of this library is a tensor. `Tensor` allows you to create N-dimensional vector and store it in memory using TypedArrays. The second part of the library is an operation. `Operation` under the hood is graph node which will have multiple inputs and always produce a single output. The third component is a session. `Session` is a runtime which allows you to run computational graphs on different backends with the same API. For a better understanding of how it works let's create a simple program and run it on the GPU using WebGL:

<iframe height="500" style="width: 100%;" scrolling="no" title="GammaCV core concepts" src="//codepen.io/WorldThirteen/embed/RdvoZb/?height=500&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/WorldThirteen/pen/RdvoZb/'>GammaCV core concepts</a> by Mihail
  (<a href='https://codepen.io/WorldThirteen'>@WorldThirteen</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Chaining / Pipelining operations
For real world applications, you'll often need to combine multiple operations in sequence. With GammaCV this is as easy as creating a pipeline. This is just a semantic nuance, if you've followed the example above, you've already created one.

<iframe height="500" style="width: 100%;" scrolling="no" title="GammaCV pipelining operations example" src="//codepen.io/WorldThirteen/embed/wONzjL/?height=500&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/WorldThirteen/pen/wONzjL/'>GammaCV pipelining operations example</a> by Mihail
  (<a href='https://codepen.io/WorldThirteen'>@WorldThirteen</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Run fast real time processing

<iframe height="500" style="width: 100%;" scrolling="no" title="GammaCV pipelining operations example" src="//codepen.io/WorldThirteen/embed/KEJgrz/?height=500&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" allow="camera">
  See the Pen <a href='https://codepen.io/WorldThirteen/pen/KEJgrz/'>GammaCV pipelining operations example</a> by Mihail
  (<a href='https://codepen.io/WorldThirteen'>@WorldThirteen</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
