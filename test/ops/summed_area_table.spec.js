import { assert } from 'chai';
import * as gm from '../../lib';
import sampleImage from '../assets/white_black.png';

describe('Summed Area Table', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('summedAreaTable simple', async () => {
    const A = gm.tensorFromFlat([
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
    ], [3, 3, 4], 'float32');

    const op = gm.summedAreaTable(A);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      gm.tensorFromFlat([
        1, 2, 3,
        2, 4, 6,
        3, 6, 9,
      ], [3, 3, 4], 'float32'),
    ));
  });


  it('summedAreaTable 1D', async () => {
    const A = gm.tensorFromFlat([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ], [1, 9, 4], 'float32', 255);

    const op = gm.summedAreaTable(A, 40);
    const out = gm.tensorFrom(op);
    const target = gm.tensorFromFlat([
      1, 3, 6, 10, 15, 21, 28, 36, 45,
    ], [1, 9, 4], 'float32', 255);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    for (let i = 3; i < out.size; i += 4) {
      out.data[i] = 255;
    }

    assert.isTrue(gm.tensorAssertEqual(
      out,
      target,
    ));
  });

  it('summedAreaTable on image', async () => {
    const A = await gm.imageTensorFromURL(sampleImage, 'float32');

    const op = gm.summedAreaTable(A, 2);
    const out = gm.tensorFrom(op);
    const target = gm.tensorFromFlat([
      0, 0, 0, 255, 510, 765, 765, 765, 765,
      0, 0, 0, 510, 1020, 1530, 1530, 1530, 1530,
      0, 0, 0, 765, 1530, 2295, 2295, 2295, 2295,
      255, 510, 765, 1530, 2295, 3060, 3315, 3570, 3825,
      510, 1020, 1530, 2295, 3060, 3825, 4335, 4845, 5355,
      765, 1530, 2295, 3060, 3825, 4590, 5355, 6120, 6885,
      765, 1530, 2295, 3315, 4335, 5355, 6120, 6885, 7650,
      765, 1530, 2295, 3570, 4845, 6120, 6885, 7650, 8415,
      765, 1530, 2295, 3825, 5355, 6885, 7650, 8415, 9180,
    ], [9, 9, 4], 'float32', 255);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    for (let i = 3; i < out.size; i += 4) {
      out.data[i] = 255;
    }

    assert.isTrue(gm.tensorAssertEqual(
      out,
      target,
    ));
  });
});
