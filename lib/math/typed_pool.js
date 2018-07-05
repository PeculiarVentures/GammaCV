export default class TypedPool {
  constructor(Type, poolSize) {
    this.dataStore = new ArrayBuffer(poolSize * Type.BYTES_PER_ELEMENT);
    this.data = new Array(poolSize);
    this.size = poolSize;

    for (let i = 0; i < poolSize; i += 1) {
      this.data[i] = new Type(this.dataStore, i * Type.BYTES_PER_ELEMENT);
    }

    this.length = 0;
  }

  map(cb, ctx) {
    return this.data.map(cb, ctx);
  }

  push(type) {
    if (this.length < this.size) {
      this.data[this.length].data.set(type.data);
      this.length += 1;
    } else {
      throw new Error('Typed Pool size exceed');
    }
  }

  at(i) {
    if (i >= this.size) {
      throw new Error('Out of range requested');
    }

    return this.data[i];
  }

  release(clear) {
    this.length = 0;

    if (clear) {
      for (let i = 0; i < this.size; i += 1) {
        this.data[i].clear();
      }
    }
  }
}
