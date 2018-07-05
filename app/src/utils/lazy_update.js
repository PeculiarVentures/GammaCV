class LazyUpdate {
  constructor(delay, callback) {
    this.delay = delay;
    this.callback = callback;
  }

  cancel() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  activate(...args) {
    this.cancel();

    this.timeout = setTimeout(() => {
      if (this.callback) this.callback(...args);
    }, this.delay);
  }
}

export default LazyUpdate;
