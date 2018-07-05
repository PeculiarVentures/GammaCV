import * as gm from '../../../lib';

export default {
  op: (input) => {
    let pipeline = input;

    pipeline = gm.skinTest(pipeline);

    return pipeline;
  },
};
