import { assert } from 'chai';
import * as gm from '../../lib';

describe('Tensor Utils', () => {
  describe('tensorMap', () => {
    it('with input callback and output', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
      const output = new gm.Tensor('float32', [2, 2]);

      gm.tensorMap(input, v => v, output);

      gm.assert(gm.tensorAssertEqual(output, input), 'Tensors should be equal');
    });

    it('without output', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
      const output = new gm.Tensor('float32', [2, 2], new Float32Array([2, 3, 4, 5]));

      gm.tensorMap(input, v => v + 1);

      gm.assert(gm.tensorAssertEqual(input, output), 'Tensors should be equal');
    });

    it('without callback', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));

      assert.throws(gm.tensorMap.bind(null, input), TypeError);
    });
  });
  describe('tensorOnes', () => {
    it('with all arguments', () => {
      const expected = new gm.Tensor('uint8', [2, 2], new Uint8Array(4).fill(1));

      const output = gm.tensorOnes('uint8', [2, 2]);

      gm.assert(gm.tensorAssertEqual(output, expected), 'Tensors should be equal');
    });

    it('missing shape', () => {
      assert.throws(gm.tensorOnes.bind(null, 'uint8'), Error);
    });

    it('missing dtype', () => {
      assert.throws(gm.tensorOnes.bind(null, undefined, [2, 2]), Error, 'Unexpected type: undefined');
    });
  });

  describe('flipTensor', () => {
    it('invert all without output', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
      const expected = new gm.Tensor('float32', [2, 2], new Float32Array([4, 3, 2, 1]));

      gm.flipTensor(input);

      gm.assert(gm.tensorAssertEqual(input, expected), 'Tensors should be equal');
    });

    it('invert all with output', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
      const output = new gm.Tensor('float32', [2, 2]);
      const expected = new gm.Tensor('float32', [2, 2], new Float32Array([4, 3, 2, 1]));

      gm.flipTensor(input, output);

      gm.assert(gm.tensorAssertEqual(output, expected), 'Tensors should be equal');
    });

    it('invert x', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
      const expected = new gm.Tensor('float32', [2, 2], new Float32Array([2, 1, 4, 3]));

      gm.flipTensor(input, undefined, [false, true]);

      gm.assert(gm.tensorAssertEqual(input, expected), 'Tensors should be equal');
    });

    it('invert y', () => {
      const input = new gm.Tensor('float32', [2, 2], new Float32Array([1, 2, 3, 4]));
      const expected = new gm.Tensor('float32', [2, 2], new Float32Array([3, 4, 1, 2]));

      gm.flipTensor(input, undefined, [true, false]);

      gm.assert(gm.tensorAssertEqual(input, expected), 'Tensors should be equal');
    });

    it('invert xz', () => {
      const input = new gm.Tensor('float32', [2, 2, 2], new Float32Array([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]));
      const expected = new gm.Tensor('float32', [2, 2, 2], new Float32Array([
        4, 3, 2, 1,
        8, 7, 6, 5,
      ]));

      gm.flipTensor(input, undefined, [false, true, true]);

      gm.assert(gm.tensorAssertEqual(input, expected), 'Tensors should be equal');
    });
  });

  describe('tensorClone', () => {
    it('typed view', () => {
      const input = new gm.Tensor('uint8', [2, 2], new Uint8Array([1, 2, 3, 4]));
      const output = new gm.Tensor('uint8', [2, 2]);

      gm.tensorClone(input, output);

      gm.assert(gm.tensorAssertEqual(output, input), 'Tensors should be equal');
    });

    it('array view', () => {
      const input = new gm.Tensor('array', [2, 2], [1, 2, 3, 4]);
      const output = new gm.Tensor('array', [2, 2]);

      gm.tensorClone(input, output);

      gm.assert(gm.tensorAssertEqual(output, input), 'Tensors should be equal');
    });
  });

  describe('tensorFrom', () => {
    it('tensor', () => {
      const input = new gm.Tensor('array', [2, 2], [1, 2, 3, 4]);

      const output = gm.tensorFrom(input);

      gm.assert(gm.assertShapesAreEqual(output, input), 'Tensor\'s shapes should be equal');
      assert.equal(output.dtype, input.dtype, 'Tensor\'s dtypes should be equal');
    });

    it('operation', () => {
      const op = new gm.RegisterOperation('Test')
        .SetShapeFn(() => [1, 2, 4])
        .Output('float32')
        .Compile({});

      const output = gm.tensorFrom(op);

      gm.assert(gm.assertShapesAreEqual(output, op), 'Tensor\'s shape should be equal to Operation\'s shape');
      assert.equal(output.dtype, op.dtype, 'Tensor\'s dtype should be equal to Operation\'s shape');
    });

    it('tensor with cast', () => {
      const input = new gm.Tensor('array', [2, 2], [1, 2, 3, 4]);

      const output = gm.tensorFrom(input, 'uint8');

      gm.assert(gm.assertShapesAreEqual(output, input), 'Tensor\'s shapes should be equal');
      assert.equal(output.dtype, 'uint8', 'Tensor\'s dtype should be changed');
    });
  });

  it('range', () => {
    const output = gm.range(3);

    assert.deepEqual(output, [0, 1, 2]);
  });

  it('tensorFromFlat', () => {
    const output = gm.tensorFromFlat([1, 2, 3], [1, 3, 4], 'float32');
    const idealOutput = new gm.Tensor('float32', [1, 3, 4], new Float32Array([
      1, 1, 1, 1,
      2, 2, 2, 2,
      3, 3, 3, 3,
    ]));

    gm.assert(gm.tensorAssertEqual(output, idealOutput), 'Tensors should be equal');
  });

  it('tensorFromFlat with specified alpha', () => {
    const output = gm.tensorFromFlat([1, 2, 3], [1, 3, 4], 'float32', 1);
    const idealOutput = new gm.Tensor('float32', [1, 3, 4], new Float32Array([
      1, 1, 1, 1,
      2, 2, 2, 1,
      3, 3, 3, 1,
    ]));

    gm.assert(gm.tensorAssertEqual(output, idealOutput), 'Tensors should be equal');
  });
});
