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

    const kernel = new gm.Tensor('float32', [5, 5, 4]);
    const kernelMarix = [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1],
    ];

    for (let x = 0; x < 5; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        kernel.set(x, y, 0, kernelMarix[x][y]);
        kernel.set(x, y, 1, kernelMarix[x][y]);
        kernel.set(x, y, 2, kernelMarix[x][y]);
        kernel.set(x, y, 3, kernelMarix[x][y]);
      }
    }

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
