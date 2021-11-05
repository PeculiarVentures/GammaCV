import { assert } from 'chai';
import * as gm from '../lib';

describe('Utils: ', () => {
  it('assert should not throw error', () => {
    assert.doesNotThrow(() => gm.assert(true, 'err message'), 'err message');
  });

  it('assert should throw error', () => {
    assert.throws(() => gm.assert(false, 'err message'), 'err message');
  });

  it('assertShapesAreEqual', () => {
    const a = new gm.Tensor('float32', [3]);
    const b = new gm.Tensor('float32', [3]);
    const c = new gm.Tensor('float32', [3, 1]);

    assert.isTrue(gm.assertShapesAreEqual(a, b), 'Tensor shapes actually are equal');
    assert.isFalse(gm.assertShapesAreEqual(a, c), 'Tensor shapes actually are not equal');
  });

  it('tensorAssertCloseEqual', () => {
    const a = new gm.Tensor('uint8', [3], new Uint8Array([0, 1, 2]));
    const b = new gm.Tensor('uint8', [3], new Uint8Array([0, 1, 1]));
    const c = new gm.Tensor('uint8', [3], new Uint8Array([3, 1, 2]));

    assert.isTrue(gm.tensorAssertCloseEqual(a, b, 1), 'Tensors actually are close equal');
    assert.isFalse(gm.tensorAssertCloseEqual(a, c, 1), 'Tensors actually are not close equal');
  });

  it('tensorAssertEqual', () => {
    const a = new gm.Tensor('uint8', [3], new Uint8Array([0, 1, 2]));
    const b = new gm.Tensor('uint8', [3], new Uint8Array([0, 1, 2]));
    const c = new gm.Tensor('uint8', [3], new Uint8Array([1, 1, 2]));

    assert.isTrue(gm.tensorAssertEqual(a, b), 'Tensors actually are equal');
    assert.isFalse(gm.tensorAssertEqual(a, c), 'Tensors actually are not equal');
  });

  it('isTensor', () => {
    const a = new gm.Tensor('float32', [3]);
    const b = new gm.Operation('Test');
    const c = 'str';

    assert.isTrue(gm.isTensor(a), 'It actually a tensor');
    assert.isFalse(gm.isTensor(b), 'It actually is not a tensor');
    assert.isFalse(gm.isTensor(c), 'It actually is not a tensor');
  });

  it('isOperation', () => {
    const a = new gm.Operation('Test');
    const b = new gm.Tensor('float32', [3]);
    const c = 'str';

    assert.isTrue(gm.isOperation(a), 'It actually an operation');
    assert.isFalse(gm.isOperation(b), 'It actually is not an operation');
    assert.isFalse(gm.isOperation(c), 'It actually is not an operation');
  });

  it('isValidShape', () => {
    assert.isFalse(gm.isValidShape([]), 'Shape should be at least 1d');
    assert.isFalse(gm.isValidShape([1.5, 5]), 'All components of shaped should be integers');
    assert.isTrue(gm.isValidShape([3, 3, 4]), 'Valid shape');
  });

  it('isValidGLSLVariableName', () => {
    assert.isFalse(gm.isValidGLSLVariableName('_a'), 'Variable name started with \'_\' are not supported');
    assert.isFalse(gm.isValidGLSLVariableName('S!d.sd'), 'Variable name shouldn\'t contain special characters');
    assert.isTrue(gm.isValidGLSLVariableName('S'), 'Single character are allowed');
    assert.isTrue(gm.isValidGLSLVariableName('sFdaFdf'), 'Valid variable name');
  });

  it('getCanvas', () => {
    assert.instanceOf(gm.getCanvas(), HTMLCanvasElement, 'Should return HTML Canvas Element in browser env');
  });

  it('getImage', () => {
    assert.instanceOf(gm.getImage(), HTMLImageElement, 'Should return HTML Image Element in browser env');
  });

  it('getVideo', () => {
    assert.instanceOf(gm.getVideo(), HTMLVideoElement, 'Should return HTML Video Element in browser env');
  });

  it('assertDOMFeature', () => {
    assert.doesNotThrow(() => gm.assertCreateElement('canvas'), 'Should not throw an error for document.createElement in browser env.');
    assert.doesNotThrow(() => gm.assertQuerySelector(), 'Should not throw an error for document.querySelector in browser env.');
    assert.throw(() => gm.assertDOMFeature(false, 'Unexisted'), 'DOMFeature not supported, "Unexisted" is not supported in current environment');
  });
});
