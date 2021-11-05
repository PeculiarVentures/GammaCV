import { assert } from 'chai';
import * as gm from '../../lib';
import { assets } from '../assets';

describe('Upsample', () => {
  let sess: gm.Session = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('by nearest', async () => {
    const input = await gm.imageTensorFromURL(assets.white_black);
    const op = gm.upsample(input, 22, 'nearest');
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(assets.upsample_result);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.01,
    ));
  });

  it('by bicubic', async () => {
    const input = await gm.imageTensorFromURL(assets.white_black, 'uint8');
    const op = gm.upsample(input, 22, 'bicubic');
    const out = gm.tensorFrom(op);
    const target = await gm.imageTensorFromURL(assets.upsample_result, 'uint8');

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      target,
      0.01,
    ));
  });
});
