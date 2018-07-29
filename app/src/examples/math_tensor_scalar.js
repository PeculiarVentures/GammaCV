import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    if (params.MATH.type === 'mult') {
      pipeline = gm.multScalar(pipeline, params.MATH.uScalar);
    }

    if (params.MATH.type === 'div') {
      pipeline = gm.divScalar(pipeline, params.MATH.uScalar);
    }

    if (params.MATH.type === 'add') {
      pipeline = gm.addScalar(pipeline, params.MATH.uScalar);
    }

    if (params.MATH.type === 'sub') {
      pipeline = gm.subScalar(pipeline, params.MATH.uScalar);
    }

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
    MATH: {
      uScalar: {
        name: 'Value', type: 'uniform', min: 0, max: 1, step: 0.1, default: 0.5,
      },
      type: {
        name: 'Operation',
        type: 'constant',
        values: [{
          name: 'Mult', value: 'mult',
        }, {
          name: 'Div', value: 'div',
        }, {
          name: 'Add', value: 'add',
        }, {
          name: 'Sub', value: 'sub',
        }],
      },
    },
  },
};
