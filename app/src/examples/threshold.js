import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.threshold(
      pipeline,
      params.THRESHOLD.uT,
      params.THRESHOLD.c,
    );

    return pipeline;
  },
  params: {
    THRESHOLD: {
      name: 'THRESHOLD',
      uT: {
        name: 'Value',
        type: 'uniform',
        min: 0,
        max: 1,
        step: 0.05,
        default: 0.1,
      },
      c: {
        name: 'Chanel',
        type: 'constant',
        min: 0,
        max: 2,
        step: 1,
        default: 0,
      },
    },
  },
};
