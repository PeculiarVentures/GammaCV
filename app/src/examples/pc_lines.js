import * as gm from '../../../lib';

export default {
  init: () => ({ line: new gm.Line() }),
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.downsample(pipeline, params.PROCESSING.dCoef);
    pipeline = gm.gaussianBlur(pipeline, 3, 3);
    pipeline = gm.sobelOperator(pipeline);
    pipeline = gm.cannyEdges(pipeline, 0.25, 0.75);
    pipeline = gm.pcLines(pipeline, params.PCLINES.layers, 2, 2);

    return pipeline;
  },
  tick: (frame, {
    canvas, input, session, operation, output, context, params,
  }) => {
    const maxP = Math.max(input.shape[0], input.shape[1]);
    let lines = [];

    session.runOp(operation, frame, output);
    gm.canvasFromTensor(canvas, input);

    for (let i = 0; i < output.size / 4; i += 1) {
      const y = ~~(i / output.shape[1]);
      const x = i - (y * output.shape[1]);
      const value = output.get(y, x, 0);
      const x0 = output.get(y, x, 1);
      const y0 = output.get(y, x, 2);

      if (value > 0.0) {
        lines.push([value, x0, y0]);
      }
    }

    lines = lines.sort((b, a) => a[0] - b[0]);
    lines = lines.slice(0, params.PCLINES.count);

    for (let i = 0; i < lines.length; i += 1) {
      context.line.fromParallelCoords(
        lines[i][1] * params.PROCESSING.dCoef, lines[i][2] * params.PROCESSING.dCoef,
        input.shape[1], input.shape[0], maxP, maxP / 2,
      );

      gm.canvasDrawLine(canvas, context.line, 'rgba(0, 255, 0, 1.0)');
    }
  },
  params: {
    PROCESSING: {
      name: 'PROCESSING',
      dCoef: {
        name: 'Downsample',
        type: 'constant',
        min: 1,
        max: 4,
        step: 1,
        default: 2,
      },
    },
    PCLINES: {
      name: 'PC LINES',
      count: {
        name: 'Lines Count',
        type: 'uniform',
        min: 1,
        max: 100,
        step: 1,
        default: 10,
      },
      layers: {
        name: 'Layers Count',
        type: 'constant',
        min: 1,
        max: 5,
        step: 1,
        default: 2,
      },
    },
  },
};
