import { assert } from 'chai';
import { visualize } from '../test_utils';
import { assets } from '../assets';
import * as gm from '../../lib';

describe('Grayscale', () => {
  let sess: gm.Session;
  const setup = (input: InputType) => {
    const op = gm.grayscale(input);
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

  it('Red weight', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([255, 0, 0, 255]));
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);

    assert.deepEqual(test.output.data, new Uint8Array([54, 54, 54, 255]));
  });

  it('Green weight', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([0, 255, 0, 255]));
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);

    assert.deepEqual(test.output.data, new Uint8Array([182, 182, 182, 255]));
  });

  it('Blue weight', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([0, 0, 255, 255]));
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);

    assert.deepEqual(test.output.data, new Uint8Array([18, 18, 18, 255]));
  });

  it('Drops alpha channel', async () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([255, 255, 255, 145]));
    const test = setup(input);

    sess.runOp(test.op, 0, test.output);

    assert.deepEqual(test.output.data, new Uint8Array([255, 255, 255, 255]));
  });

  it('Normal image', async () => {
    const input = await gm.imageTensorFromURL(assets.lena);
    const output = await gm.imageTensorFromURL(assets.lena_grayscaled);
    const test = setup(input);

    // console.log(JSON.stringify(Array.from(input.data)))

    sess.runOp(test.op, 0, test.output);
    visualize(input);
    visualize(test.output);

    gm.assert(gm.tensorAssertCloseEqual(test.output, output, 3), 'Tensors should be equal +- 3');
  });
});
