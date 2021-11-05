import { assert } from 'chai';
import * as gm from '../../lib';
import { assets } from '../assets';

describe('MediaInput', () => {
  let sess: gm.Session;

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

  /**
   * Video was compiled from 2 18x18px png images:
   * v_red_blue.png and v_white_black.png, commands used for creation:
   * ffmpeg -framerate 0.45 -t 1 -pattern_type glob -i 'v_*.png' -pix_fmt yuv420p video.ogg
   * ffmpeg -framerate 0.45 -t 1 -pattern_type glob -i 'v_*.png' -pix_fmt yuv420p video.mp4
   *
   * Notes:
   * Firefox and Safari doesn't support 1x1px video
   * Safari requires at least more than 12px
   */
  it('run pipeline with video element', async function test() {
    this.timeout(9000);

    // setup video
    const video = document.createElement('video');
    const sourceOgg = document.createElement('source');
    const sourceMp4 = document.createElement('source');
    const duration = 4;

    sourceOgg.src = assets.video_ogg;
    sourceOgg.type = 'video/ogg';
    sourceMp4.src = assets.video_mp4;
    sourceMp4.type = 'video/mp4';

    video.append(sourceOgg);
    video.append(sourceMp4);

    video.muted = true;
    video.loop = true;
    video.preload = 'yes';
    video.playsInline = true;
    document.body.append(video);

    // setup pipeline
    const input = new gm.MediaInput(video, [18, 18, 4]);
    const op = gm.grayscale(input);
    const out = gm.tensorFrom(op);

    sess.init(op);

    // start video
    video.play();
    await new Promise(res => video.addEventListener('playing', res));

    // check first frame content
    await new Promise<void>((res) => {
      video.ontimeupdate = () => {
        if (video.currentTime < duration / 2) {
          sess.runOp(op, 0, out);

          // make sure op works correctly
          // used closeTo since video decoding very in Safari
          assert.closeTo(out.data[0], 54, 2, 'should be 54');
          assert.closeTo(out.data[1], 54, 2, 'should be 54');
          assert.closeTo(out.data[2], 54, 2, 'should be 54');
          assert.closeTo(out.data[3], 255, 2, 'should be 255');

          video.ontimeupdate = null;
          res();
        }
      };
    });

    // check second frame content
    await new Promise<void>((res) => {
      video.ontimeupdate = () => {
        if (video.currentTime >= duration / 4 * 3) {
          sess.runOp(op, 1, out);

          // make sure op works correctly
          assert.equal(out.data[0], 0, 'should be 105');
          assert.equal(out.data[1], 0, 'should be 105');
          assert.equal(out.data[2], 0, 'should be 105');
          assert.equal(out.data[3], 255, 'should be 255');

          // make sure op works correctly
          const pxOffset = ((18 * 7) + 2) * 5; // 2nd pixel of 8-th row

          assert.equal(out.data[pxOffset + 0], 255, 'should be 255');
          assert.equal(out.data[pxOffset + 1], 255, 'should be 255');
          assert.equal(out.data[pxOffset + 2], 255, 'should be 255');
          assert.equal(out.data[pxOffset + 3], 255, 'should be 255');

          video.ontimeupdate = null;
          res();
        }
      };
    });
  });
});
