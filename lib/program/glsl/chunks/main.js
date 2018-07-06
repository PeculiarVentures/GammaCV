/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import ENV from '../../environment';

export default function (op) {
  let code = `
void main(void) {
  vec2 coords = gl_FragCoord.xy - 0.5;
  vec4 result = operation(coords.y, coords.x);

  gl_FragColor = result;
}
  `;

  if (!ENV.SUPPORTS_FLOAT_TEXTURES && op.dtype === 'float32') {
    code = `
    void main(void) {
      vec2 coords = gl_FragCoord.xy;

      highp float ox = floor(coords.x / 4.0);
      float dx = floor(coords.x - ox * 4.0 + 0.5);
    
      vec4 result = operation(coords.y - 0.5, floor((coords.x - 0.5) / 4.0));

      float value;

      if (dx == 1.0) {
        value = result.r;
      } else if (dx == 2.0) {
        value = result.g;
      } else if (dx == 3.0) {
        value = result.b;
      } else if (dx == 4.0) {
        value = result.a;
      }
    
      gl_FragColor = encode_float(value);
    }
    `;
  }

  return code;
}
