import { assert } from 'chai';
import * as gm from '../../lib';
import upsampleTestImage from '../assets/upsample_test.png';
import upsampleTestNearestImage from '../assets/upsample_test_nearest.png';
import upsampleTestLinearImage from '../assets/upsample_test_linear.png';

describe('Upsample', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('by nearest neighbor', async () => {
    const input = await gm.imageTensorFromURL(upsampleTestImage);
    const op = gm.upsample(input, 22.3);
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(upsampleTestNearestImage);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      target,
    ));
  });

  it('by linear', async () => {
    const input = await gm.imageTensorFromURL(upsampleTestImage, 'uint8');
    const op = gm.upsample(input, 22.3, 'linear');
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(upsampleTestLinearImage, 'uint8');

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.1,
    ));
  });
});
