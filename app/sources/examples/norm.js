import * as gm from 'gammacv';

export default {
  op: (input, params) => {
    let pipeline = input;

    if (params.NORM.input === 'grayscale') {
      pipeline = gm.grayscale(pipeline);
    }

    pipeline = gm.norm(
      pipeline,
      params.NORM.type || 'l2', // crutch until we have no select prop feature #46
    );

    return pipeline;
  },
  params: {
    NORM: {
      input: {
        name: 'Input',
        type: 'constant',
        values: [
          { name: 'Colored', value: 'colored' },
          { name: 'Grayscaled', value: 'grayscale' },
        ],
      },
      type: {
        name: 'Type',
        type: 'constant',
        values: [
          { name: 'L2 Norm', value: 'l2' },
          { name: 'MinMax', value: 'minmax' },
        ],
      },
    },
  },
};
