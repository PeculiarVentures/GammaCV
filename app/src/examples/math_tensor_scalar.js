import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    
    pipeline = gm.multScalar(pipeline, )

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
    PARAMS: {
      coeficient: {
        name: 'Value', type: 'uniform', min: 1, max: 20, step: 0.25, default: 1.75,
      },
      type: {
        name: 'Operation',
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
