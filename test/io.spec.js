import { assert } from 'chai';
import testImage from './assets/lena.png';
import testImagePixels from './assets/lena_raw.json';
import * as gm from '../lib';

describe('io', () => {
  it('imageTensorFromURL', async () => {
    const input = await gm.imageTensorFromURL(testImage);
    const output = new gm.Tensor('uint8', [512, 512, 4], new Uint8Array(testImagePixels));

    assert.isTrue(gm.tensorAssertCloseEqual(input, output, 0), 'Tensors are not close equal to each other.');
  });
});

