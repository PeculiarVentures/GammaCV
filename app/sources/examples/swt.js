import * as gm from 'gammacv';

export default {
  init: () => ({ line: new gm.Line() }),
  op: (input, params) => {
    const { SWT: { min, max, steps } } = params;
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.gaussianBlur(pipeline, 3, 3);
    const sobel = gm.sobelOperator(pipeline);
    const canny = gm.cannyEdges(sobel, 0.2, 0.75);

    pipeline = gm.swt(sobel, canny, min, max, steps, 1);

    return pipeline;
  },
  tick(frame, {
    canvas, operation, output, input, context: { line }, session,
  }) {
    // finaly run operation on GPU and then write result in to output tensor
    session.runOp(operation, frame, output);

    // draw initial video
    gm.canvasFromTensor(canvas, input);

    const newLine = line;
    // visualize strokes
    for (let i = 0; i < output.size / 4; i += 1) {
      const y = Math.floor(i / output.shape[0]);
      const x = i - (y * output.shape[0]);
      const sx = x;
      const sy = y;
      const tx = output.get(y, x, 2);
      const ty = output.get(y, x, 3);

      newLine.x1 = sx;
      newLine.y1 = sy;
      newLine.x2 = tx;
      newLine.y2 = ty;

      if (tx !== 0 && ty !== 0) {
        gm.canvasDrawLine(canvas, newLine);
      }
    }
  },
  params: {
    SWT: {
      name: 'Stroke Width Transform',
      min: {
        name: 'Min', type: 'constant', min: 2, max: 30, step: 1, default: 3,
      },
      max: {
        name: 'Max', type: 'constant', min: 2, max: 30, step: 1, default: 10,
      },
      steps: {
        name: 'Steps', type: 'constant', min: 5, max: 30, step: 1, default: 10,
      },
    },
  },
};
