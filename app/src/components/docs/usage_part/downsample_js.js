/* eslint-disable */
const data = [
  {
    "author": "Arkadiy Pilguk(apilguk@gmail.com)",
    "license": "MIT"
  },
  {
    "name": "Downsample",
    "description": "Performance always important, but some algorythms is very expencive to be\n   applyed for original picture size. For this case we need try reduce image\n   size and then apply algorythm, tinycv support a few different ways to reduce\n   demention my meaning pizels or use it maximum value wich is known as MaxPooling\n   layer.",
    "examples": [
      {
        "title": "example",
        "description": "// this line reduces an input image in 3x\n   downsampleOp(inputImage, 3, 0);"
      },
      {
        "title": "example",
        "description": "// this line reduces an input image in 3x\n   downsampleOp(inputImage, 3, 0);"
      }
    ],
    "params": [
      {
        "name": "tSrc",
        "description": "The source image to be downsampled.",
        "type": [
          {
            "type": "Tensor"
          }
        ],
        "optional": false
      },
      {
        "name": "k",
        "description": "Downsampling coeficient.",
        "type": [
          {
            "type": "number"
          }
        ],
        "optional": false
      },
      {
        "name": "s",
        "description": "Downsampling support two possible variants of processing\n   pixels to be downsampled 0 - Max, 1 - Mean.",
        "type": [
          {
            "type": "number"
          }
        ],
        "optional": false
      }
    ]
  }
]

export default data;
