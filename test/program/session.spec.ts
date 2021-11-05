import { assert } from 'chai';
import * as gm from '../../lib';

describe('Session', () => {
  const multScaalarOp = (tSrc: InputType, scalar: number) => new gm.RegisterOperation('Mult2')
    .Input('tSrc', 'float32')
    .Output('float32')
    .Uniform('S', 'float', scalar)
    .LoadChunk('pickValue')
    .GLSLKernel(`
      vec4 operation(float y, float x) {
        return pickValue_tSrc(y, x) * S;
      }
    `)
    .Compile({ tSrc });
  const matMultOp = (tA: InputType, tB: InputType) => new gm.RegisterOperation('MatMult')
    .Input('tA', 'float32')
    .Input('tB', 'float32')
    .Output('float32')
    .LoadChunk('pickValue')
    .GLSLKernel(`
      vec4 operation(float y, float x) {
        return pickValue_tA(y, x) * pickValue_tB(y, x);
      }
    `)
    .Compile({ tA, tB });
  let sess: gm.Session = null;

  beforeEach(async () => {
    if (sess) {
      // flush prev session of it was existed
      sess.destroy();
    }

    sess = new gm.Session();
  });

  afterEach(() => {
    if (sess) {
      sess.destroy();
      sess = null;
    }
  });

  it('create session', () => {
    assert.deepEqual((sess as any).operation, {});
    assert.deepEqual(sess.texture, {});
    assert.equal((sess as any).textureCount, 0);
  });

  it('init operation and add to session operations', () => {
    const input = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const op = multScaalarOp(input, 2);

    sess.init(op);

    assert.equal((sess as any).operation[op.name], op);
  });

  it('init operation and create textures', () => {
    const input = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const op = multScaalarOp(input, 2);

    sess.init(op);

    assert.equal((sess as any).operation[op.name], op);
  });

  it('init operation and create textures', () => {
    const input = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const op = multScaalarOp(input, 2);

    sess.init(op);

    assert.equal((sess as any).textureCount, 2, 'input and output textures should be created');
    assert.instanceOf(sess.texture[input.name], gm.GLTexture, 'should create texture for input of op');
    assert.instanceOf(sess.texture[op.name], gm.GLTexture, 'should create texture for output of op');
    assert.isTrue(gm.assertShapesAreEqual((sess as any).texture[input.name], input), 'size of existed textures should be compatible');
    assert.isTrue(gm.assertShapesAreEqual((sess as any).texture[op.name], op), 'size of existed textures should be compatible');
  });

  it('run operation', () => {
    const input = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const op = multScaalarOp(input, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 2, 0, 2])),
    ));
  });

  it('run op with tensor output', () => {
    const input = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    let pipeline;

    pipeline = multScaalarOp(input, 2);
    pipeline = multScaalarOp(pipeline, 2);

    const out = gm.tensorFrom(pipeline);

    sess.init(pipeline);
    sess.runOp(pipeline, 0, out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 4, 0, 4])),
    ));
  });

  it('run op with canvas output', () => {
    const input = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 0.25, 0, 0.25]));
    let pipeline;

    pipeline = multScaalarOp(input, 2);
    pipeline = multScaalarOp(pipeline, 2);

    const out = document.createElement('canvas');
    const outCtx = out.getContext('2d');

    sess.init(pipeline);
    sess.runOp(pipeline, 0, out);

    const pixels = outCtx.getImageData(0, 0, 1, 1).data;

    assert.equal(pixels[0], 0);
    assert.equal(pixels[1], 255);
    assert.equal(pixels[2], 0);
    assert.equal(pixels[3], 255);
  });

  it('run multiple input node', () => {
    const a = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const b = new gm.Tensor('float32', [1, 1, 4], new Float32Array([1, 2, 3, 4]));

    const op = matMultOp(a, b);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(gm.tensorAssertEqual(
      out,
      new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 2, 0, 4])),
    ));
  });

  it('run operation with different context', () => {
    const a = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const b = new gm.Tensor('float32', [1, 1, 4], new Float32Array([1, 2, 3, 4]));

    const op = multScaalarOp(a, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 2, 0, 2])),
      ),
      'should equal before second run',
    );

    op.assignInput('tSrc', b);

    sess.init(b as any);
    sess.runOp(op, 1, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([2, 4, 6, 8])),
      ),
      'should equal after second run',
    );
  });

  it('run operation with different context', () => {
    const a = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const b = new gm.Tensor('float32', [1, 1, 4], new Float32Array([1, 2, 3, 4]));

    const op = multScaalarOp(a, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 2, 0, 2])),
      ),
      'should equal before second run',
    );

    op.assignInput('tSrc', b);

    sess.init(b as any);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 2, 0, 2])),
      ),
      'should equal after second run',
    );
  });

  it('run pipeline with same context', () => {
    const a = new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 1, 0, 1]));
    const b = new gm.Tensor('float32', [1, 1, 4], new Float32Array([1, 2, 3, 4]));

    const input = multScaalarOp(a, 2);
    const op = multScaalarOp(input, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 4, 0, 4])),
      ),
      'should equal before second run',
    );

    op.assignInput('tSrc', b);

    sess.init(b as any);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([0, 4, 0, 4])),
      ),
      'should equal after second run',
    );
  });

  it('run graph with same context and cache disabled in middle of graph', () => {
    const inputA = new gm.Tensor('float32', [1, 1, 4], new Float32Array([1, 2, 3, 4]));
    const inputB = new gm.Tensor('float32', [1, 1, 4], new Float32Array([2, 2, 2, 2]));

    const product = matMultOp(inputA, inputB);
    const stage = multScaalarOp(product, 2);
    const op = multScaalarOp(stage, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([8, 16, 24, 32])),
      ),
      'should equal before second run',
    );

    product.cache = false;

    inputB.data[0] = 3;
    inputB.data[1] = 3;
    inputB.data[2] = 3;
    inputB.data[3] = 3;

    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([12, 24, 36, 48])),
      ),
      'should equal after second run',
    );
  });

  it('run graph with different context', () => {
    const inputA = new gm.Tensor('float32', [1, 1, 4], new Float32Array([1, 2, 3, 4]));
    const inputB = new gm.Tensor('float32', [1, 1, 4], new Float32Array([2, 2, 2, 2]));

    const product = matMultOp(inputA, inputB);
    const stage = multScaalarOp(product, 2);
    const op = multScaalarOp(stage, 2);
    const out = gm.tensorFrom(op);

    sess.init(op);
    sess.runOp(op, 0, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([8, 16, 24, 32])),
      ),
      'should equal before second run',
    );

    inputB.data[0] = 3;
    inputB.data[1] = 3;
    inputB.data[2] = 3;
    inputB.data[3] = 3;

    sess.runOp(op, 1, out);

    assert.isTrue(
      gm.tensorAssertEqual(
        out,
        new gm.Tensor('float32', [1, 1, 4], new Float32Array([12, 24, 36, 48])),
      ),
      'should equal after second run',
    );
  });
});
