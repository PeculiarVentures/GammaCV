import { assert } from 'chai';
import * as gm from '../../lib';

describe('MediaInput', () => {
  let sess;

  before(async () => {
    if (sess) {
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('run pipeline with canvas element', () => {
    const canvas = document.createElement('canvas');
    const canvasCtx = canvas.getContext('2d');

    canvas.width = 1;
    canvas.height = 1;

    canvasCtx.fillStyle = 'rgba(255, 0, 0, 1)';
    canvasCtx.fillRect(0, 0, 1, 1);

    const input = new gm.MediaInput(canvas, [1, 1, 4]);
    const op = gm.cast(input, 'uint8');
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    // make sure op works correctly
    assert.equal(out.data[0], 255, 'should be 0');
    assert.equal(out.data[1], 0, 'should be 0');
    assert.equal(out.data[2], 0, 'should be 0');
    assert.equal(out.data[3], 255, 'should be 255');
  });

  it('run pipeline with video element', () => {
    const video = document.createElement('video');
    const input = new gm.MediaInput(video, [1, 1, 4]);
    const op = gm.grayscale(input);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    // make sure op works correctly
    assert.equal(out.data[0], 0, 'should be 0');
    assert.equal(out.data[1], 0, 'should be 0');
    assert.equal(out.data[2], 0, 'should be 0');
    assert.equal(out.data[3], 255, 'should be 255');
  });
});
