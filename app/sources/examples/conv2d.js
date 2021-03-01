import * as gm from 'gammacv';

export default {
  op: (input, params) => {
    let pipeline = input;
    const kernelGenerator = gm.kernels[params.CONV2D.kernel];

    pipeline = gm.conv2d(
      pipeline,
      kernelGenerator(),
      params.CONV2D.factor,
      params.CONV2D.bias,
    );

    return pipeline;
  },
  params: {
    CONV2D: {
      name: 'CONVOLUTION',
      kernel: {
        name: 'Kernel',
        type: 'constant',
        values: Object.keys(gm.kernels).map(name => ({ name, value: name })),
      },
      factor: {
        name: 'Factor',
        type: 'uniform',
        min: 0,
        max: 3,
        step: 0.1,
        default: 1,
      },
      bias: {
        name: 'Bias',
        type: 'uniform',
        min: -3,
        max: 3,
        step: 0.1,
        default: 0,
      },
    },
  },
};
