import { assert } from 'chai';
import * as gm from '../../lib';

describe('Operation', () => {
  let sess;
  const testOp = tSrc => new gm.RegisterOperation('Test')
    .Input('tSrc', 'uint8')
    .Output('uint8')
    .GLSLKernel(`
      vec4 operation(float y, float x) {
        return vec4(0, 1, 0, 1);
      }
    `)
    .Compile({ tSrc });

  before(async () => {
    if (sess) {
      sess.destroy();
    }

    sess = new gm.Session();
  });

  it('create operation with name', () => {
    const opName = 'Test';
    const op = new gm.Operation(opName);

    assert.equal(op.name, `Test:${op.id}`, 'Operation name should be concatenated with it id');
  });

  it('traverse', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4]);
    const op = testOp(input);
    let numTraversedNodes = 0;

    op.traverse(() => {
      numTraversedNodes += 1;
    }, numTraversedNodes);

    assert.equal(numTraversedNodes, 2, 'Should traverse itself and input');
  });

  it('getDependencies', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4]);
    const op1 = testOp(input);
    const op2 = testOp(op1);
    const deps = op2.getDependencies();

    assert.deepEqual(deps, [op1.name, op2.name], 'should have dependent of child operation');
  });

  it('assignInput', () => {
    const a = new gm.Tensor('uint8', [1, 1, 4]);
    const b = new gm.Tensor('uint8', [1, 1, 4]);

    const op = testOp(a);
    const input1Name = a.name;

    op.assignInput('tSrc', b);

    const input2Name = op.input.tSrc.name;

    assert.notEqual(input2Name, input1Name, 'input should be reassigned');
  });

  it('clone', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4]);
    const op = testOp(input);
    const opCloned = op.clone();

    assert.notEqual(op.name, opCloned.name, 'should have different name');
    assert.notEqual(op.id, opCloned.id, 'should have different id');
    assert.equal(op.dtype, opCloned.dtype, 'should clone dtype');
    assert.equal(op.kernel, opCloned.kernel, 'should clone kernel');
    assert.deepEqual(op.chunks, opCloned.chunks, 'should clone chunks');
    assert.deepEqual(op.uniform, opCloned.uniform, 'should clone chunks');
    assert.deepEqual(op.constant, opCloned.constant, 'should clone chunks');
  });

  it('init', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4]);
    const op = testOp(input);

    sess.init(op);

    // TODO: More concretic needed
    assert.isTrue(op.isInitialized, 'should be initialized by session');
  });

  it('able to run in sess', () => {
    const input = new gm.Tensor('uint8', [1, 1, 4]);
    const op = testOp(input);
    const out = gm.tensorFrom(op);

    sess.init(op);

    sess.runOp(op, 0, out);

    // make sure kernel works
    assert.equal(out.data[0], 0, 'should be 0');
    assert.equal(out.data[1], 255, 'should be 255');
    assert.equal(out.data[2], 0, 'should be 0');
    assert.equal(out.data[3], 255, 'should be 255');
  });

  it('able to run op wit media input', () => {
    const input = new gm.MediaInput(document.createElement('video'), [1, 1, 4]);
    const op = testOp(input);
    const out = gm.tensorFrom(op);

    sess.init(op);

    sess.runOp(op, 0, out);

    // make sure kernel works
    assert.equal(out.data[0], 0, 'should be 0');
    assert.equal(out.data[1], 255, 'should be 255');
    assert.equal(out.data[2], 0, 'should be 0');
    assert.equal(out.data[3], 255, 'should be 255');
  });
});
