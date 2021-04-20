class LazyUpdate {
  constructor(delay: number, callback: Function) {
    this.delay = delay;
    this.callback = callback;
  }

  delay: number;

  callback: Function;

  timeout = null;

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
