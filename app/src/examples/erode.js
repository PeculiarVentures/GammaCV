import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.erode(pipeline, [params.ERODE.w, params.ERODE.h]);

    return pipeline;
  },
  params: {
    ERODE: {
      name: 'EROSION',
      w: {
        name: 'W',
        type: 'constant',
        min: 1,
        max: 20,
        step: 1,
        default: 10,
      },
      h: {
        name: 'H',
        type: 'constant',
        min: 1,
        max: 20,
        step: 1,
        default: 10,
      },
    },
  },
};
