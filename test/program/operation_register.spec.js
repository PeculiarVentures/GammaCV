import { assert } from 'chai';
import * as gm from '../../lib';

describe('Operation register', () => {
  it('Create with name', () => {
    const input = new gm.RegisterOperation('Operation name');

    assert.instanceOf(input, gm.RegisterOperation);
    assert.equal(input.name, 'Operation name', 'Instance should have the name provided in constructor');
  });

  it('Compile', () => {
    const op = new gm.RegisterOperation('Operation name')
      .Compile({});

    assert.instanceOf(op, gm.Operation, 'Compile should returns Operation instance');
  });

  it('Input', () => {
    const inputTensor = new gm.Tensor('uint8', [1, 1, 4]);
    const op = new gm.RegisterOperation('Operation name')
      .Input('inputTensor', 'uint8')
      .Compile({ inputTensor });

    assert.equal(op.input.inputTensor, inputTensor, 'Input method should append input tensor into operation');
  });

  it('Multiple Input', () => {
    const inputTensor = new gm.Tensor('uint8', [1, 1, 4]);
    const inputTensor2 = new gm.Tensor('float32', [1, 1, 4]);
    const op = new gm.RegisterOperation('Operation name')
      .Input('inputTensor', 'uint8')
      .Input('inputTensor2', 'float32')
      .Compile({ inputTensor, inputTensor2 });

    assert.equal(op.input.inputTensor, inputTensor, 'Input method should append input tensor into operation');
    assert.equal(op.input.inputTensor2, inputTensor2, 'Input method should append input tensor into operation');
  });

  it('Output', () => {
    const op = new gm.RegisterOperation('Operation name')
      .Output('float32')
      .Compile({});

    assert.equal(op.dtype, 'float32', 'Output should append dtype to result operation');
  });

  it('Output error', () => {
    const test = () => new gm.RegisterOperation('Operation name')
      .Output('float32')
      .Output('uint8')
      .Compile({});

    assert.throw(test, Error, 'RegisterOperation: The operation allows a single output.');
  });

  it('SetShapeFn', () => {
    const op = new gm.RegisterOperation('Operation name')
      .SetShapeFn(() => [3, 3, 4])
      .Compile({});

    assert.deepEqual(op.shape, [3, 3, 4], 'Should set operation output shape');
  });

  it('GLSLKernel', () => {
    const input = 'vec4 operation(float y, float x) { return vec4(0.0, 0.0, 0.0, 0.0) }';
    const op = new gm.RegisterOperation('Operation name')
      .GLSLKernel(input)
      .Compile({});

    assert.deepEqual(op.kernel, input, 'Should set operation kernel');
  });

  it('Uniform', () => {
    const op = new gm.RegisterOperation('Operation name')
      .Uniform('uName', 'float32', 0.0)
      .Uniform('uVec', 'vec2', 'vec2(0.0, 1.0)')
      .Compile({});

    assert.deepEqual(op.uniform, {
      uName: { name: 'uName', dtype: 'float32', defaultValue: 0 },
      uVec: { name: 'uVec', dtype: 'vec2', defaultValue: 'vec2(0.0, 1.0)' },
    }, 'Should set operation uniform');
  });

  it('Constant', () => {
    const op = new gm.RegisterOperation('Operation name')
      .Constant('INT', 1)
      .Constant('FLOAT', 1.3)
      .Constant('VECTOR', 'vec3(0.0, 0.0, 0.0)')
      .Constant('MAT', 'mat2(0.0)')
      .Compile({});

    assert.deepEqual(op.constant, {
      INT: 1,
      FLOAT: 1.3,
      VECTOR: 'vec3(0.0, 0.0, 0.0)',
      MAT: 'mat2(0.0)',
    }, 'Should set operation constant');
  });

  it('preCompile', () => {
    let callCount = 0;
    let calledWith;

    const callback = (arg) => {
      callCount += 1;
      calledWith = arg;
    };

    const op = new gm.RegisterOperation('Operation name')
      .PreCompile(callback)
      .Compile({});

    assert.equal(callCount, 1, 'Should be colled during Compile just once');
    assert.instanceOf(calledWith, gm.Operation, 'Should be called with operation');
    assert.equal(calledWith, op, 'Should be called with same operation as returned from Compile');
  });

  describe('input validation', () => {
    it('Input name argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').Input('_asd', 'float32'), Error);
      assert.throw(() => new gm.RegisterOperation('Operation name').Input('asd!2', 'float32'), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').Input('S', 'float32'), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').Input('asd', 'float32'), Error);
    });

    it('Constant name argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').Constant('_asd', 13), Error);
      assert.throw(() => new gm.RegisterOperation('Operation name').Constant('asd!2', 13), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').Constant('asd', 13), Error);
    });

    it('Uniform name argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').Uniform('_asd', 'float32', 13), Error);
      assert.throw(() => new gm.RegisterOperation('Operation name').Uniform('asd!2', 'float32', 13), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').Uniform('asd', 'float32', 13), Error);
    });

    it('SetShapeFn callback argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').SetShapeFn(13), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').SetShapeFn(() => [1]), Error);
    });

    it('SetShapeFn callback argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').SetShapeFn(13), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').SetShapeFn(() => [1]), Error);
    });

    it('PreCompile callback argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').PreCompile(13), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').PreCompile(() => [1]), Error);
    });

    it('PostCompile callback argument', () => {
      assert.throw(() => new gm.RegisterOperation('Operation name').PostCompile(13), Error);
      assert.doesNotThrow(() => new gm.RegisterOperation('Operation name').PostCompile(() => [1]), Error);
    });
  });

  describe('LoadChunk', () => {
    it('invalid', () => {
      assert.throws(() => new gm.RegisterOperation('Operation name')
        .LoadChunk('Something that not supported')
        .Compile({}), Error);
    });

    it('pickCurrentValue', () => {
      const op = new gm.RegisterOperation('Operation name')
        .LoadChunk('pickCurrentValue')
        .Compile({});

      assert.deepEqual(op.chunks, ['pickCurrentValue']);
    });

    it('multiple chunks', () => {
      const op = new gm.RegisterOperation('Operation name')
        .LoadChunk('pickValue')
        .LoadChunk('pickCurrentValue')
        .Compile({});

      assert.deepEqual(op.chunks, ['pickValue', 'pickCurrentValue']);
    });
  });
});
