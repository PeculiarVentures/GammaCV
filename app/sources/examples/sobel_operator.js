import * as gm from 'gammacv';

export default {
  op: (input) => {
    let pipeline = input;

    pipeline = gm.grayscale(input);
    pipeline = gm.sobelOperator(pipeline);

    return pipeline;
  },
};
