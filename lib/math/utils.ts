/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import type { TLine } from './line';


// TODO: canvas doesn't used
export function sortPoints(points: number[][], canvas?: HTMLCanvasElement) { // eslint-disable-line
  // How it works?
  const center = [0, 0];
  let A = null;
  let B = null;
  let C = null;
  let D = null;

  center[0] += points[0][0];
  center[0] += points[1][0];
  center[0] += points[2][0];
  center[0] += points[3][0];
  center[1] += points[0][1];
  center[1] += points[1][1];
  center[1] += points[2][1];
  center[1] += points[3][1];

  center[0] /= 4;
  center[1] /= 4;

  for (let i = 0; i < points.length; i += 1) {
    if (points[i][0] >= center[0] && points[i][1] >= center[1]) {
      C = points[i];
    }

    if (points[i][0] <= center[0] && points[i][1] <= center[1]) {
      A = points[i];
    }

    if (points[i][0] >= center[0] && points[i][1] <= center[1]) {
      B = points[i];
    }

    if (points[i][0] <= center[0] && points[i][1] >= center[1]) {
      D = points[i];
    }
  }

  return [A, B, C, D];
}

// TODO: conflict between types and code
export function angleBetweenLines(line1: number[], line2: number[]) {
// export function angleBetweenLines(line1: TLine, line2: TLine) {
  const dx1 = line1[2] - line1[0];
  const dy1 = line1[3] - line1[1];
  const dx2 = line2[2] - line2[0];
  const dy2 = line2[3] - line2[1];

  const d = dx1 * dx2 + dy1 * dy2;
  const l2 = (dx1 * dx1 + dy1 * dy1) * (dx2 * dx2 + dy2 * dy2);

  return Math.acos(d / Math.sqrt(l2));
}

// TODO: need a way to import Tensor only as interface
export function transformPoint(px: number, py: number, transformation: any) {
  const m = transformation;
  let xs = 0.0;
  let ys = 0.0;
  let xs0 = 0.0;
  let ys0 = 0.0;
  let ws = 0.0;
  let sc = 0.0;

  xs0 = m.get(0, 1) * py + m.get(0, 2);
  ys0 = m.get(1, 1) * py + m.get(1, 2);
  ws = m.get(2, 1) * py + m.get(2, 2);

  xs0 += m.get(0, 0) * px;
  ys0 += m.get(1, 0) * px;
  ws += m.get(2, 0) * px;


  sc = 1.0 / ws;
  xs = xs0 * sc;
  ys = ys0 * sc;

  return [xs, ys];
}

/* eslint-disable */

/**
 * Fill transformMatrix with transformation values for fixing rect's perspective to be full viewed in view bounds.
 * @param {Rect} rect
 * @param {Array} dstBounds
 * @param {Tensor} transformMatrix
 */
// TODO: need a way to import Tensor only as interface
// TODO: need a way to import Rect only as interface
export function generateTransformMatrix(rect: Rect, dstBounds: [number, number], transformMatrix: Tensor, pad: number = 0) {
  perspective_4point_transform(
    transformMatrix,
    pad, pad, rect.ax, rect.ay,
    dstBounds[1] - pad, pad, rect.bx, rect.by,
    dstBounds[1] - pad, dstBounds[0] - pad, rect.cx, rect.cy,
    pad, dstBounds[0] - pad, rect.dx, rect.dy,
    transformMatrix.shape.length === 3 && transformMatrix.shape[2] === 4,
  );

  return transformMatrix;
}

/**
 * Get perspective transformation matrix
 * @param {Tensor} dst
 * @param src_x0
 * @param src_y0
 * @param dst_x0
 * @param dst_y0
 * @param src_x1
 * @param src_y1
 * @param dst_x1
 * @param dst_y1
 * @param src_x2
 * @param src_y2
 * @param dst_x2
 * @param dst_y2
 * @param src_x3
 * @param src_y3
 * @param dst_x3
 * @param dst_y3
 */
