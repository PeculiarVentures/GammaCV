import * as gm from 'gammacv';

export default {
  op: (input) => {
    let pipeline = input;

    pipeline = gm.skinTest(pipeline);

    return pipeline;
  },
};
