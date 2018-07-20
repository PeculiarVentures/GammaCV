import * as gm from '../../../lib';

export default {
  op: input => gm.summedAreaTable(input),
  tick(frame, {
    canvas, operation, output, session,
  }) {
    gm.clearCanvas(canvas);
    session.runOp(operation, frame, output);

    const max = Math.max(
      output.get(output.shape[0] - 1, output.shape[1] - 1, 0),
      output.get(output.shape[0] - 1, output.shape[1] - 1, 1),
      output.get(output.shape[0] - 1, output.shape[1] - 1, 2),
    );

    const data = output.data;

    for (let i = 0; i < output.size; i += 4) {
      data[i] /= max;
      data[i + 1] /= max;
      data[i + 2] /= max;
      data[i + 3] = 255;
    }
    gm.canvasFromTensor(canvas, output);
  },
  params: {},
};
