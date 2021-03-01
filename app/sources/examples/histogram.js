import * as gm from 'gammacv';

export default {
  op: (input, params) => gm.histogram(input, params.HISTOGRAM.layers),
  params: {
    HISTOGRAM: {
      layers: {
        name: 'Number of Layers', type: 'constant', min: 1, max: 5, step: 1, default: 2,
      },
    },
  },
  tick(frame, {
    canvas, operation, output, session, input,
  }) {
    session.runOp(operation, frame, output);

    gm.canvasFromTensor(canvas, input);

    const ctx = canvas.getContext('2d');

    ctx.beginPath();

    const pathR = new Path2D();
    const pathG = new Path2D();
    const pathB = new Path2D();
    pathR.moveTo(0, canvas.height);
    pathG.moveTo(0, canvas.height);
    pathB.moveTo(0, canvas.height);
    const size = canvas.width * canvas.height;
    const k = 1 / size * canvas.height * 10;

    for (let x = 0; x < 256; x += 1) {
      const vr = output.get(0, x, 0) * k;
      const vg = output.get(0, x, 1) * k;
      const vb = output.get(0, x, 2) * k;

      pathR.lineTo(x / 255 * canvas.width, canvas.height - vr);
      pathG.lineTo(x / 255 * canvas.width, canvas.height - vg);
      pathB.lineTo(x / 255 * canvas.width, canvas.height - vb);
    }

    pathR.lineTo(canvas.width, canvas.height);
    pathG.lineTo(canvas.width, canvas.height);
    pathB.lineTo(canvas.width, canvas.height);
    pathR.closePath();
    pathG.closePath();
    pathB.closePath();

    ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
    ctx.fill(pathR);

    ctx.fillStyle = 'rgba(0, 255, 0, 0.25)';
    ctx.fill(pathG);

    ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';
    ctx.fill(pathB);
  },
};
