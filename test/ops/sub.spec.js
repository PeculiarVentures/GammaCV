import { assert } from 'chai';
import * as gm from '../../lib';

describe('Substraction', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('sub', async () => {
    const A = new gm.Tensor('float32', [3, 3, 4], new Float32Array(gm.arrayToTexture([
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
    ])));
    const B = new gm.Tensor('float32', [3, 3, 4], new Float32Array(gm.arrayToTexture([
      0, 0, 2,
      0, 0, 2,
      0, 0, 2,
    ])));
    const C = new gm.Tensor('float32', [3, 3, 4], new Float32Array(gm.arrayToTexture([
      1, 1, -1,
      1, 1, -1,
      1, 1, -1,
    ], 1)));

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
