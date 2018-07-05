import * as gm from '../../../lib';

export default {
  op: (input, params) => gm.histogramEqualization(
    params.HISTOGRAM_EQUALIZATION.input === 'grayscale' ? gm.grayscale(input) : input,
    params.HISTOGRAM_EQUALIZATION.layers,
  ),
  params: {
    HISTOGRAM_EQUALIZATION: {
      name: 'Histogram Equalization',
      input: {
        name: 'Input',
        type: 'constant',
        values: [
          { name: 'Colored', value: 'colored' },
          { name: 'Grayscaled', value: 'grayscale' },
        ],
      },
      layers: {
        name: 'Layers',
        type: 'constant',
        min: 1,
        max: 5,
        step: 1,
        default: 2,
      },
    },
  },
};
