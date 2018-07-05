import * as gm from '../../../lib';

const DOWNSAMPLE_RATE = 2;

export default {
  init: () => ({ line: new gm.Line() }),
  op: (input) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.downsample(pipeline, DOWNSAMPLE_RATE);
    pipeline = gm.gaussianBlur(pipeline, 3, 3);
    pipeline = gm.sobelOperator(pipeline);
    pipeline = gm.cannyEdges(pipeline, 0.25, 0.75);
    pipeline = gm.pcLines(pipeline);

    return pipeline;
  },
  tick: (frame, {
    canvas, input, session, operation, output, context,
  }) => {
    gm.canvasFromTensor(canvas, input);
    session.runOp(operation, frame, output);

    for (let j = 0; j < 10; j += 1) {
      let maxValue = -Infinity;
      const best = [];
      const point = [];

      for (let i = 0; i < output.size / 4; i += 1) {
        const y = ~~(i / output.shape[0]);
        const x = i - (y * output.shape[0]);
        const value = output.get(y, x, 0);

        if (value > maxValue) {
          maxValue = value;

          point[0] = output.get(y, x, 1);
          point[1] = output.get(y, x, 2);

          best[0] = y;
          best[1] = x;
        }
      }

      const max = Math.max(input.shape[0], input.shape[1]);

      context.line.fromParallelCoords(
        point[0] * DOWNSAMPLE_RATE, point[1] * DOWNSAMPLE_RATE,
        input.shape[1], input.shape[0], max, max / 2,
      );

      gm.canvasDrawLine(canvas, context.line, 'rgba(0, 255, 0, 1.0)');

      output.set(best[0], best[1], 0, 0);
      output.set(best[0] - 1, best[1] - 1, 0, 0);
      output.set(best[0], best[1] - 1, 0, 0);
      output.set(best[0] + 1, best[1] - 1, 0, 0);
      output.set(best[0] + 1, best[1], 0, 0);
      output.set(best[0] + 1, best[1] + 1, 0, 0);
      output.set(best[0], best[1] + 1, 0, 0);
      output.set(best[0] - 1, best[1] + 1, 0, 0);
      output.set(best[0] - 1, best[1], 0, 0);
    }
  },
  params: {},
};