function perspective_4point_transform(
  dst: number, src_x0: number, src_y0: number, dst_x0: number, dst_y0: number,
  src_x1: number, src_y1: number, dst_x1: number, dst_y1: number,
  src_x2: number, src_y2: number, dst_x2: number, dst_y2: number,
  src_x3: number, src_y3: number, dst_x3: number, dst_y3: number,
  nd4 = false // if we should apply for 4d based vector.
) {
  let t1 = src_x0;
  let t2 = src_x2;
  let t4 = src_y1;
  let t5 = t1 * t2 * t4;
  let t6 = src_y3;
  let t7 = t1 * t6;
  let t8 = t2 * t7;
  let t9 = src_y2;
  let t10 = t1 * t9;
  let t11 = src_x1;
  let t14 = src_y0;
  let t15 = src_x3;
  let t16 = t14 * t15;
  let t18 = t16 * t11;
  let t20 = t15 * t11 * t9;
  let t21 = t15 * t4;
  let t24 = t15 * t9;
  let t25 = t2 * t4;
  let t26 = t6 * t2;
  let t27 = t6 * t11;
  let t28 = t9 * t11;
  let t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28);
  let t32 = t1 * t15;
  let t35 = t14 * t11;
  let t41 = t4 * t1;
  let t42 = t6 * t41;
  let t43 = t14 * t2;
  let t46 = t16 * t9;
  let t48 = t14 * t9 * t11;
  let t51 = t4 * t6 * t2;
  let t55 = t6 * t14;
  const Hr0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30;
  const Hr1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30;
  const Hr2 = t1;
  const Hr3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30;
  const Hr4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30;
  const Hr5 = t14;
  const Hr6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30;
  const Hr7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30;

  t1 = dst_x0;
  t2 = dst_x2;
  t4 = dst_y1;
  t5 = t1 * t2 * t4;
  t6 = dst_y3;
  t7 = t1 * t6;
  t8 = t2 * t7;
  t9 = dst_y2;
  t10 = t1 * t9;
  t11 = dst_x1;
  t14 = dst_y0;
  t15 = dst_x3;
  t16 = t14 * t15;
  t18 = t16 * t11;
  t20 = t15 * t11 * t9;
  t21 = t15 * t4;
  t24 = t15 * t9;
  t25 = t2 * t4;
  t26 = t6 * t2;
  t27 = t6 * t11;
  t28 = t9 * t11;
  t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28);
  t32 = t1 * t15;
  t35 = t14 * t11;
  t41 = t4 * t1;
  t42 = t6 * t41;
  t43 = t14 * t2;
  t46 = t16 * t9;
  t48 = t14 * t9 * t11;
  t51 = t4 * t6 * t2;
  t55 = t6 * t14;
  const Hl0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30;
  const Hl1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30;
  const Hl2 = t1;
  const Hl3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30;
  const Hl4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30;
  const Hl5 = t14;
  const Hl6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30;
  const Hl7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30;

  // the following code computes R = Hl * inverse Hr
  t2 = Hr4 - Hr7 * Hr5;
  t4 = Hr0 * Hr4;
  t5 = Hr0 * Hr5;
  t7 = Hr3 * Hr1;
  t8 = Hr2 * Hr3;
  t10 = Hr1 * Hr6;
  const t12 = Hr2 * Hr6;
  t15 = 1.0 / (t4 - t5 * Hr7 - t7 + t8 * Hr7 + t10 * Hr5 - t12 * Hr4);
  t18 = -Hr3 + Hr5 * Hr6;
  const t23 = -Hr3 * Hr7 + Hr4 * Hr6;
  t28 = -Hr1 + Hr2 * Hr7;
  const t31 = Hr0 - t12;
  t35 = Hr0 * Hr7 - t10;
  t41 = -Hr1 * Hr5 + Hr2 * Hr4;
  const t44 = t5 - t8;
  const t47 = t4 - t7;
  t48 = t2 * t15;
  const t49 = t28 * t15;
  const t50 = t41 * t15;
  const mat = dst.data;

  if (nd4) {
    mat[0] = Hl0 * t48 + Hl1 * (t18 * t15) - Hl2 * (t23 * t15);
    mat[1] = Hl0 * t49 + Hl1 * (t31 * t15) - Hl2 * (t35 * t15);
    mat[2] = -Hl0 * t50 - Hl1 * (t44 * t15) + Hl2 * (t47 * t15);
    mat[4] = Hl3 * t48 + Hl4 * (t18 * t15) - Hl5 * (t23 * t15);
    mat[5] = Hl3 * t49 + Hl4 * (t31 * t15) - Hl5 * (t35 * t15);
    mat[6] = -Hl3 * t50 - Hl4 * (t44 * t15) + Hl5 * (t47 * t15);
    mat[8] = Hl6 * t48 + Hl7 * (t18 * t15) - t23 * t15;
    mat[9] = Hl6 * t49 + Hl7 * (t31 * t15) - t35 * t15;
    mat[10] = -Hl6 * t50 - Hl7 * (t44 * t15) + t47 * t15;
  } else {
    mat[0] = Hl0 * t48 + Hl1 * (t18 * t15) - Hl2 * (t23 * t15);
    mat[1] = Hl0 * t49 + Hl1 * (t31 * t15) - Hl2 * (t35 * t15);
    mat[2] = -Hl0 * t50 - Hl1 * (t44 * t15) + Hl2 * (t47 * t15);
    mat[3] = Hl3 * t48 + Hl4 * (t18 * t15) - Hl5 * (t23 * t15);
    mat[4] = Hl3 * t49 + Hl4 * (t31 * t15) - Hl5 * (t35 * t15);
    mat[5] = -Hl3 * t50 - Hl4 * (t44 * t15) + Hl5 * (t47 * t15);
    mat[6] = Hl6 * t48 + Hl7 * (t18 * t15) - t23 * t15;
    mat[7] = Hl6 * t49 + Hl7 * (t31 * t15) - t35 * t15;
    mat[8] = -Hl6 * t50 - Hl7 * (t44 * t15) + t47 * t15;
  }
}
// TODO: need a way to import Tensor only as interface
export function calcIntegralSum(img: Tensor, x: number, y: number, w: number, h: number) {
  const yb = (y - 1) * img.stride[0];
  const yhb = (y + h) * img.stride[0];
  const xb = (x - 1) * 4;
  const xwb = (x + w) * 4;

  const a = img.data[yhb + xwb];
  const b = y > 0 ? img.data[yb + xwb] : 0;
  const c = x > 0 ? img.data[yhb + xb] : 0;
  const d = (y > 0 && x > 0) ? img.data[yb + xb] : 0;

  return (a - b - c) + d;
}
// TODO: need a way to import Tensor only as interface
export function calcHAARFeature(img: Tensor, feature: number[][], size: number, dx: number, dy: number, dStep: number) {
  let sum = 0;
  const sizeK = size / dStep;

  for (let i = 0; i < feature.length; i += 1) {
    sum += calcIntegralSum(img,
      ~~(feature[i][0] * sizeK) + dx,
      ~~(feature[i][1] * sizeK) + dy,
      ~~(feature[i][2] * sizeK) - 1,
      ~~(feature[i][3] * sizeK) - 1,
    ) * feature[i][4];
  }

  return sum;
}
