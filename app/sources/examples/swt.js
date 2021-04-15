import * as gm from 'gammacv';

export default {
  init: () => ({ line: new gm.Line() }),
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.gaussianBlur(pipeline, 3, 3);
    const sobel = gm.sobelOperator(pipeline);
    const canny = gm.cannyEdges(sobel, 0.2, 0.75);

    pipeline = gm.swt(sobel, canny, 4, 10, 12, 1);

    return pipeline;
  },
  tick(frame, {
    canvas, operation, output, input, context: { line }, session,
  }) {
    // finaly run operation on GPU and then write result in to output tensor
    session.runOp(operation, frame, output);
    console.log(output);

    // draw initial video
    gm.canvasFromTensor(canvas, input);

    // visualize strokes
    for (let i = 0; i < output.size / 4; i += 1) {
      const y = ~~(i / output.shape[0]);
      const x = i - (y * output.shape[0]);
      const sx = x;
      const sy = y;
      const tx = output.get(y, x, 2);
      const ty = output.get(y, x, 3);

      line.x1 = sx;
      line.y1 = sy;
      line.x2 = tx;
      line.y2 = ty;

      if (tx !== 0 & ty !== 0) {
        gm.canvasDrawLine(canvas, line);
      }
    }
  },
};
