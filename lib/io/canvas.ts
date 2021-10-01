/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Tensor from '../program/tensor';
import Line from '../math/line';
import Rect from '../math/rect';
import { assertQuerySelector, getCanvas } from '../utils';
import * as utils from './canvas_utils';

export function canvasFromTensor(
  canvas: HTMLCanvasElement,
  target: Tensor,
  rgba?: boolean,
  transposed?: boolean,
) {
  if (!(target instanceof Tensor)) {
    throw Error('tensorToCanvas: Input tensor invalid');
  }

  if (target.shape[2] && target.shape[2] === 4) {
    rgba = true;
  }

  const imageData = utils.toImageData(target, rgba, transposed);

  canvas.getContext('2d').putImageData(imageData, 0, 0);
}

export function canvasToTensor(canvas: HTMLCanvasElement, target: Tensor) {
  const imgData = canvas.getContext('2d').getImageData(0, 0, target.shape[1], target.shape[0]);

  if (target) {
    switch (target.dtype) {
      case 'uint8': {
        target.assign(new Uint8Array(imgData.data));
        break;
      }
      case 'uint8c': {
        target.assign(imgData.data);
        break;
      }
      case 'float32':
      default: {
        target.assign(new Float32Array(imgData.data));
        break;
      }
    }
  }
}

export const canvasDrawLine = (
  canvas: HTMLCanvasElement,
  line: Line | number[],
  color: string = 'rgba(255, 0, 0, 0.5)',
  lineWeight: number = 1,
) => {
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
  context.lineWidth = lineWeight;
  context.stroke();
  context.closePath();
};

export const canvasDrawCircle = (
  canvas: HTMLCanvasElement,
  center: number[],
  radius: number = 5,
  color: string = '#ff0000',
) => {
  const context = canvas.getContext('2d');

  context.beginPath();
  context.arc(center[0], center[1], radius, 0, (2 * Math.PI));
  context.strokeStyle = color;
  context.stroke();
};

export const canvasFillCircle = (
  canvas: HTMLCanvasElement,
  center: number[],
  radius: number = 5,
  color: string = '#ff0000',
) => {
  const context = canvas.getContext('2d');

  context.beginPath();
  context.arc(center[0], center[1], radius, 0, (2 * Math.PI));
  context.fillStyle = color;
  context.fill();
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const canvasDrawRect = (
  canvas: HTMLCanvasElement,
  rect: Rect,
  color: string = '#ff0000',
  width: number = 1,
  cross: boolean = false,
  fill: boolean = false,
) => {
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

export function canvasFill(canvas: HTMLCanvasElement, color: string = '#ff0000') {
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export const canvasClear = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
};

export const canvasInit = (canvasId: string, width: number, height: number) => {
  assertQuerySelector();

  const canvas = document.querySelector < HTMLCanvasElement > (canvasId);

  canvas.width = width;
  canvas.height = height;

  return canvas;
};

export const canvasCreate = (width: number, height: number) => {
  const canvas = getCanvas();

  canvas.width = width;
  canvas.height = height;

  return canvas;
};
