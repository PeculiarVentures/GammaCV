import Tensor from '../program/tensor';

/* eslint-disable*/
export default class Detector {
  constructor(w, h, params, debugCanvas = false) {
    this.w = w;
    this.h = h;
    this.input = null;
    this.debugCanvas = debugCanvas;
    this.input = new Tensor('uint8', [h, w, 4]);

    this.setup(params);
  }

  setup() {
    console.warn('Setup is not specified');
  }

  detect(input) {
  }

  estimate() {
    console.warn('Esimator is not specified');
  }
}
