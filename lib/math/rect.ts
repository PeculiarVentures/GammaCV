/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import { sortPoints, angleBetweenLines, transformPoint } from './utils';
import Line from './line';
import type Tensor from '../program/tensor';

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

  static NUM_ELEMENTS: number;
  static BYTES_PER_ELEMENT: number;

  public data: Float32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray

  /**
   * @param {ArrayBuffer|Array|number} [a] - Source buffer to link, array to create from, or x value
   * @param {number} [b] - buffer's offset or y value
   */
  constructor()
  constructor(a: number[])
  constructor(...a: number[])
  constructor(a: ArrayBuffer, b?: number)
  constructor(a?: ArrayBuffer | number[] | number, b?: number, ...other: number[]) {
    if (a instanceof ArrayBuffer) {
      this.data = new Float32Array(a, b, Rect.NUM_ELEMENTS);
    } else if (Array.isArray(a)) {
      this.data = new Float32Array(a);
    } else if (a && arguments.length === Rect.NUM_ELEMENTS) {
      this.data = new Float32Array([a, b, ...other]);
    } else {
      this.data = new Float32Array(Rect.NUM_ELEMENTS);
    }
  }

  /**
   * Define if point with given coordinates is inside rectangle.
   * @param {number} x
   * @param {number} y
   * @returns {boolean} Is inside rect
   */
  public isInRect(x: number, y: number) {
    const s1 = Rect.TriangleS(x, y, this.ax, this.ay, this.bx, this.by);
    const s2 = Rect.TriangleS(x, y, this.cx, this.cy, this.bx, this.by);
    const s3 = Rect.TriangleS(this.cx, this.cy, x, y, this.dx, this.dy);
    const s4 = Rect.TriangleS(this.dx, this.dy, x, y, this.ax, this.ay);

    if ((s1 + s2 + s3 + s4) - this.area > 0) {
      return false;
    }

    return true;
  }

  public isNotEmpty() {
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

  public clone() {
    return new Rect(this.toArray());
  }

  public set(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) {
    this.data[0] = ax;
    this.data[1] = ay;
    this.data[2] = bx;
    this.data[3] = by;
    this.data[4] = cx;
    this.data[5] = cy;
    this.data[6] = dx;
    this.data[7] = dy;
  }

  public assign(rect: Rect) {
    this.data.set(rect.data);

    return this;
  }

  public scale(x: number, y: number) {
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

  public fromLines(l1: Line, l2: Line, l3: Line, l4: Line) {
    const p1 = Line.Intersection(l1, l2);
    const p2 = Line.Intersection(l2, l3);
    const p3 = Line.Intersection(l3, l4);
    const p4 = Line.Intersection(l4, l1);

    if (!p1 || !p2 || !p3 || !p4) {
      return false;
    }
    
    const sorted = sortPoints([
      p1, p2, p3, p4,
    ]);

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

  public get ax() {
    return this.data[0];
  }

  public get ay() {
    return this.data[1];
  }

  public get bx() {
    return this.data[2];
  }

  public get by() {
    return this.data[3];
  }

  public get cx() {
    return this.data[4];
  }

  public get cy() {
    return this.data[5];
  }

  public get dx() {
    return this.data[6];
  }

  public get dy() {
    return this.data[7];
  }

  public set ax(v) {
    this.data[0] = v;
  }

  public set ay(v) {
    this.data[1] = v;
  }

  public set bx(v) {
    this.data[2] = v;
  }

  public set by(v) {
    this.data[3] = v;
  }

  public set cx(v) {
    this.data[4] = v;
  }

  public set cy(v) {
    this.data[5] = v;
  }

  public set dx(v) {
    this.data[6] = v;
  }

  public set dy(v) {
    this.data[7] = v;
  }

  public get distA() {
    return Math.sqrt((this.data[6] - this.data[0]) ** 2 + (this.data[7] - this.data[1]) ** 2);
  }

  public get distB() {
    return Math.sqrt((this.data[4] - this.data[2]) ** 2 + (this.data[5] - this.data[3]) ** 2);
  }

  public get distC() {
    return Math.sqrt((this.data[0] - this.data[2]) ** 2 + (this.data[1] - this.data[3]) ** 2);
  }

  public get distD() {
    return Math.sqrt((this.data[6] - this.data[4]) ** 2 + (this.data[7] - this.data[5]) ** 2);
  }

  public get distE() {
    return Math.sqrt((this.data[0] - this.data[4]) ** 2 + (this.data[1] - this.data[5]) ** 2);
  }

  public get distF() {
    return Math.sqrt((this.data[6] - this.data[2]) ** 2 + (this.data[7] - this.data[3]) ** 2);
  }

  public get angleA() {
    return angleBetweenLines(
      [this.data[6], this.data[7], this.data[0], this.data[1]],
      [this.data[0], this.data[1], this.data[2], this.data[3]],
    );
  }

  public get angleB() {
    return angleBetweenLines(
      [this.data[0], this.data[1], this.data[2], this.data[3]],
      [this.data[2], this.data[3], this.data[4], this.data[5]],
    );
  }

  public get angleC() {
    return angleBetweenLines(
      [this.data[2], this.data[3], this.data[4], this.data[5]],
      [this.data[4], this.data[5], this.data[6], this.data[7]],
    );
  }

  public get angleD() {
    return angleBetweenLines(
      [this.data[4], this.data[5], this.data[6], this.data[7]],
      [this.data[6], this.data[7], this.data[0], this.data[1]],
    );
  }

  public get area() {
    const A = this.distA;
    const B = this.distB;
    const C = this.distC;
    const D = this.distD;
    const p = (A + B + C + D) / 2;

    return Math.sqrt((p - A) * (p - B) * (p - C) * (p - D));
  }

  public get P() {
    return this.distA + this.distB + this.distC + this.distD;
  }

  public mul(num: number) {
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

  public scaleAt(num: number) {
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

  public clear() {
    this.data[0] = 0;
    this.data[1] = 0;
    this.data[2] = 0;
    this.data[3] = 0;
    this.data[4] = 0;
    this.data[5] = 0;
    this.data[6] = 0;
    this.data[7] = 0;
  }

  public fromDeep(arr: number[][]) {
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

  public perspective(matrix: Tensor) {
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

  public fromArray(arr: number[]) {
    this.data.set(arr);

    return this;
  }

  public toArray() {
    return Array.prototype.slice.call(this.data);
  }

  public isInside(rect: Rect) {
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

  public toJSON() {
    return this.toArray();
  }
}

Rect.NUM_ELEMENTS = 8;
Rect.BYTES_PER_ELEMENT = Rect.NUM_ELEMENTS * Float32Array.BYTES_PER_ELEMENT;
