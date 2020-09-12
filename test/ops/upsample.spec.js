import { assert } from 'chai';
import * as gm from '../../lib';
import upsampleTestImage from '../assets/white_black.png';
import upsampleTestResultImage from '../assets/upsample_result.png';

describe('Upsample', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('by nearest', async () => {
    const input = await gm.imageTensorFromURL(upsampleTestImage);
    const op = gm.upsample(input, 22, 'nearest');
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(upsampleTestResultImage);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.01,
    ));
  });

  it('by bicubic', async () => {
    const input = await gm.imageTensorFromURL(upsampleTestImage, 'uint8');
    const op = gm.upsample(input, 22, 'bicubic');
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(upsampleTestResultImage, 'uint8');

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.01,
    ));
  });
});
