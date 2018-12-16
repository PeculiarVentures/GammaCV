import * as gm from '../../../lib';

export default {
  op: (input, params) => gm.downsample(
    input,
    params.DOWNSAMPLE.coeficient,
    params.DOWNSAMPLE.type || 'mean', // crutch until we have no select prop feature #46
  ),
  tick(frame, {
    canvas, operation, output, session,
  }) {
    gm.clearCanvas(canvas);
    session.runOp(operation, frame, output);
    gm.canvasFromTensor(canvas, output);
  },
  params: {
    DOWNSAMPLE: {
      coeficient: {
        name: 'Coeficient', type: 'constant', min: 1, max: 20, step: 0.25, default: 1.75,
      },
      type: {
        name: 'Type',
        type: 'constant',
        values: [{
          name: 'Maximum', value: 'max',
        }, {
          name: 'Mean', value: 'mean',
        }],
      },
    },
  },
};
