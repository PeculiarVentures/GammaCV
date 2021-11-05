import { assert } from 'chai';
import { visualize } from '../test_utils';
import * as gm from '../../lib';
import { assets } from '../assets';


describe('MorphTransform', () => {
  let sess: gm.Session = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('blackhat', async () => {
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_blackhat);
    const op = gm.morphologyEx(src, 'blackhat', [5, 5]);

    if (op instanceof Error) {
      throw op;
    }

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

  it('blackhat custom kernel', async () => {
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_blackhat_custom_kernel);

    const kernel = gm.tensorFromFlat([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ], [5, 5, 4], 'float32');

    const op = gm.morphologyEx(src, 'blackhat', [5, 5], kernel);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_tophat);
    const op = gm.morphologyEx(src, 'tophat', [5, 5]);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_tophat_custom_kernel);

    const kernel = gm.tensorFromFlat([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ], [5, 5, 4], 'float32');

    const op = gm.morphologyEx(src, 'tophat', [5, 5], kernel);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_gradient);
    const op = gm.morphologyEx(src, 'gradient', [5, 5]);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_gradient_custom_kernel);

    const kernel = gm.tensorFromFlat([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ], [5, 5, 4], 'float32');

    const op = gm.morphologyEx(src, 'gradient', [5, 5], kernel);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const close = await gm.imageTensorFromURL(assets.morphology_close);
    const op = gm.morphologyEx(src, 'close', [5, 5]);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const close = await gm.imageTensorFromURL(assets.morphology_close_custom_kernel);

    const kernel = gm.tensorFromFlat([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ], [5, 5, 4], 'float32');

    const op = gm.morphologyEx(src, 'close', [5, 5], kernel);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_open);
    const op = gm.morphologyEx(src, 'open', [5, 5]);
    if (op instanceof Error) {
      throw op;
    }
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
    const src = await gm.imageTensorFromURL(assets.morphology_src);
    const open = await gm.imageTensorFromURL(assets.morphology_open_custom_kernel);

    const kernel = gm.tensorFromFlat([
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 1,
      0, 0, 1, 1, 1,
      0, 0, 0, 1, 1,
      0, 0, 0, 0, 1,
    ], [5, 5, 4], 'float32');

    const op = gm.morphologyEx(src, 'open', [5, 5], kernel);
    if (op instanceof Error) {
      throw op;
    }
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
