/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const eps = 0.0000001;

function between(a: number, b: number, c: number) {
  return a - eps <= b && b <= c + eps;
}

export default class Line {
  static Intersection(l1: Line, l2: Line) {
    const x1 = l1.x1;
    const y1 = l1.y1;
    const x2 = l1.x2;
    const y2 = l1.y2;
    const x3 = l2.x1;
    const y3 = l2.y1;
    const x4 = l2.x2;
    const y4 = l2.y2;

    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if (isNaN(x) || isNaN(y)) {
      return false;
    }

    if (x1 >= x2) {
      if (!between(x2, x, x1)) { return false; }
    } else if (!between(x1, x, x2)) { return false; }

    if (y1 >= y2) {
      if (!between(y2, y, y1)) { return false; }
    } else if (!between(y1, y, y2)) { return false; }

    if (x3 >= x4) {
      if (!between(x4, x, x3)) { return false; }
    } else if (!between(x3, x, x4)) { return false; }

    if (y3 >= y4) {
      if (!between(y4, y, y3)) { return false; }
    } else if (!between(y3, y, y4)) { return false; }

    return [x, y];
  }

  // TODO: maybe also must be getter
  public data: Float32Array;
  static BYTES_PER_ELEMENT: number;

  /**
   * @param {ArrayBuffer|Array|number} [a] - Source buffer to link, array to create from, or x value
   * @param {number} [b] - buffer's offset or y value
   */
  constructor()
  constructor(a?: number[])
  constructor(a?: ArrayBuffer)
  constructor(a?: number | number[] | ArrayBuffer, b?: number, c?: number, d?: number, x?: number, y?: number)
  constructor(a?: number | number[] | ArrayBuffer, b?: number, c?: number, d?: number, x?: number, y?: number) {
     if (a instanceof ArrayBuffer) {
      this.data = new Float32Array(a, b, 8);
    } else if (Array.isArray(a)) {
      if (a.length < 8) {
        for (let i = a.length; i <= 8; i += 1) {
          a.push(0);
        }
      }
      this.data = new Float32Array(a);
    } else if (a !== undefined && b !== undefined) {
      this.data = new Float32Array([a, b, c, d, x, y, 0, 0]);
    } else {
      this.data = new Float32Array(8);
    }
  }

  set(a: number, b: number, c: number, d: number, x: number, y: number) {
    this.data[0] = a;
    this.data[1] = b;
    this.data[2] = c;
    this.data[3] = d;
    this.data[4] = x;
    this.data[5] = y;
    this.data[6] = 0;
    this.data[7] = 0;
  }

  // TODO h is never used
  // @ts-ignore
  fromParallelCoords(x: number, y: number, w: number, h: number, maxDistance: number, maxAngles: number) {
    const x1 = 0;
    const x2 = w;
    let y1;
    let y2;

    if (x > maxAngles) {
      x -= maxAngles; // eslint-disable-line

      y1 = maxDistance - (maxAngles * y / x);
      y2 = (-1 + maxAngles / x) * w + y1;
    } else {
      x = maxAngles - x; // eslint-disable-line

      y1 = (maxAngles * y / x);
      y2 = (1 - maxAngles / x) * w + y1;
    }

    this.set(x1, y1, x2, y2, x, y);
  }

  get length() {
    if (this.data[6]) {
      return this.data[6];
    }

    const dx = this.data[2] - this.data[0];
    const dy = this.data[3] - this.data[1];
    const length = Math.sqrt(dx ** 2 + dy ** 2);

    this.data[6] = length;

    return length;
  }

  get angle() {
    if (this.data[7]) {
      return this.data[7];
    }
    const dx = this.data[2] - this.data[0];
    const dy = this.data[3] - this.data[1];
    let angle = (Math.atan(dy / dx)) / Math.PI * 180;

    if (angle < 0) {
      angle = 180 + angle;
    }

    this.data[7] = angle;

    return angle;
  }

  get x1() {
    return this.data[0];
  }

  get y1() {
    return this.data[1];
  }

  get x2() {
    return this.data[2];
  }

  get y2() {
    return this.data[3];
  }

  get px() {
    return this.data[4];
  }

  get py() {
    return this.data[5];
  }

  set x1(v) {
    this.data[0] = v;
  }

  set y1(v) {
    this.data[1] = v;
  }

  set x2(v) {
    this.data[2] = v;
  }

  set y2(v) {
    this.data[3] = v;
  }

  set px(v) {
    this.data[4] = v;
  }

  set py(v) {
    this.data[5] = v;
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

  // TODO: mismatch with types - in types it should return Rect
  fromArray(arr: number[]) {
    this.data.set(arr);
  }

  toArray() {
    return Array.prototype.slice.call(this.data);
  }
}

Line.BYTES_PER_ELEMENT = 36;
