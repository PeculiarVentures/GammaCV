import * as gm from 'gammacv';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.colorSegmentation(
      pipeline,
      params.COLORSEGMENTATION.clusters,
    );

    return pipeline;
  },
  params: {
    COLORSEGMENTATION: {
      name: 'COLOR SEGMENTATION',
      clusters: {
        name: 'Num Clusters', type: 'constant', min: 2, max: 255, step: 1, default: 3,
      },
    },
  },
};
