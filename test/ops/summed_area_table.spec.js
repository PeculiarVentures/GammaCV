import { assert } from 'chai';
import * as gm from '../../lib';
import sampleImage from '../assets/white_black.png';
import lenaImg from '../assets/lena.png';

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

    const op = gm.sat(A);
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

    const op = gm.sat(A, 40);
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

    const op = gm.sat(A, 2);
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

  it('squared summedAreaTable simple', async () => {
    const A = gm.tensorFromFlat([
      2, 2, 2,
      2, 2, 2,
      2, 2, 2,
    ], [3, 3, 4], 'float32');

    const op = gm.sqsat(A, 1);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      gm.tensorFromFlat([
        4, 8, 12,
        8, 16, 24,
        12, 24, 36,
      ], [3, 3, 4], 'float32'),
    ));
  });

  it('squared summedAreaTable on image', async () => {
    const A = await gm.imageTensorFromURL(sampleImage, 'float32');

    const op = gm.sqsat(A, 2);
    const out = gm.tensorFrom(op);
    const target = gm.tensorFromFlat([
      0, 0, 0, 65025, 130050, 195075, 195075, 195075, 195075,
      0, 0, 0, 130050, 260100, 390150, 390150, 390150, 390150,
      0, 0, 0, 195075, 390150, 585225, 585225, 585225, 585225,
      65025, 130050, 195075, 390150, 585225, 780300, 845325, 910350, 975375,
      130050, 260100, 390150, 585225, 780300, 975375, 1105425, 1235475, 1365525,
      195075, 390150, 585225, 780300, 975375, 1170450, 1365525, 1560600, 1755675,
      195075, 390150, 585225, 845325, 1105425, 1365525, 1560600, 1755675, 1950750,
      195075, 390150, 585225, 910350, 1235475, 1560600, 1755675, 1950750, 2145825,
      195075, 390150, 585225, 975375, 1365525, 1755675, 1950750, 2145825, 2340900,
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

  it('large summedAreaTable on image', async () => {
    const A = new gm.Tensor('float32', [720, 720, 4], new Float32Array(720 ** 2 * 4).fill(255));

    const op = gm.sat(A, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.equal(out.get(719, 719, 0), 255 * 720 ** 2);
  });

  it('large squared summedAreaTable on image', async () => {
    const size = 1000;
    const area = size * size;
    const A = new gm.Tensor('float32', [size, size, 4], new Float32Array(area * 4).fill(255));

    const op = gm.sqsat(A, undefined);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    const result = out.get(size - 1, size - 1, 0);
    const expected = 255 ** 2 * area;

    assert.isBelow(Math.abs(result - expected) / expected, 0.001);
  });

  it('squared summed area image test', async () => {
    const A = await gm.imageTensorFromURL(lenaImg, 'float32');
    const op = gm.sqsat(A, undefined);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    function singleTest(_x = 0, _y = 0, w = 20, h = 20) {
      const integralSum = gm.calcIntegralSum(out, _x, _y, w, h);
      let sum = 0;

      for (let y = _y; y < _y + h + 1; y += 1) {
        for (let x = _x; x < _x + w + 1; x += 1) {
          sum += A.get(y, x, 0) ** 2;
        }
      }

      assert.isBelow(Math.abs(integralSum - sum) / sum, 0.0001);
    }

    for (let i = 0; i < 100; i += 1) {
      const sx = ~~(Math.random() * A.shape[1]);
      const sy = ~~(Math.random() * A.shape[0]);
      const x = ~~(Math.random() * (A.shape[1] - sx));
      const y = ~~(Math.random() * (A.shape[0] - sy));

      singleTest(x, y, sx, sy);
    }
  });
});
