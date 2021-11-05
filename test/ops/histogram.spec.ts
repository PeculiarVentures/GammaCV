import * as gm from '../../lib';

describe('Extract histogram', () => {
  let sess: gm.Session;
  const setup = (input: InputType, layers?: number, min?: number, max?: number, step?: number) => {
    const op = gm.histogram(input, layers, min, max, step);
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

  it('For single pixel', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([0, 1, 255, 255]));
    const test = setup(input, 1, 0, 1, 1 / 255);

    sess.runOp(test.op, 0, test.output);

    const output = new gm.Tensor('float32', [1, 256, 4]);

    output.set(0, 0, 0, 1);
    output.set(0, 1, 1, 1);
    output.set(0, 255, 2, 1);
    output.set(0, 255, 3, 1);

    gm.tensorAssertCloseEqual(test.output, output, 0);
  });

  it('For custom range', () => {
    const input = new gm.Tensor('float32', [2, 2, 4], new Float32Array([
      0, 1, 2, 3,
      4, 5, 6, 0,
      7, 2, 13, 0,
      13, 5, 2, 3,
    ]));
    const test = setup(input, 1, 4, 10, 1);

    sess.runOp(test.op, 0, test.output);

    const output = new gm.Tensor('float32', [1, 7, 4], new Float32Array([
      1, 0, 0, 0,
      0, 2, 0, 0,
      0, 0, 1, 0,
      1, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]));

    gm.tensorAssertCloseEqual(test.output, output, 0);
  });

  describe('For Image', () => {
    const input = new gm.Tensor('uint8', [10, 10, 4]);
    const output = new gm.Tensor('float32', [1, 256, 4]);

    for (let i = 0; i < 100; i += 1) {
      input.data[i * 4] = i;
      input.data[i * 4 + 1] = 100 - i;
      input.data[i * 4 + 2] = i * 2;
      input.data[i * 4 + 1] = i * 2 + 1;

      output.data[i * 4] += 1;
      output.data[(100 - i) * 4 + 1] += 1;
      output.data[i * 2 * 4 + 2] += 1;
      output.data[(i * 2 + 1) * 4 + 3] += 1;
    }

    it('For image single layer', () => {
      const test = setup(input, 1, 0, 1, 1 / 255);

      sess.runOp(test.op, 0, test.output);

      gm.tensorAssertCloseEqual(test.output, output, 0);
    });

    it('For image 2 layers', () => {
      const test = setup(input, 2, 0, 1, 1 / 255);

      sess.runOp(test.op, 0, test.output);

      gm.tensorAssertCloseEqual(test.output, output, 0);
    });

    it('For image 3 layers', () => {
      const test = setup(input, 3, 0, 1, 1 / 255);

      sess.runOp(test.op, 0, test.output);

      gm.tensorAssertCloseEqual(test.output, output, 0);
    });
  });
});
