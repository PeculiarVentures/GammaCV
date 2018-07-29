import { assert } from 'chai';
import testImage100 from './assets/haar_test_100.png';
import testImage200 from './assets/haar_test_200.png';
import testImage300 from './assets/haar_test_300.png';

import * as gm from '../lib';

describe.only('HAAR Features', () => {
  let sess;
  const feature1 = [
    [0, 0, 10, 20, +1],
    [10, 0, 10, 20, -1],
  ];

  const feature2 = [
    [0, 0, 20, 10, +1],
    [0, 10, 20, 10, -1],
  ];

  const feature3 = [
    [0, 0, 10, 10, +1],
    [10, 0, 10, 10, -1],
    [10, 10, 10, 10, +1],
    [0, 10, 10, 10, -1],
  ];

  const feature4 = [
    [0, 0, 10, 10, -1],
    [10, 0, 10, 10, +1],
    [10, 10, 10, 10, -1],
    [0, 10, 10, 10, +1],
  ];

  beforeEach(() => {
    sess = new gm.Session();
  });

  afterEach(() => {
    if (sess) {
      sess.destroy();
      sess = null;
    }
  });

  it('test100', async () => {
    const input = await gm.imageTensorFromURL(testImage100);
    const op = gm.summedAreaTable(gm.grayscale(input));
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    const f1 = gm.calcHAARFeature(out, feature1, 20, 15, 15, 20); // this value should be close to 0
    const f2 = gm.calcHAARFeature(out, feature2, 20, 15, 65, 20); // this value should be close to 0
    const f3 = gm.calcHAARFeature(out, feature3, 20, 65, 15, 20); // this value should be close to 0
    const f4 = gm.calcHAARFeature(out, feature4, 20, 65, 65, 20); // this value should be close to 0

    console.log(f1, f2, f3, f4);
  });

  it('test200', async () => {
    const input = await gm.imageTensorFromURL(testImage200);
    const op = gm.summedAreaTable(gm.grayscale(input));
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    const f1 = gm.calcHAARFeature(out, feature1, 40, 30, 30, 20); // this value should be close to 0
    const f2 = gm.calcHAARFeature(out, feature2, 40, 30, 130, 20); // this value should be close to 0
    const f3 = gm.calcHAARFeature(out, feature3, 40, 130, 30, 20); // this value should be close to 0
    const f4 = gm.calcHAARFeature(out, feature4, 40, 130, 130, 20); // this value should be close to 0

    console.log(f1, f2, f3, f4);
  });

  it('test300', async () => {
    const input = await gm.imageTensorFromURL(testImage300);
    const op = gm.summedAreaTable(gm.grayscale(input));
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    const f1 = gm.calcHAARFeature(out, feature1, 60, 45, 45, 20); // this value should be close to 0
    const f2 = gm.calcHAARFeature(out, feature2, 60, 45, 195, 20); // this value should be close to 0
    const f3 = gm.calcHAARFeature(out, feature3, 60, 195, 45, 20); // this value should be close to 0
    const f4 = gm.calcHAARFeature(out, feature4, 60, 195, 195, 20); // this value should be close to 0

    console.log(f1, f2, f3, f4);
  });
});
