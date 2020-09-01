import { assert } from 'chai';
import * as gm from '../../lib';
import videoMp4URL from '../assets/out_5.mp4';
import videoOGGURL from '../assets/video.ogg';

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

  /**
   * Video was compiled from 2 1x1px png images with colors:
   * #630094 and #FF3C6A, commands used for creation:
   * ffmpeg -framerate 0.45 -t 1 -pattern_type glob -i '*.png' video.ogg
   * ffmpeg -framerate 0.45 -t 1 -pattern_type glob -i '*.png' -vcodec libx264 video.mp4
   */
  it('run pipeline with video element', async function test() {
    this.timeout(9000);

    // setup video
    const video = document.createElement('video');
    const sourceOgg = document.createElement('source');
    const sourceMp4 = document.createElement('source');
    const duration = 4;

    sourceOgg.src = videoOGGURL;
    sourceOgg.type = 'video/ogg';
    sourceMp4.src = videoMp4URL;
    sourceMp4.type = 'video/mp4';

    video.append(sourceOgg);
    video.append(sourceMp4);

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    document.body.append(video);

    // setup pipeline
    const input = new gm.MediaInput(video, [1, 1, 4]);
    const op = gm.grayscale(input);
    const out = gm.tensorFrom(op);

    sess.init(op);

    // start video
    await new Promise(res => video.addEventListener('canplay', res));
    video.play();
    await new Promise(res => video.addEventListener('playing', res));

    // check first frame content
    await new Promise((res) => {
      video.ontimeupdate = () => {
        if (video.currentTime < duration / 2) {
          sess.runOp(op, 0, out);

          // make sure op works correctly
          assert.equal(out.data[0], 32, 'should be 32');
          assert.equal(out.data[1], 32, 'should be 32');
          assert.equal(out.data[2], 32, 'should be 32');
          assert.equal(out.data[3], 255, 'should be 255');

          video.ontimeupdate = null;
          res();
        }
      };
    });

    // check second frame content
    await new Promise((res) => {
      video.ontimeupdate = () => {
        if (video.currentTime >= duration / 4 * 3) {
          sess.runOp(op, 1, out);

          // make sure op works correctly
          assert.equal(out.data[0], 105, 'should be 105');
          assert.equal(out.data[1], 105, 'should be 105');
          assert.equal(out.data[2], 105, 'should be 105');
          assert.equal(out.data[3], 255, 'should be 255');

          video.ontimeupdate = null;
          res();
        }
      };
    });
  });
});
