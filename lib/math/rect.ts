/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import { sortPoints, angleBetweenLines, transformPoint } from './utils';
import Line from './line';

/**
 * Rect data has the next view:
 * 0: A.x
 * 1: A.y
 * 2: B.x
 * 3: B.y
 * 4: C.x
 * 5: C.y
 * 6: D.x
 * 7: D.y
 *
 * Where:
 * A------B
 * |      |
 * D------C
 */
export default class Rect {
  static Distance(r1: Rect, r2: Rect) {
    let distance = 0;

    for (let i = 0; i < 8; i += 2) {
      const vecLength = Math.sqrt((r1.data[i] - r2.data[i]) ** 2
        + (r1.data[i + 1] - r2.data[i + 1]) ** 2);

      distance += vecLength ** 2;
    }

    distance = Math.sqrt(distance / 8);

    return distance === Infinity ? 0 : distance;
  }

  /**
   * Helper method to calculate triangle area from 3 points
   * @param {number} ax
   * @param {number} ay
   * @param {number} bx
   * @param {number} by
   * @param {number} cx
   * @param {number} cy
   * @returns {number} Area
   */
  static TriangleS(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
    return Math.abs(ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) / 2;
  }

  // TODO: hack
  static NUM_ELEMENTS: number;
  static BYTES_PER_ELEMENT: number;

  // TODO: should be and getter
  public data: Float32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray

  /**
   * @param {ArrayBuffer|Array|number} [a] - Source buffer to link, array to create from, or x value
   * @param {number} [b] - buffer's offset or y value
   */
  constructor(...args: number[]) {
    if (args[0] instanceof ArrayBuffer) {
      this.data = new Float32Array(args[0], args[1], Rect.NUM_ELEMENTS);
    } else if (Array.isArray(args[0])) {
      this.data = new Float32Array(args[0]);
    } else if (args[0] && args.length === Rect.NUM_ELEMENTS) {
      this.data = new Float32Array(args);
    } else {
      this.data = new Float32Array(Rect.NUM_ELEMENTS);
    }
  }

  /**
   * Define if point with given coordinates is inside rectangle.
   * @param {number} x
   * @param {number} y
   * @returns {boolean} Is insinde rect
   */
  isInRect(x: number, y: number) {
    const s1 = Rect.TriangleS(x, y, this.ax, this.ay, this.bx, this.by);
    const s2 = Rect.TriangleS(x, y, this.cx, this.cy, this.bx, this.by);
    const s3 = Rect.TriangleS(this.cx, this.cy, x, y, this.dx, this.dy);
    const s4 = Rect.TriangleS(this.dx, this.dy, x, y, this.ax, this.ay);

    if ((s1 + s2 + s3 + s4) - this.area > 0) {
      return false;
    }

    return true;
  }

  isNotEmpty() {
    if (
      this.data[0] > 0 &&
      this.data[1] > 0 &&
      this.data[2] > 0 &&
      this.data[3] > 0 &&
      this.data[4] > 0 &&
      this.data[5] > 0 &&
      this.data[6] > 0 &&
      this.data[7] > 0
    ) {
      return true;
    }

    return false;
  }

  clone() {
    return new Rect(this.toArray());
  }

  set(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) {
    this.data[0] = ax;
    this.data[1] = ay;
    this.data[2] = bx;
    this.data[3] = by;
    this.data[4] = cx;
    this.data[5] = cy;
    this.data[6] = dx;
    this.data[7] = dy;
  }

  assign(rect: Rect) {
    this.data.set(rect.data);

    return this;
  }

  scale(x: number, y: number) {
    this.data[0] *= x;
    this.data[1] *= y;
    this.data[2] *= x;
    this.data[3] *= y;
    this.data[4] *= x;
    this.data[5] *= y;
    this.data[6] *= x;
    this.data[7] *= y;

    return this;
  }

  fromLines(l1: Line, l2: Line, l3: Line, l4L: Line) {
    const sorted = sortPoints([
      Line.Intersection(l1, l2),
      Line.Intersection(l2, l3),
      Line.Intersection(l3, l4),
      Line.Intersection(l4, l1),
    ]);

    if (
      !sorted[0] ||
      !sorted[1] ||
      !sorted[2] ||
      !sorted[3]
    ) {
      return false;
    }

    this.data[0] = sorted[0][0];
    this.data[1] = sorted[0][1];
    this.data[2] = sorted[1][0];
    this.data[3] = sorted[1][1];
    this.data[4] = sorted[2][0];
    this.data[5] = sorted[2][1];
    this.data[6] = sorted[3][0];
    this.data[7] = sorted[3][1];

    return true;
  }

  get ax() {
    return this.data[0];
  }

  get ay() {
    return this.data[1];
  }

  get bx() {
    return this.data[2];
  }

  get by() {
    return this.data[3];
  }

  get cx() {
    return this.data[4];
  }

  get cy() {
    return this.data[5];
  }

  get dx() {
    return this.data[6];
  }

  get dy() {
    return this.data[7];
  }

  set ax(v) {
    this.data[0] = v;
  }

