import { assert } from 'chai';
import { visualize } from '../test_utils';
import * as gm from '../../lib';
import testImageSrc from '../assets/morphology_src.png';
import testImageEroded from '../assets/morphology_eroded.png';
import testImageErodedCustomKernel from '../assets/morphology_eroded_custom_kernel.png';

describe('Erosion', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('erode', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const eroded = await gm.imageTensorFromURL(testImageEroded);
    const op = gm.erode(src, [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(eroded);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      eroded,
      0.1,
    ));
  });

  it('erode custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const eroded = await gm.imageTensorFromURL(testImageErodedCustomKernel);

    const kernel = gm.tensorFromFlat([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ], [5, 5, 4], 'float32');

    const op = gm.erode(src, [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(eroded);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      eroded,
      0.1,
    ));
  });
});
