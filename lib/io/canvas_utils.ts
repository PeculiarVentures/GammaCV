/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import type Tensor from '../program/tensor';

export function initDrawable(canvas: HTMLCanvasElement, output: Tensor, updater?: () => void) {
  let flag = false;

  canvas.onmousedown = () => { flag = true; };
  canvas.onmouseup = () => { flag = false; };
  canvas.onmousemove = (e) => {
    if (flag) {
      output.set(e.offsetY, e.offsetX, 255);

      if (updater) {
        updater();
      }
    }
  };

  return () => {
    canvas.onmousedown = null;
    canvas.onmouseup = null;
    canvas.onmousemove = null;
  };
}

export function initMouseTracking(
  canvas: HTMLCanvasElement,
  handler: (a: number, b: number) => void,
) {
  canvas.onmousemove = e => handler(e.offsetX, e.offsetY);

  return () => {
    canvas.onmousemove = null;
  };
}


/**
 * toImageData
 * @param {Tensor} img
 * @param {boolean} rgba
 * @return {ImageData}
 */
export function toImageData(
  img: Tensor,
  rgba: boolean = false,
  transposed: boolean = false,
) {
  const imageData = new ImageData(img.shape[1], img.shape[0]);
  const size = img.shape[0] * img.shape[1];

  if (rgba && img.dtype === 'uint8') {
    imageData.data.set(img.data);

    return imageData;
  }

  if (!rgba) {
    for (let i = 0; i < size; i += 1) {
      const y = ~~(i / img.shape[0]);
      const x = i - (y * img.shape[1]);
      const val = img.data[i];
      let offset = 0;

      if (!transposed) {
        offset = ((y * img.shape[1]) + x) * 4;
      } else {
        offset = ((x * img.shape[0]) + y) * 4;
      }

      imageData.data[offset + 0] = val;
      imageData.data[offset + 1] = val;
      imageData.data[offset + 2] = val;
      imageData.data[offset + 3] = 255;
    }

    return imageData;
  }

  if (img.dtype === 'float32') {
    for (let i = 0; i < img.size; i += 1) {
      imageData.data[i] = img.data[i] * 255;
    }
  } else {
    for (let i = 0; i < img.size; i += 1) {
      imageData.data[i] = img.data[i];
    }
  }

  return imageData;
}

export function getImageData(
  canvas: HTMLCanvasElement,
  x = 0,
  y = 0,
  w = canvas.width,
  h = canvas.height,
) {
  return canvas.getContext('2d').getImageData(x, y, w, h);
}

export function putImageData(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  x = 0,
  y = 0,
  dx = 0,
  dy = 0,
  dw = imageData.width,
  dh = imageData.height,
  clear: boolean = false,
) {
  if (imageData.width !== canvas.width || imageData.height !== canvas.height || clear) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  return canvas.getContext('2d').putImageData(imageData, x, y, dx, dy, dw, dh);
}
