import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    // pipeline = gm.morphologyEx(pipeline, 'blackhat', [5, 5]);

    pipeline = gm.adaptiveThreshold(
      pipeline,
      params.THRESHOLD.uS,
      params.THRESHOLD.uT,
      params.THRESHOLD.c,
    );

    return pipeline;
  },
  params: {
    THRESHOLD: {
      name: 'THRESHOLD',
      uS: {
        name: 'Size',
        type: 'uniform',
        min: 0,
        max: 100,
        step: 1,
        default: 5,
      },
      uT: {
        name: 'Value',
        type: 'uniform',
        min: 0,
        max: 100,
        step: 1,
        default: 15,
      },
      c: {
        name: 'Channel',
        type: 'constant',
        min: 0,
        max: 2,
        step: 1,
        default: 0,
      },
    },
  },
};
