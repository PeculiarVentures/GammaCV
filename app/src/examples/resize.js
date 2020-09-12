import * as gm from '../../../lib';

export default {
  op: (input, params) => gm.resize(
    input,
    params.RESIZE.width,
    params.RESIZE.height,
    params.RESIZE.type || 'nearest',
  ),
  tick(frame, {
    canvas, operation, output, session,
  }) {
    gm.clearCanvas(canvas);
    session.runOp(operation, frame, output);
    gm.canvasFromTensor(canvas, output);
  },
  params: {
    RESIZE: {
      width: {
        name: 'width',
        type: 'constant',
        min: 1,
        max: 1000,
        step: 1,
        default: 500,
      },
      height: {
        name: 'height',
        type: 'constant',
        min: 1,
        max: 1000,
        step: 1,
        default: 384,
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
