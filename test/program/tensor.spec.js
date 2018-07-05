import { assert } from 'chai';
import * as gm from '../../lib';

describe('Tensor', () => {
  describe('Types', () => {
    const types = [
      'array',
      'uint8',
      'uint16',
      'uint32',
      'int8',
      'int16',
      'int32',
      'float32',
      'float64',
      'uint8c',
    ];

    for (let i = 0; i < types.length; i += 1) {
      it(`Create with ${types[i]}`, () => {
        const t = new gm.Tensor(types[i], [1, 1]);

        gm.assert(gm.isTensor(t), 'Created instance should be tensor and without error');
      });
    }
  });

  describe('Input validation', () => {
    it('Invalid dtype', () => {
      assert.throws(() => new gm.Tensor('uint8', [2, 2], new Float32Array(4)), Error, /different dtypes assigned/i);
    });

    it('Invalid size', () => {
      assert.throws(() => new gm.Tensor('uint8', [2, 2], new Uint8Array(3)), Error, /different sizes assigned/i);
    });

    it('Invalid shape', () => {
      assert.throws(() => new gm.Tensor('uint8', [1.5, 1.5], new Uint8Array(3)), Error, 'Shape is not valid');
      assert.throws(() => new gm.Tensor('uint8', [], new Uint8Array()), Error, 'Shape is not valid');
    });

    it('Invalid stride', () => {
      assert.throws(() => new gm.Tensor('uint8', [1, 2], new Uint8Array(3), [1.5, 2]), Error, 'Stride is not valid');
      assert.throws(() => new gm.Tensor('uint8', [1, 2], new Uint8Array(3), [2]), Error, 'Stride length should be equal to shape length');
    });

    it('Valid', () => {
      assert.doesNotThrow(() => new gm.Tensor('uint8', [2, 2], new Uint8Array(4)), Error);
    });
  });

  it('get', () => {
    const input = new gm.Tensor('uint8', [2, 2], new Uint8Array([1, 2, 3, 4]));

    assert.equal(input.get(0, 0), 1);
    assert.equal(input.get(0, 1), 2);
    assert.equal(input.get(1, 0), 3);
    assert.equal(input.get(1, 1), 4);
  });

  it('set', () => {
    const input = new gm.Tensor('uint8', [2, 2], new Uint8Array([1, 2, 3, 4]));

    input.set(0, 0, 5);
    input.set(0, 1, 6);
    input.set(1, 0, 7);
    input.set(1, 1, 8);

    assert.equal(input.get(0, 0), 5);
    assert.equal(input.get(0, 1), 6);
    assert.equal(input.get(1, 0), 7);
    assert.equal(input.get(1, 1), 8);
  });

  it('index', () => {
    const input = new gm.Tensor('uint8', [2, 2, 3], new Uint8Array([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
    ]));

    assert.equal(input.index(0, 0, 0), 0);
    assert.equal(input.index(0, 0, 2), 2);
    assert.equal(input.index(1, 0, 1), 7);
    assert.equal(input.index(2, 2, 3), 21);
  });

  it('create with data', () => {
    const data = new Float32Array([1, 2, 3, 4]);
    const input = new gm.Tensor('float32', [2, 2], data);

    assert.deepEqual(input.data, data);
  });

  it('create without data', () => {
    const data = new Float32Array([0, 0, 0, 0]);
    const input = new gm.Tensor('float32', [2, 2]);

    assert.deepEqual(input.data, data);
  });

  it('create with data and without shape', () => {
    const data = new Float32Array([0, 0, 0, 0]);
    const input = new gm.Tensor('float32', undefined, data);

    assert.deepEqual(input.shape, [4]);
  });

  it('create with custom stride', () => {
    const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]), [1, 2]);

    assert.equal(input.get(0, 0), 1);
    assert.equal(input.get(1, 0), 2);
    assert.equal(input.get(0, 1), 3);
    assert.equal(input.get(1, 1), 4);
  });

  it('create with offset', () => {
    const input = new gm.Tensor('float32', [2, 2], new Float32Array([0, 0, 0, 1, 2, 3, 4]), undefined, 3);

    assert.equal(input.get(0, 0), 1);
    assert.equal(input.get(0, 1), 2);
    assert.equal(input.get(1, 0), 3);
    assert.equal(input.get(1, 1), 4);
  });

  it('release', () => {
    const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));

    input.relese();

    assert.deepEqual(input.data, new Float32Array([0, 0, 0, 0]));
  });

  it('clone', () => {
    const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
    const output = input.clone();

    assert.isTrue(gm.tensorAssertEqual(input, output));
  });
});
