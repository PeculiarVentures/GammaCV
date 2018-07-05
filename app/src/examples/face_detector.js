import * as gm from '../../../lib';

export default {
  op: (input) => {
    let pipeline = input;

    pipeline = gm.cast(input);

    return pipeline;
  },
  init: (a, b, params) => ({
    detector: new gm.FaceDetector(500, 384, {
      from: params.FACEDETECTOR.from,
      stages: params.FACEDETECTOR.stages,
      scale: params.FACEDETECTOR.scale,
      winSize: 10,
      downsample: params.FACEDETECTOR.downsample,
    }),
  }),
  tick: (frame, t) => {
    const rect = t.context.detector.detect(t.input, frame);

    gm.canvasFromTensor(t.canvas, t.input);
    gm.canvasDrawRect(t.canvas, rect, 'rgb(0, 255, 0)');
  },
  params: {
    FACEDETECTOR: {
      name: 'FACE DETECTOR',
      from: {
        name: 'From', type: 'constant', min: 1, max: 20, step: 1, default: 8,
      },
      stages: {
        name: 'Stages', type: 'constant', min: 1, max: 30, step: 1, default: 10,
      },
      scale: {
        name: 'Stage Scale', type: 'constant', min: 1, max: 10, step: 0.5, default: 1,
      },
      downsample: {
        name: 'Downsample Coeficient', type: 'constant', min: 1, max: 4, step: 0.5, default: 1.5,
      },
    },
  },
};
