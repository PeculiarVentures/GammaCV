import { assets } from '../assets';
import * as gm from '../../lib';

describe('Convolution', () => {
  let sess: gm.Session;
  const setup = (input: InputType, kernel: InputType, factor?: number, bias?: number) => {
    const op = gm.conv2d(input, kernel, factor, bias);
    const output = gm.tensorFrom(op);

    sess.init(op);

    return { op, output };
  };

  beforeEach(() => {
    sess = new gm.Session();
  });

  afterEach(() => {
    if (sess) {
      sess.destroy();
      sess = null;
    }
  });

  it('Identity kernel', async () => {
    const input = await gm.imageTensorFromURL(assets.lena);
    const identityKernel = gm.tensorFromFlat([
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ], [3, 3, 4], 'float32');
    const test = setup(input, identityKernel);

    sess.runOp(test.op, 0, test.output);

    gm.assert(gm.tensorAssertEqual(test.output, input), 'Input and output should be equal');
  });

  it('Identity kernel with factor and bias', async () => {
    const input = gm.tensorFromFlat([
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    ], [3, 3, 4], 'float32');
    const identityKernel = gm.tensorFromFlat([
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ], [3, 3, 4], 'float32');
    const predictedOutput = gm.tensorFromFlat([
      0.8, 1.3, 1.8,
      2.3, 2.8, 3.3,
      3.8, 4.3, 4.8,
    ], [3, 3, 4], 'float32', 1);
    const test = setup(input, identityKernel, 0.5, 0.3);

    sess.runOp(test.op, 0, test.output);

    gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
  });

  describe('buitin kernels', () => {
    it('gaussianBlur', () => {
      const input = gm.tensorFromFlat([
        10, 20, 30,
        40, 50, 60,
        70, 80, 90,
      ], [3, 3, 4], 'uint8');

      const test = setup(input, gm.kernels.gaussianBlur(3, 1));

      sess.runOp(test.op, 0, test.output);

      const predictedOutput = gm.tensorFromFlat([
        21, 28, 35,
        43, 50, 57,
        65, 72, 79,
      ], [3, 3, 4], 'uint8', 255);

      gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
    });
    it('Box Blur', () => {
      const input = gm.tensorFromFlat([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ], [3, 3, 4], 'float32');

      const test = setup(input, gm.kernels.boxBlur());

      sess.runOp(test.op, 0, test.output);

      const predictedOutput = gm.tensorFromFlat([
        2.333, 3, 3.666,
        4.333, 5, 5.666,
        6.333, 7, 7.666,
      ], [3, 3, 4], 'float32', 1);

      gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
    });

    it('Sharpen', () => {
      const input = gm.tensorFromFlat([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ], [3, 3, 4], 'float32');

      const test = setup(input, gm.kernels.sharpen(1));

      sess.runOp(test.op, 0, test.output);

      const predictedOutput = gm.tensorFromFlat([
        -3, -1, 1,
        3, 5, 7,
        9, 11, 13,
      ], [3, 3, 4], 'float32', 1);

      gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
    });

    it('Invert', () => {
      const input = gm.tensorFromFlat([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ], [3, 3, 4], 'uint8');

      const test = setup(input, gm.kernels.invert(), 1, 1);

      sess.runOp(test.op, 0, test.output);

      const predictedOutput = gm.tensorFromFlat([
        254, 253, 252,
        251, 250, 249,
        248, 247, 246,
      ], [3, 3, 4], 'uint8', 255);

      gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
    });

    it('Edge detection', () => {
      const input = gm.tensorFromFlat([
        10, 0, 30,
        15, 0, 30,
        17, 9, 249,
      ], [3, 3, 4], 'uint8');

      const test = setup(input, gm.kernels.edgeDetection());

      sess.runOp(test.op, 0, test.output);

      const predictedOutput = gm.tensorFromFlat([
        0, 0, 0,
        2, 212, 210,
        7, 217, 210,
      ], [3, 3, 4], 'uint8', 255);

      gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
    });

    it('Unsharp Masking', () => {
      const input = gm.tensorFromFlat([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ], [3, 3, 4], 'uint8');

      const test = setup(input, gm.kernels.unsharpMasking(3, 1, 1));

      sess.runOp(test.op, 0, test.output);

      const predictedOutput = gm.tensorFromFlat([
        0, 1, 2,
        4, 5, 6,
        8, 9, 10,
      ], [3, 3, 4], 'uint8', 255);

      gm.assert(gm.tensorAssertCloseEqual(test.output, predictedOutput, 0.003), 'Input and output should be close equal');
    });
  });
});
