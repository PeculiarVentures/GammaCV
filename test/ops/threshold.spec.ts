import { assert } from 'chai';
import * as gm from '../../lib';

describe('Threshold', () => {
  let sess: gm.Session = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('Channel R', async () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([110, 120, 130, 255]));
    const op = gm.threshold(input, 0.4, 0);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      new gm.Tensor('float32', [1, 1, 4], new Float32Array([255, 255, 255, 255])),
    ));
  });

  it('Channel G', async () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([110, 120, 130, 255]));
    const op = gm.threshold(input, 0.5, 1);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 0, 0, 255])),
    ));
  });

  it('Channel B', async () => {
    const input = new gm.Tensor('uint8', [1, 1, 4], new Uint8Array([110, 120, 130, 255]));
    const op = gm.threshold(input, 0.5, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, Math.random(), out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      new gm.Tensor('float32', [1, 1, 4], new Float32Array([255, 255, 255, 255])),
    ));
  });
});