  set ay(v) {
    this.data[1] = v;
  }

  set bx(v) {
    this.data[2] = v;
  }

  set by(v) {
    this.data[3] = v;
  }

  set cx(v) {
    this.data[4] = v;
  }

  set cy(v) {
    this.data[5] = v;
  }

  set dx(v) {
    this.data[6] = v;
  }

  set dy(v) {
    this.data[7] = v;
  }

  get distA() {
    return Math.sqrt((this.data[6] - this.data[0]) ** 2 + (this.data[7] - this.data[1]) ** 2);
  }

  get distB() {
    return Math.sqrt((this.data[4] - this.data[2]) ** 2 + (this.data[5] - this.data[3]) ** 2);
  }

  get distC() {
    return Math.sqrt((this.data[0] - this.data[2]) ** 2 + (this.data[1] - this.data[3]) ** 2);
  }

  get distD() {
    return Math.sqrt((this.data[6] - this.data[4]) ** 2 + (this.data[7] - this.data[5]) ** 2);
  }

  get distE() {
    return Math.sqrt((this.data[0] - this.data[4]) ** 2 + (this.data[1] - this.data[5]) ** 2);
  }

  get distF() {
    return Math.sqrt((this.data[6] - this.data[2]) ** 2 + (this.data[7] - this.data[3]) ** 2);
  }

  get angleA() {
    return angleBetweenLines(
      [this.data[6], this.data[7], this.data[0], this.data[1]],
      [this.data[0], this.data[1], this.data[2], this.data[3]],
    );
  }

  get angleB() {
    return angleBetweenLines(
      [this.data[0], this.data[1], this.data[2], this.data[3]],
      [this.data[2], this.data[3], this.data[4], this.data[5]],
    );
  }

  get angleC() {
    return angleBetweenLines(
      [this.data[2], this.data[3], this.data[4], this.data[5]],
      [this.data[4], this.data[5], this.data[6], this.data[7]],
    );
  }

  get angleD() {
    return angleBetweenLines(
      [this.data[4], this.data[5], this.data[6], this.data[7]],
      [this.data[6], this.data[7], this.data[0], this.data[1]],
    );
  }

  get area() {
    const A = this.distA;
    const B = this.distB;
    const C = this.distC;
    const D = this.distD;
    const p = (A + B + C + D) / 2;

    return Math.sqrt((p - A) * (p - B) * (p - C) * (p - D));
  }

  get P() {
    return this.distA + this.distB + this.distC + this.distD;
  }

  mul(num: number) {
    this.data[0] *= num;
    this.data[1] *= num;
    this.data[2] *= num;
    this.data[3] *= num;
    this.data[4] *= num;
    this.data[5] *= num;
    this.data[6] *= num;
    this.data[7] *= num;

    return this;
  }

  scaleAt(num: number) {
    this.data[0] -= num;
    this.data[1] -= num;
    this.data[2] -= num;
    this.data[3] += num;
    this.data[4] += num;
    this.data[5] += num;
    this.data[6] += num;
    this.data[7] -= num;

    return this;
  }

  clear() {
    this.data[0] = 0;
    this.data[1] = 0;
    this.data[2] = 0;
    this.data[3] = 0;
    this.data[4] = 0;
    this.data[5] = 0;
    this.data[6] = 0;
    this.data[7] = 0;
  }

  fromDeep(arr: number[][]) {
    this.data[0] = arr[0][0];
    this.data[1] = arr[0][1];
    this.data[2] = arr[1][0];
    this.data[3] = arr[1][1];
    this.data[4] = arr[2][0];
    this.data[5] = arr[2][1];
    this.data[6] = arr[3][0];
    this.data[7] = arr[3][1];

    return this;
  }

  perspective(matrix: Tensor) {
    const p1 = transformPoint(this.data[0], this.data[1], matrix);
    const p2 = transformPoint(this.data[2], this.data[3], matrix);
    const p3 = transformPoint(this.data[4], this.data[5], matrix);
    const p4 = transformPoint(this.data[6], this.data[7], matrix);

    this.data[0] = p1[0];
    this.data[1] = p1[1];
    this.data[2] = p2[0];
    this.data[3] = p2[1];
    this.data[4] = p3[0];
    this.data[5] = p3[1];
    this.data[6] = p4[0];
    this.data[7] = p4[1];

    return this;
  }

  fromArray(arr: number[]) {
    this.data.set(arr);

    return this;
  }

  toArray() {
    return Array.prototype.slice.call(this.data);
  }

  isInside(rect: Rect) {
    return (
      rect.ax > this.ax
      && rect.ay > this.ay
      && rect.bx < this.bx
      && rect.by > this.by
      && rect.cx < this.cx
      && rect.cy < this.cy
      && rect.dx > this.dx
      && rect.dy < this.dy
    );
  }

  toJSON() {
    return this.toArray();
  }
}

Rect.NUM_ELEMENTS = 8;
Rect.BYTES_PER_ELEMENT = Rect.NUM_ELEMENTS * Float32Array.BYTES_PER_ELEMENT;
