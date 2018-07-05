import { assert } from 'chai';
import { visualize } from '../test_utils';
import testImage from '../assets/lena.png';
import * as gm from '../../lib';

/* eslint-disable no-loop-func */

describe('Cast', () => {
  let sess;
  const setup = (input, dType) => {
    const op = gm.cast(input, dType);
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

  it('One pixel', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([255, 0, 0, 255]));
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);

    assert.deepEqual(test.output.data, input.data);
  });

  it('Several pixels', () => {
    const input = new gm.Tensor('uint8', [2, 2, 4], new Uint8Array([
      255, 0, 0, 255, 0, 255, 0, 255,
      0, 0, 255, 255, 0, 0, 0, 255,
    ]));
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);

    assert.deepEqual(test.output.data, input.data);
  });

  for (let n = 1; n < 256; n += 254) {
    it(`Gradient ${n}`, () => {
      const input = new gm.Tensor('uint8', [n, n, 4]);

      for (let y = 0; y < input.shape[0]; y += 1) {
        for (let x = 0; x < input.shape[1]; x += 1) {
          input.set(y, x, 0, y);
          input.set(y, x, 1, x);
          input.set(y, x, 2, Math.max(x, y));
          input.set(y, x, 3, 255);
        }
      }

      const test = setup(input);

      sess.runOp(test.op, 0, test.output);

      assert.deepEqual(test.output.data, input.data);
    });
  }

  for (let n = 1; n < 3; n += 1) {
    it(`Gradient float ${n}`, () => {
      const input = new gm.Tensor('float32', [n, n, 4]);

      for (let y = 0; y < input.shape[0]; y += 1) {
        for (let x = 0; x < input.shape[1]; x += 1) {
          input.set(y, x, 0, y);
          input.set(y, x, 1, x);
          input.set(y, x, 2, x / Math.max(y, 2));
          input.set(y, x, 3, 255);
        }
      }

      const test = setup(input, 'float32');

      sess.runOp(test.op, 0, test.output);
      assert.isTrue(gm.tensorAssertCloseEqual(test.output, input, 1));
    });
  }

  it('Normal image', async () => {
    const input = await gm.imageTensorFromURL(testImage);
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);
    visualize(input);
    visualize(test.output);

    assert.deepEqual(test.output.data, input.data);
  });
});
