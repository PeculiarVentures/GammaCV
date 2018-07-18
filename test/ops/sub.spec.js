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
    const A = new gm.Tensor('float32', [3, 3, 4]);
    const B = new gm.Tensor('float32', [3, 3, 4]);
    const C = new gm.Tensor('float32', [3, 3, 4]);
    const matrixA = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const matrixB = [
      [0, 0, 2],
      [0, 0, 2],
      [0, 0, 2],
    ];
    const matrixC = [
      [1, 1, -1],
      [1, 1, -1],
      [1, 1, -1],
    ];

    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        A.set(x, y, 0, matrixA[x][y]);
        A.set(x, y, 1, matrixA[x][y]);
        A.set(x, y, 2, matrixA[x][y]);
        A.set(x, y, 3, 1.0);

        B.set(x, y, 0, matrixB[x][y]);
        B.set(x, y, 1, matrixB[x][y]);
        B.set(x, y, 2, matrixB[x][y]);
        B.set(x, y, 3, 1.0);

        C.set(x, y, 0, matrixC[x][y]);
        C.set(x, y, 1, matrixC[x][y]);
        C.set(x, y, 2, matrixC[x][y]);
        C.set(x, y, 3, 1.0);
      }
    }

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
