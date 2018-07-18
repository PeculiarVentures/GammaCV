import { assert } from 'chai';
import { visualize } from '../test_utils';
import * as gm from '../../lib';
import testImageSrc from '../assets/morphology_src.png';
import testImageOpen from '../assets/morphology_open.png';
import testImageOpenCustomKernel from '../assets/morphology_open_custom_kernel.png';
import testImageClose from '../assets/morphology_close.png';
import testImageCloseCustomKernel from '../assets/morphology_close_custom_kernel.png';
import testImageGradient from '../assets/morphology_gradient.png';
import testImageGradientCustomKernel from '../assets/morphology_gradient_custom_kernel.png';
import testImageTophat from '../assets/morphology_tophat.png';
import testImageTophatCustomKernel from '../assets/morphology_tophat_custom_kernel.png';
import testImageBlackhat from '../assets/morphology_blackhat.png';
import testImageBlackhatCustomKernel from '../assets/morphology_blackhat_custom_kernel.png';

describe('MorphTransform', () => {
  let sess = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('tophat', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageBlackhat);
    const op = gm.morphologyEx(src, 'blackhat', [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.1,
    ));
  });

  it('tophat custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageBlackhatCustomKernel);

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

    const op = gm.morphologyEx(src, 'blackhat', [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.11,
    ));
  });

  it('tophat', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageTophat);
    const op = gm.morphologyEx(src, 'tophat', [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.1,
    ));
  });

  it('tophat custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageTophatCustomKernel);

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

    const op = gm.morphologyEx(src, 'tophat', [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.11,
    ));
  });

  it('gradient', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageGradient);
    const op = gm.morphologyEx(src, 'gradient', [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.1,
    ));
  });

  it('gradient custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageGradientCustomKernel);

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

    const op = gm.morphologyEx(src, 'gradient', [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.11,
    ));
  });

  it('close', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const close = await gm.imageTensorFromURL(testImageClose);
    const op = gm.morphologyEx(src, 'close', [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(close);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      close,
      0.1,
    ));
  });

  it('close custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const close = await gm.imageTensorFromURL(testImageCloseCustomKernel);

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

    const op = gm.morphologyEx(src, 'close', [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(close);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      close,
      0.11,
    ));
  });

  it('open', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageOpen);
    const op = gm.morphologyEx(src, 'open', [5, 5]);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.1,
    ));
  });

  it('open custom kernel', async () => {
    const src = await gm.imageTensorFromURL(testImageSrc);
    const open = await gm.imageTensorFromURL(testImageOpenCustomKernel);

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

    const op = gm.morphologyEx(src, 'open', [5, 5], kernel);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    visualize(src);
    visualize(out);
    visualize(open);

    assert.isTrue(gm.tensorAssertMSEEqual(
      out,
      open,
      0.11,
    ));
  });
});
