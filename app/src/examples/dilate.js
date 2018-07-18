import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.dilate(pipeline, [params.DILATE.w, params.DILATE.h]);

    return pipeline;
  },
  params: {
    DILATE: {
      name: 'DILATION',
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
