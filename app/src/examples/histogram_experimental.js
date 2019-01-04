import * as gm from '../../../lib';

const errors = [
  'INVALID_ENUM',
  'INVALID_VALUE',
  'INVALID_OPERATION',
  'INVALID_FRAMEBUFFER_OPERATION',
  'OUT_OF_MEMORY',
  'CONTEXT_LOST_WEBGL',
];

const getErrorType = (gl, error) => errors.filter(err => error === gl[err])[0] || 'none';

export default {
  op: (input, params) => gm.histogramExperimental(input, params.HISTOGRAM.chanels),
  params: {
    HISTOGRAM: {
      chanels: {
        name: 'Number of Channels', type: 'constant', min: 1, max: 3, step: 1, default: 3,
      },
    },
  },
  tick(frame, {
    canvas, operation, output, session, input,
  }) {
    session.runOp(operation, frame, output);

    gm.canvasFromTensor(canvas, input);

    // console.log(output.data[0], output.data[1]);
    // console.log(output.data[18], output.data[19]);

    const errorCode = session.gl.getError();

    console.log(getErrorType(session.gl, errorCode));

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
