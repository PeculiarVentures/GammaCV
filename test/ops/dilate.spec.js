import { assert } from 'chai';
import { visualize } from '../test_utils';
import * as gm from '../../lib';
import testImageSrc from '../assets/morphology_src.png';
import testImageDilated from '../assets/morphology_dilated.png';
import testImageDilatedCustomKernel from '../assets/morphology_dilated_custom_kernel.png';
import { arrayToTexture } from '../../lib/program/utils';

describe('Dilation', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('dilate', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const dilated = await gm.imageTensorFromURL(testImageDilated);

    const op = gm.dilate(src, [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(dilated);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      dilated,
      0.1,
    ));
  });

  it('dilate custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const dilated = await gm.imageTensorFromURL(testImageDilatedCustomKernel);

    const kernel = new gm.Tensor('float32', [5, 5, 4], new Float32Array(arrayToTexture([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ])));

    const op = gm.dilate(src, [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(dilated);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      dilated,
      0.1,
    ));
  });
});
