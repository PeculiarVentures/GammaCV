import * as gm from '../../../lib';

function drawText(ctx, text, value, color, position) {
  ctx.fillStyle = color;
  ctx.fillText(`${text}: ${value}`, ctx.canvas.width - 10, ctx.canvas.height - 10 - position * (18 + 10));
}

export default {
  op: (input, params) => gm.meanStd(input, params.MEAN_STD.layers),
  params: {
    MEAN_STD: {
      name: 'MEAN STD',
      layers: {
        name: 'Number of Layers', type: 'constant', min: 1, max: 10, step: 1, default: 2,
      },
    },
  },
  tick(frame, {
    canvas, operation, output, session, input,
  }) {
    session.runOp(operation, frame, output);

    gm.canvasFromTensor(canvas, input);

    const ctx = canvas.getContext('2d');

    const size = 18;
    ctx.textAlign = 'right';
    ctx.font = `bold ${size}px ${getComputedStyle(document.body).fontFamily}`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    drawText(ctx, 'Mean R', output.get(0, 0, 0), 'red', 1);
    drawText(ctx, 'Mean G', output.get(0, 0, 1), 'green', 2);
    drawText(ctx, 'Mean B', output.get(0, 0, 2), 'blue', 3);

    drawText(ctx, 'STD R', output.get(1, 0, 0), 'red', 4);
    drawText(ctx, 'STD G', output.get(1, 0, 1), 'green', 5);
    drawText(ctx, 'STD B', output.get(1, 0, 2), 'blue', 6);
  },
};
