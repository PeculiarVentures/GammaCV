import { assert } from 'chai';
import * as gm from '../../lib';

describe('Upsample', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('Simple near upsample in 2 times', async () => {
    const input = gm.tensorFromFlat([20, 30, 50, 60], [2, 2, 4], 'uint8');
    const op = gm.upsample(input, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      gm.tensorFromFlat([
        20, 20, 30, 30,
        20, 20, 30, 30,
        50, 50, 60, 60,
        50, 50, 60, 60,
      ], [4, 4, 4], 'uint8'),
    ));
  });

  it('Simple mean upsample in 2 times', async () => {
    const input = gm.tensorFromFlat([20, 30, 50, 60], [2, 2, 4], 'uint8');
    const op = gm.upsample(input, 2, 'mean');
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      gm.tensorFromFlat([
        20, 25, 30, 30,
        35, 40, 45, 45,
        50, 55, 60, 60,
        50, 55, 60, 60,
      ], [4, 4, 4], 'uint8'),
    ));
  });

  it('upsample near in 2.75 times', async () => {
    const input = gm.tensorFromFlat([20, 30, 50, 60], [2, 2, 4], 'uint8');
    const op = gm.upsample(input, 1.75);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      gm.tensorFromFlat([
        20, 20, 30,
        20, 20, 30,
        50, 50, 60,
      ], [3, 3, 4], 'uint8'),
    ));
  });

  it('upsample mean in 2.75 times', async () => {
    const input = gm.tensorFromFlat([20, 30, 50, 60], [2, 2, 4], 'uint8');
    const op = gm.upsample(input, 1.75, 'mean');
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      gm.tensorFromFlat([
        20, 25, 30,
        35, 40, 45,
        50, 55, 60,
      ], [3, 3, 4], 'uint8'),
    ));
  });
});
