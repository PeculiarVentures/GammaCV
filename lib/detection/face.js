/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import * as gm from '../../lib';
import Detector from './detector';
import faceCascade from './cascades/w_face.json';
import faceCascadeThresholds from './cascades/w_face_t.json';

export default class FaceDetector extends Detector {
  setup(params = {}) {
    this.params = Object.assign({}, FaceDetector.defaultParams, params);
    this.stages = this.params.stages;
    this.scale = this.params.scale;
    this.winSize = this.params.winSize;
    this.downsample = this.params.downsample;
    this.canvas = this.params.canvas;
    this.session = new gm.Session();
    this.session.initWebGL();
    this.downsampled = gm.downsample(this.input, this.downsample);
    this.grayscale = gm.gaussianBlur(gm.grayscale(this.downsampled), 5, 5);

    this.stageOp = [];
    this.outputs = [];
    this.steps = [];
    this.candidates = new gm.TypedPool(gm.Rect, this.stages * 20);

    const { from } = this.params;

    for (let i = 0; i < this.stages; i += 1) {
      const k = from + ~~(i * this.scale);
      const op = gm.hog(this.grayscale, k);

      this.steps[i] = k;
      this.stageOp[i] = op;
      this.outputs[i] = gm.tensorFrom(op);
      this.session.init(op);
    }
  }

  detect(input, frame) {
    // console.log(input)
    this.input.data = input.data;
    this.candidates.release();
    this.collectCandidates(frame);

    const res = new gm.Rect();
    const l = this.candidates.length;

    for (let i = 0; i < l; i += 1) {
      const candidate = this.candidates.at(i);

      res.ax += candidate.ax;
      res.ay += candidate.ay;
      res.bx += candidate.bx;
      res.by += candidate.by;
      res.cx += candidate.cx;
      res.cy += candidate.cy;
      res.dx += candidate.dx;
      res.dy += candidate.dy;
    }

    res.ax /= l;
    res.ay /= l;
    res.bx /= l;
    res.by /= l;
    res.cx /= l;
    res.cy /= l;
    res.dx /= l;
    res.dy /= l;

    if (l > 0) {
      return res.mul(this.downsample);
    }

    return false;
  }

  collectCandidates(frame) {
    loop: for (let i = 0; i < this.stages; i += 1) { // eslint-disable-line
      this.session.runOp(this.stageOp[i], frame, this.outputs[i]);

      const sy = ~~(((this.stageOp[i].shape[0] - this.winSize) + 1) / 1) - 1;
      const sx = ~~(((this.stageOp[i].shape[1] - this.winSize) + 1) / 1) - 1;

      // console.log(this.stageOp[i].shape[0], this.stageOp[i].shape[1])

      for (let dx = 0; dx < sx; dx += 2) {
        for (let dy = 0; dy < sy; dy += 2) {
          let detected = true;

          for (let c = 0; c < faceCascade.length; c += 1) {
            const w = faceCascade[c];
            let sum = 0;

            for (let wIndex = 0; wIndex < w.length; wIndex += 1) {
              const threshold = w[wIndex][0];
              const alpha = w[wIndex][1];
              const index = w[wIndex][2];
              const sign = w[wIndex][3];
              const y = ~~(index / this.winSize);
              const x = index - (y * this.winSize);
              const value = this.outputs[i].get((dy + y), (dx + x), 0);

              if (sign > 0) {
                sum += alpha * ((value > threshold) ? 1.0 : -1.0);
              } else {
                sum += alpha * ((value < threshold) ? 1.0 : -1.0);
              }
            }

            if (sum < faceCascadeThresholds[c]) {
              detected = false;

              break;
            }
          }

          if (detected) {
            const rect = [
              (dx * this.steps[i]), (dy * this.steps[i]),
              (dx + this.winSize) * this.steps[i], (dy * this.steps[i]),
              (dx + this.winSize) * this.steps[i], (dy + this.winSize) * this.steps[i],
              (dx * this.steps[i]), (dy + this.winSize) * this.steps[i],
            ];

            try {
              this.candidates.at(this.candidates.length).fromArray(rect);
              this.candidates.length += 1;
            } catch (err) {
              break loop; // eslint-disable-line
            }
          }
        }
      }
    }
  }

  static GroupRects(rects) {
    const length = rects.length;
    const neighbors = new Array(length).fill(0);
    let rect;
    let w = 0;
    let hw = 0;
    const coords = new Array(length).fill(null).map((el, i) => {
      rect = rects.at(i);
      w = (rect.cx - rect.ax);
      hw = w / 2;

      return [
        rect.ax + hw,
        rect.ay + hw,
        w,
      ];
    });

    let maxNeighbors = 0;
    let maxI = 0;

    for (let i = 0; i < length; i += 1) {
      const r1 = rects.at(i);

      for (let j = i + 1; j < length; j += 1) {
        const r2 = rects.at(j);

        if (gm.Rect.Distance(r1, r2) < 10) {
          neighbors[i] += 1;
          neighbors[j] += 1;
          coords[i][0] += r2.ax + (r2.cx - r2.ax) / 2;
          coords[i][1] += r2.ay + (r2.cy - r2.ay) / 2;
          coords[i][2] += (r2.cx - r2.ax);
          coords[j][0] += r1.ax + (r1.cx - r1.ax) / 2;
          coords[j][1] += r1.ay + (r1.cy - r1.ay) / 2;
          coords[j][2] += (r1.cx - r1.ax);
        }
      }

      if (neighbors[i] > maxNeighbors) {
        maxI = i;
        maxNeighbors = neighbors[i];
      }
    }

    const maxEl = coords[maxI];

    if (maxEl) {
      const k = maxNeighbors + 1;

      return {
        x: (maxEl[0] - maxEl[2] / 2) / k,
        y: (maxEl[1] - maxEl[2] / 2) / k,
        width: maxEl[2] / k,
      };
    }

    return false;
  }
}

FaceDetector.defaultParams = {
  stages: 5,
  scale: 1,
  winSize: 12,
  from: 6,
  downsample: 2,
  useSkinTest: true,
};
