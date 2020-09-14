import { assert } from 'chai';
import * as gm from '../../lib';
import linearize from '../../lib/ops/linearize_pixels';

describe('Linearize', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('linearize', async () => {
    const arr = new Array(6 * 4).fill(0).map((el, key) => key + 1);
    const A = gm.tensorFromFlat([...arr], [6, 4, 4], 'uint8');

    const B = new Uint8Array([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
      17, 18, 19, 20,
      21, 22, 23, 24,
    ]);

    const op = linearize(A);

    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.deepEqual(
      [...out.data],
      [...B],
    );
  });
});
