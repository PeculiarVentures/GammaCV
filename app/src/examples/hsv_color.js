import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.HSVColor(
      pipeline,
      params.HSV.type,
    );

    return pipeline;
  },
  params: {
    HSV: {
      type: {
        name: 'Type',
        type: 'constant',
        values: [
          { name: 'RGB to HSV', value: 'rgb_to_hsv' },
          { name: 'HSV to RGB', value: 'hsv_to_rgb' },
        ],
      },
    },
  },
};
