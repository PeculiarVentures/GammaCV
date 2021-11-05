/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Rect from './rect';
import Line from './line';

export default class TypedPool<T extends typeof Line | typeof Rect> {
  public readonly size: number;

  private data: T['prototype'][];
  private length: number;
  private dataStore: ArrayBuffer;

  constructor(Type: T, poolSize: number) {
    this.dataStore = new ArrayBuffer(poolSize * Type.BYTES_PER_ELEMENT);
    this.data = new Array(poolSize);
    this.size = poolSize;

    for (let i = 0; i < poolSize; i += 1) {
      this.data[i] = new Type(this.dataStore, i * Type.BYTES_PER_ELEMENT);
    }

    this.length = 0;
  }

  public map(cb: (el: T['prototype'], index: number) => T['prototype'], ctx?: any) {
    return this.data.map(cb, ctx);
  }

  public push(type: T['prototype']) {
    if (this.length < this.size) {
      this.data[this.length].data.set(type.data);
      this.length += 1;
    } else {
      throw new Error('Typed Pool size exceed');
    }
  }

  public at(i: number) {
    if (i >= this.size) {
      throw new Error('Out of range requested');
    }

    return this.data[i];
  }

  public release(clear?: boolean) {
    this.length = 0;

    if (clear) {
      for (let i = 0; i < this.size; i += 1) {
        this.data[i].clear();
      }
    }
  }
}
