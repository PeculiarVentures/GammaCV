import { assert } from 'chai';
import testImagePixels from './assets/lena_raw.json';
import { assets } from './assets';
import * as gm from '../lib';

describe('io', () => {
  it('imageTensorFromURL', async () => {
    const input = await gm.imageTensorFromURL(assets.lena);
    const output = new gm.Tensor('uint8', [512, 512, 4], new Uint8Array(testImagePixels));

    assert.isTrue(gm.tensorAssertCloseEqual(input, output, 0), 'Tensors are not close equal to each other.');
  });
});

