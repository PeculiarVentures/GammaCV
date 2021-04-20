import * as gm from 'gammacv';

export default {
  op: (input, params) => {
    let pipeline = input;

    pipeline = gm.grayscale(input);
    pipeline = gm.gaussianBlur(
      pipeline,
      params.GAUSSIANBLUR.kernelSize,
      params.GAUSSIANBLUR.sigma,
    );

    return pipeline;
  },
  params: {
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
