import * as gm from 'gammacv';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.downsample(pipeline, params.UPSAMPLE.coeficient, params.UPSAMPLE.type);
    pipeline = gm.upsample(
      pipeline,
      params.UPSAMPLE.coeficient,
      params.UPSAMPLE.type || 'nearest', // crutch until we have no select prop feature #46
    );

    return pipeline;
  },
  tick(frame, {
    canvas, operation, output, session,
  }) {
    gm.clearCanvas(canvas);
    session.runOp(operation, frame, output);
    gm.canvasFromTensor(canvas, output);
  },
  params: {
    UPSAMPLE: {
      coeficient: {
        name: 'Coefficient', type: 'constant', min: 1, max: 5, step: 0.25, default: 1.75,
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
