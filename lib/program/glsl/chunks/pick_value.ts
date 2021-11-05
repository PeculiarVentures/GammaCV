/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import type Operation from '../../operation';
import ENV from '../../environment';

export default function (op: Operation) {
  const inputs = Object.keys(op.input);
  const functions = [];

  for (let i = 0; i < inputs.length; i += 1) {
    const key = inputs[i];

    if (!op.input[key].shape) {
      continue;
    }
    const shape = [...op.input[key].shape];

    const w = shape[1].toFixed(1);
    const h = shape[0].toFixed(1);
    const w4 = (shape[1] * 4).toFixed(1);

    let funcBody = (type: string, name: string, selector: string) => (
      `${type} ${name}_${key}(float y, float x) {\n\treturn texture2D(${key}, vec2((x + 0.5) / ${w}, (y + 0.5) / ${h}))${selector};\n}`
    );

    if (!ENV.SUPPORTS_FLOAT_TEXTURES && op.input[key].dtype === 'float32') {
      funcBody = (type, name, selector) => `
        ${type} ${name}_${key}(float y, float x) {
          float r = decode_float(texture2D(${key}, vec2((x * 4.0 + 0.5) / ${w4}, y / ${h})));
          float g = decode_float(texture2D(${key}, vec2((x * 4.0 + 1.5) / ${w4}, y / ${h})));
          float b = decode_float(texture2D(${key}, vec2((x * 4.0 + 2.5) / ${w4}, y / ${h})));
          float a = decode_float(texture2D(${key}, vec2((x * 4.0 + 3.5) / ${w4}, y / ${h})));

          return vec4(r, g, b, a)${selector};
        }
      `;
    }

    functions.push(funcBody('vec4', 'pickValue', ''));
    functions.push(funcBody('float', 'pickScalarValue', '.x'));
  }

  return functions.join('\n');
}
