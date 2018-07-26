import { assert } from 'chai';
import * as gm from '../../lib';
import lenaGrayscaledTest from '../assets/lena_grayscaled.png';
import lenaGrayscaledTestOut from '../assets/adaptive_treshold_lena_test.png';

describe('Adaptive Threshold', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('binarize grayscale image', async () => {
    const input = await gm.imageTensorFromURL(lenaGrayscaledTest);
    const op = gm.adaptiveThreshold(input, 11, 0);
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(lenaGrayscaledTestOut);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.1,
    ));
  });

  it('syntetic binarication', async () => {
    const input = gm.tensorFromFlat([
      1, 2, 3, 4,
      5, 6, 7, 8,
      8, 7, 6, 5,
      4, 3, 2, 1,
    ], [4, 4, 4], 'float32', 1);

    const target = gm.tensorFromFlat([
      0, 0, 0, 0,
      1, 1, 1, 1,
      1, 1, 1, 1,
      0, 0, 0, 0,
    ], [4, 4, 4], 'float32', 1);

    const op = gm.adaptiveThreshold(input, 3, 0);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      target,
    ));
  });
});
