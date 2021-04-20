import * as gm from 'gammacv';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.morphologyEx(
      pipeline,
      params.MORPH.type,
      [params.MORPH.w, params.MORPH.h],
    );

    return pipeline;
  },
  params: {
    MORPH: {
      name: 'EXTENDED MORPHOLOGY',
      type: {
        name: 'Type',
        type: 'constant',
        values: [
          { name: 'Open', value: 'open' },
          { name: 'Close', value: 'close' },
          { name: 'Gradient', value: 'gradient' },
          { name: 'Tophat', value: 'tophat' },
          { name: 'Blackhat', value: 'blackhat' },
        ],
      },
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
