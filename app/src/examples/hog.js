import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(input);
    pipeline = gm.hog(
      pipeline,
      params.HOG.step,
      'visualize',
    );

    return pipeline;
  },
  tick(frame, {
    canvas, params, operation, output, session,
  }) {
    const outX = operation.shape[1];
    const outY = operation.shape[0];
    const step = params.HOG.step;
    const halfStep = params.HOG.step / 2;

    session.runOp(operation, frame, output);

    gm.canvasFill(canvas, 'rgb(0, 0, 0)');

    for (let dx = 0; dx < outX / 3; dx += 1) {
      for (let dy = 0; dy < outY / 3; dy += 1) {
        let minI = +Infinity;
        let maxI = -Infinity;

        for (let j = 0; j < 9; j += 1) {
          const y = ~~(j / 3);
          const x = j - (y * 3);
          const I = output.get(dy * 3 + y, dx * 3 + x, 0);

          if (I < minI) {
            minI = I;
          }
          if (I > maxI) {
            maxI = I;
          }
        }

        for (let j = 0; j < 9; j += 1) {
          const y = ~~(j / 3);
          const x = j - (y * 3);
          const intencity = ((output.get(dy * 3 + y, dx * 3 + x, 0) - minI) / (maxI - minI));
          const theta = output.get(dy * 3 + y, dx * 3 + x, 1) + Math.PI / 20;
          const sin = Math.sin(theta);
          const cos = Math.cos(theta);

          const cx = (dx * step) + halfStep;
          const cy = (dy * step) + halfStep;

          const a1x = ((dx * step)) - cx;
          const a1y = ((dy * step) + halfStep) - cy;

          const b1x = (((dx + 1) * step)) - cx;
          const b1y = (((dy + 1) * step) - halfStep) - cy;
          const b2x = (a1x * cos - a1y * sin) + cx;
          const b2y = (b1x * sin + b1y * cos) + cy;

          const a2x = (b1x * cos - b1y * sin) + cx;
          const a2y = (a1x * sin + a1y * cos) + cy;

          gm.canvasDrawLine(canvas, [a2x, a2y, b2x, b2y], `rgba(255, 255, 255, ${intencity / 4})`);
        }
      }
    }
  },
  params: {
    HOG: {
      step: {
        name: 'Step', type: 'constant', min: 1, max: 30, step: 1, default: 20,
      },
    },
  },
};
