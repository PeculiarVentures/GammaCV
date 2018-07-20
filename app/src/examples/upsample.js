import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.downsample(pipeline, params.UPSAMPLE.coeficient, 'max');
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
        name: 'Coeficient', type: 'constant', min: 1, max: 5, step: 0.25, default: 1.75,
      },
      type: {
        name: 'Interpolation',
        type: 'constant',
        values: [{
          name: 'Nearest', value: 'nearest',
        }, {
          name: 'Linear', value: 'linear',
        }],
      },
    },
  },
};
