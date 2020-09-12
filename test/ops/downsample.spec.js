import { assert } from 'chai';
import * as gm from '../../lib';
import downsampleTestImage from '../assets/white_black.png';
import downsampleTestNearestImage from '../assets/upsample_result.png';

describe('Downsample', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('by nearest', async () => {
    const input = await gm.imageTensorFromURL(downsampleTestNearestImage);
    const op = gm.downsample(input, 22, 'nearest');
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(downsampleTestImage);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      target,
    ));
  });

  it('by bicubic', async () => {
    const input = await gm.imageTensorFromURL(downsampleTestImage, 'uint8');
    const op = gm.downsample(input, 4, 'bicubic');
    const out = gm.tensorFrom(op);
    const target = new gm.Tensor(
      'uint8',
      [2, 2, 4],
      new Uint8Array([
        0, 0, 0, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 0, 0, 0, 255,
      ]),
    );

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.1,
    ));
  });
});
