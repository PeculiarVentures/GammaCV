/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Tensor from '../program/tensor';
import * as utils from './canvas_utils';

export function canvasFromTensor(canvas, img, rgba = false, transposed = false) {
  if (!(img instanceof Tensor)) {
    throw Error('tensorToCanvas: Input tensor invalid');
  }

  if (img.shape[2] && img.shape[2] === 4) {
    rgba = true;
  }

  const imageData = utils.toImageData(img, rgba, transposed);

  canvas.getContext('2d').putImageData(imageData, 0, 0);
}

export function canvasToTensor(canvas, dst) {
  const imgData = canvas.getContext('2d').getImageData(0, 0, dst.shape[1], dst.shape[0]);

  if (dst) {
    switch (dst.dtype) {
      case 'uint8': {
        dst.assign(new Uint8Array(imgData.data));
        break;
      }
      case 'uint8c': {
        dst.assign(imgData.data);
        break;
      }
      case 'float32':
      default: {
        dst.assign(new Float32Array(imgData.data));
        break;
      }
    }
  }
}

export const canvasDrawLine = (canvas, line, color = 'rgba(255, 0, 0, 0.5)', width = 1) => {
  const context = canvas.getContext('2d');

  context.beginPath();
  if (Array.isArray(line)) {
    context.moveTo(line[0], line[1]);
    context.lineTo(line[2], line[3]);
  } else {
    context.moveTo(line.data[0], line.data[1]);
    context.lineTo(line.data[2], line.data[3]);
  }
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
  context.closePath();
};

export const canvasDrawCircle = (canvas, coords, radius = 5, stroke = '#ff0000') => {
  const context = canvas.getContext('2d');

  context.beginPath();
  context.arc(coords[0], coords[1], radius, 0, (2 * Math.PI));
  context.strokeStyle = stroke;
  context.stroke();
};

export const canvasFillCircle = (canvas, coords, radius, fill = '#ff0000') => {
  const context = canvas.getContext('2d');

  context.beginPath();
  context.arc(coords[0], coords[1], radius, 0, (2 * Math.PI));
  context.fillStyle = fill;
  context.fill();
};

export const clearCanvas = (canvas) => {
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const canvasDrawRect = (canvas, rect, color = 'rgba(255, 0, 0, 1)', width = 1, cross = false, fill = false) => {
  const context = canvas.getContext('2d');

  context.beginPath();
  context.moveTo(rect.ax, rect.ay);
  context.lineTo(rect.bx, rect.by);
  context.lineTo(rect.cx, rect.cy);
  context.lineTo(rect.dx, rect.dy);
  context.lineTo(rect.ax, rect.ay);

  if (cross) {
    context.lineTo(rect.ax, rect.ay);
    context.lineTo(rect.cx, rect.cy);
    context.lineTo(rect.bx, rect.by);
    context.lineTo(rect.dx, rect.dy);
    context.lineTo(rect.ax, rect.ay);
  }

  context.strokeStyle = color;
  if (fill) {
    context.fillStyle = color;
    context.fill();
  }
  context.stroke();
  context.lineWidth = width;
  context.closePath();
};

export function canvasFill(canvas, color) {
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export const canvasClear = (canvas) => {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
};

export const canvasInit = (id, width, height) => {
  const canvas = document.querySelector(id);

  canvas.width = width;
  canvas.height = height;

  return canvas;
};

export const canvasCreate = (width, height) => {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  return canvas;
};
