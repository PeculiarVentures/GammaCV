/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

export default class TypedPool<T> {
  data: T[]
  length: number;
  size: number;
  dataStore: ArrayBuffer;

  constructor(Type: new () => T, poolSize: number) {
    // @ts-ignore
    this.dataStore = new ArrayBuffer(poolSize * Type.BYTES_PER_ELEMENT);
    this.data = new Array(poolSize);
    this.size = poolSize;

    for (let i = 0; i < poolSize; i += 1) {
      // @ts-ignore
      this.data[i] = new Type(this.dataStore, i * Type.BYTES_PER_ELEMENT);
    }

    this.length = 0;
  }

  map(cb: (el: T, index: number) => T , ctx: any) {
    return this.data.map(cb, ctx);
  }

  push(type: T) {
    if (this.length < this.size) {
      // @ts-ignore
      this.data[this.length].data.set(type.data);
      this.length += 1;
    } else {
      throw new Error('Typed Pool size exceed');
    }
  }

  at(i: number) {
    if (i >= this.size) {
      throw new Error('Out of range requested');
    }

    return this.data[i];
  }

  release(clear?: boolean) {
    this.length = 0;

    if (clear) {
      for (let i = 0; i < this.size; i += 1) {
        // @ts-ignore
        this.data[i].clear();
      }
    }
  }
}
