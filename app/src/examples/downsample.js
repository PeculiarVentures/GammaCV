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
        name: 'Coefficient', type: 'constant', min: 1, max: 20, step: 0.25, default: 1.75,
      },
      type: {
        name: 'Type',
        type: 'constant',
        values: [{
          name: 'Nearest', value: 'nearest',
        }, {
          name: 'Bicubic', value: 'bicubic',
        }],
      },
    },
  },
};
