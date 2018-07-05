import * as gm from '../../../lib';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(pipeline);
    pipeline = gm.gaussianBlur(
      pipeline,
      params.GAUSSIANBLUR.kernelSize,
      params.GAUSSIANBLUR.sigma,
    );
    pipeline = gm.sobelOperator(pipeline);
    pipeline = gm.cannyEdges(
      pipeline,
      params.CANNYEDGES.uThresholdHigh,
      params.CANNYEDGES.uThresholdLow,
    );

    return pipeline;
  },
  params: {
    CANNYEDGES: {
      name: 'CANNY EDGES',
      uThresholdHigh: {
        name: 'High Threshold',
        type: 'uniform',
        min: 0,
        max: 1,
        step: 0.05,
        default: 0.75,
      },
      uThresholdLow: {
        name: 'Low Threshold',
        type: 'uniform',
        min: 0,
        max: 1,
        step: 0.05,
        default: 0.25,
      },
    },
    GAUSSIANBLUR: {
      name: 'GAUSSIAN BLUR',
      kernelSize: {
        name: 'Kernel Size',
        type: 'constant',
        min: 3,
        max: 50,
        step: 2,
        default: 3,
      },
      sigma: {
        name: 'Sigma',
        type: 'constant',
        min: 1,
        max: 50,
        step: 0.5,
        default: 1,
      },
    },
  },
};
