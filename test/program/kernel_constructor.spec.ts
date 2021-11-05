import { assert } from 'chai';
import { setEnv, setSourceEnv } from '../../lib/program/environment';
import kernelConstructor from '../../lib/program/kernel_constructor';
import * as gm from '../../lib';

describe('GLSL Kernel Constructor', () => {
  after(() => setSourceEnv('SUPPORTS_FLOAT_TEXTURES'));

  it('Do not mutate kernel with void main(void)', () => {
    const kernel = `
      void main(void) {}
    `;
    const op = new gm.RegisterOperation('Test')
      .GLSLKernel(kernel)
      .Compile({});

    const output = kernelConstructor(op);

    assert.equal(output, kernel, 'Kernel source with main should not be changed');
  });

  it('Default for supported textures', () => {
    setEnv('SUPPORTS_FLOAT_TEXTURES', true);
    const kernel = 'vec4 operation(float y, float x) { return vec4(0.0); }';
    const op = new gm.RegisterOperation('Test')
      .GLSLKernel(kernel)
      .Compile({});

    const output = kernelConstructor(op);

    const targetOutput = 'precision highp float;\nvarying vec2 texCoords;\n\n\n\n\nvec4 operation(float y, float x) { return vec4(0.0); }\n\n\nvoid main(void) {\n  vec2 coords = gl_FragCoord.xy - 0.5;\n  vec4 result = operation(coords.y, coords.x);\n\n  gl_FragColor = result;\n}\n  ';

    assert.equal(output, targetOutput, 'When operation is passed in kernel, precision, texCoords and main should be added');
  });

  it('LoadChunk pickValue', () => {
    setEnv('SUPPORTS_FLOAT_TEXTURES', true);
    const kernel = 'vec4 operation(float y, float x) { return vec4(0.0); }';
    const input = new gm.Tensor('uint8', [2, 2, 4]);
    const input2 = new gm.Tensor('float32', [10, 2, 4]);
    const op = new gm.RegisterOperation('Test')
      .Input('tSrc', 'uint8')
      .Input('tSrc2', 'float32')
      .LoadChunk('pickValue')
      .GLSLKernel(kernel)
      .Compile({ tSrc: input, tSrc2: input2 });

    const output = kernelConstructor(op);

    const targetOutput = 'precision highp float;\nuniform sampler2D tSrc;\nuniform sampler2D tSrc2;\nvarying vec2 texCoords;\n\n\n/*--------- Chunk pickValue ---------*/\nvec4 pickValue_tSrc(float y, float x) {\n\treturn texture2D(tSrc, vec2((x + 0.5) / 2.0, (y + 0.5) / 2.0));\n}\nfloat pickScalarValue_tSrc(float y, float x) {\n\treturn texture2D(tSrc, vec2((x + 0.5) / 2.0, (y + 0.5) / 2.0)).x;\n}\nvec4 pickValue_tSrc2(float y, float x) {\n\treturn texture2D(tSrc2, vec2((x + 0.5) / 2.0, (y + 0.5) / 10.0));\n}\nfloat pickScalarValue_tSrc2(float y, float x) {\n\treturn texture2D(tSrc2, vec2((x + 0.5) / 2.0, (y + 0.5) / 10.0)).x;\n}\n/*-----------------------------------*/\n\nvec4 operation(float y, float x) { return vec4(0.0); }\n\n\nvoid main(void) {\n  vec2 coords = gl_FragCoord.xy - 0.5;\n  vec4 result = operation(coords.y, coords.x);\n\n  gl_FragColor = result;\n}\n  ';

    assert.equal(output, targetOutput, 'When pickValue chunk loaded, pickValue functions should be generated for each input');
  });

  it('Floats polyfill', () => {
    setEnv('SUPPORTS_FLOAT_TEXTURES', false);
    const kernel = 'vec4 operation(float y, float x) { return vec4(0.0); }';
    const input = new gm.Tensor('float32', [2, 2, 4]);
    const op = new gm.RegisterOperation('Test')
      .Input('tSrc', 'float32')
      .LoadChunk('pickValue')
      .GLSLKernel(kernel)
      .Compile({ tSrc: input });

    const output = kernelConstructor(op);

    assert.isTrue(/Chunk float/.test(output), 'When rendering to float is not supported, it should be polydilled in main and pickValue');
  });
});
