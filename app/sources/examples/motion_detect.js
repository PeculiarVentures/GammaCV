import * as gm from 'gammacv';

// TODO: Should fix Placeholder removing
export default {
  init: (operation, session) => {
    const prevFrame = gm.tensorFrom(operation);

    session.feedDict({ prevFrame });

    return { prevFrame };
  },
  op: (input) => {
    let pipeline = input;

    pipeline = gm.cast(input);

    return pipeline;
  },
  tick(frame, {
    canvas, operation, output, session, context, input,
  }) {
    if (frame % 5 === 0) {
      gm.tensorClone(input, context.prevFrame);
    } else {
      session.runOp(operation, frame, output);
    }

    gm.canvasFromTensor(canvas, output);
  },
};
