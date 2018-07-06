/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Tensor from '../program/tensor';

export function imageTensorFromURL(url, type = 'uint8', outShape, cors = false) {
  return new Promise((reolve, reject) => {
    const image = document.createElement('img');
    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    let width;
    let height;

    image.src = url;

    if (cors) {
      image.crossOrigin = 'Anonimus';
    }

    image.onload = () => {
      if (outShape) {
        width = outShape[1];
        height = outShape[0];
      } else {
        width = image.width;
        height = image.height;
      }
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      let data;
      const imgData = context.getImageData(0, 0, width, height);

      switch (type) {
        case 'uint8': {
          data = new Uint8Array(imgData.data.buffer);
          break;
        }
        case 'float32': {
          data = new Float32Array(imgData.data);
          break;
        }
        default: {
          data = imgData.data;
        }
      }

      const dst = new Tensor(type, [height, width, 4], data);

      reolve(dst);
    };

    image.onerror = reject;
  });
}
