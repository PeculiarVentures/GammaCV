import { assert } from 'chai';
import * as gm from '../../lib';

describe('Substraction', () => {
  let sess: gm.Session = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  afterEach(() => {
    if (sess) {
      sess.destroy();
      sess = null;
    }
  });

  it('sub', async () => {
    const A = gm.tensorFromFlat([
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
    ], [3, 3, 4], 'float32');
    const B = gm.tensorFromFlat([
      0, 0, 2,
      0, 0, 2,
      0, 0, 2,
    ], [3, 3, 4], 'float32');
    const C = gm.tensorFromFlat([
      1, 1, -1,
      1, 1, -1,
      1, 1, -1,
    ], [3, 3, 4], 'float32', 1);

    const op = gm.sub(A, B);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });
});
