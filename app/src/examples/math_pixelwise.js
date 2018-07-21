import * as gm from '../../../lib';

export default {
  init: () => {
    const prevFrame = new gm.Tensor('uint8', [384, 500, 4]);

    return { prevFrame };
  },
  op: (input, params, context) => {
    let pipeline = input;

    // console.log(input, params, context)

    if (params.MATH.type === 'mult') {
      pipeline = gm.mult(pipeline, context.prevFrame);
    }

    if (params.MATH.type === 'div') {
      pipeline = gm.div(pipeline, context.prevFrame);
    }

    if (params.MATH.type === 'add') {
      pipeline = gm.add(pipeline, context.prevFrame);
    }

    if (params.MATH.type === 'sub') {
      pipeline = gm.sub(pipeline, context.prevFrame);
    }
    return pipeline;
  },
  tick(frame, {
    canvas, operation, output, session, context,
  }) {
    gm.clearCanvas(canvas);
    session.runOp(operation, frame, output);

    gm.tensorClone(this.imgInput, context.prevFrame);
    gm.canvasFromTensor(canvas, output);
  },
  params: {
    MATH: {
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
