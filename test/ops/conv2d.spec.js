import testImage from '../assets/lena.png';
import * as gm from '../../lib';

describe.only('Convolution', () => {
  let sess;
  const setup = (input, kernel) => {
    const op = gm.conv2d(input, kernel);
    const output = gm.tensorFrom(op);

    sess.init(op);

    return { op, output };
  };

  beforeEach(() => {
    sess = new gm.Session();
  });

  afterEach(() => {
    if (sess) {
      sess.destroy();
      sess = null;
    }
  });

  it('Identity kernel', async () => {
    const input = await gm.imageTensorFromURL(testImage);
    const identityKernel = new gm.Tensor('float32', [3, 3, 4], new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]));
    const test = setup(input, identityKernel);

    sess.runOp(test.op, 0, test.output);

    gm.assert(gm.tensorAssertEqual(test.output, input), 'Input and output should be equal');
  });
});
