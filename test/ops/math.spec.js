import { assert } from 'chai';
import * as gm from '../../lib';

describe('Math', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('A mult B', async () => {
    const A = gm.tensorFromFlat([
      2, 2,
      2, 2,
    ], [2, 2, 4], 'float32');
    const B = gm.tensorFromFlat([
      4, 4,
      4, 4,
    ], [2, 2, 4], 'float32');
    const C = gm.tensorFromFlat([
      8, 8,
      8, 8,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.mult(A, B);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('A div B', async () => {
    const A = gm.tensorFromFlat([
      8, 8,
      8, 8,
    ], [2, 2, 4], 'float32');
    const B = gm.tensorFromFlat([
      2, 2,
      2, 2,
    ], [2, 2, 4], 'float32');
    const C = gm.tensorFromFlat([
      4, 4,
      4, 4,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.div(A, B);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('A add B', async () => {
    const A = gm.tensorFromFlat([
      8, 8,
      8, 8,
    ], [2, 2, 4], 'float32');
    const B = gm.tensorFromFlat([
      2, 2,
      2, 2,
    ], [2, 2, 4], 'float32');
    const C = gm.tensorFromFlat([
      10, 10,
      10, 10,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.add(A, B);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('A sub B', async () => {
    const A = gm.tensorFromFlat([
      8, 8,
      8, 8,
    ], [2, 2, 4], 'float32');
    const B = gm.tensorFromFlat([
      2, 2,
      2, 2,
    ], [2, 2, 4], 'float32');
    const C = gm.tensorFromFlat([
      6, 6,
      6, 6,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.sub(A, B);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('mult scalar', async () => {
    const A = gm.tensorFromFlat([
      4, 4,
      4, 4,
    ], [2, 2, 4], 'float32');

    const C = gm.tensorFromFlat([
      6, 6,
      6, 6,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.multScalar(A, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('div scalar', async () => {
    const A = gm.tensorFromFlat([
      4, 4,
      4, 4,
    ], [2, 2, 4], 'float32');

    const C = gm.tensorFromFlat([
      2, 2,
      2, 2,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.divScalar(A, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('add scalar', async () => {
    const A = gm.tensorFromFlat([
      4, 4,
      4, 4,
    ], [2, 2, 4], 'float32');

    const C = gm.tensorFromFlat([
      8, 8,
      8, 8,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.addScalar(A, 4);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });

  it('sub scalar', async () => {
    const A = gm.tensorFromFlat([
      5, 5,
      5, 5,
    ], [2, 2, 4], 'float32');

    const C = gm.tensorFromFlat([
      1, 1,
      1, 1,
    ], [2, 2, 4], 'float32', 1);

    const op = gm.subScalar(A, 4);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      C,
    ));
  });
});
