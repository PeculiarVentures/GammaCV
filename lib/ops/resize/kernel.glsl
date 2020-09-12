/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float j, float i) {
  float x = floor(i * TX);
  float y = floor(j * TY);

  // nearest
  if (S == 0.0) {
    return pickValue_tSrc(y, x);
  }

  // bicubic
  if (S == 1.0) {
    float dx = floor(TX * i) - x;
    float dy = floor(TY * j) - y;

    vec4 C[4];

    for (float jj = 0.0; jj <= 3.0; jj += 1.0) {
      vec4 d0 = pickValue_tSrc(y - 1.0 + jj, x - 1.0) - pickValue_tSrc(y - 1.0 + jj, x);
      vec4 d2 = pickValue_tSrc(y - 1.0 + jj, x + 1.0) - pickValue_tSrc(y - 1.0 + jj, x);
      vec4 d3 = pickValue_tSrc(y - 1.0 + jj, x + 2.0) - pickValue_tSrc(y - 1.0 + jj, x);
      vec4 a0 = pickValue_tSrc(y - 1.0 + jj, x);
      vec4 a1 = -1.0 / 3.0 * d0 + d2 - 1.0 / 6.0 * d3;
      vec4 a2 = 1.0 / 2.0 * d0 + 1.0 / 2.0 * d2;
      vec4 a3 = -1.0 / 6.0 * d0 + 1.0 / 2.0 * d2 + 1.0 / 6.0 * d3;

      C[int(jj)] = a0 + a1 * dx + a2 * dx * dx + a3 * dx * dx * dx;
    }

    vec4 d0 = C[0] - C[1];
    vec4 d2 = C[2] - C[1];
    vec4 d3 = C[3] - C[1];
    vec4 a0 = C[1];

    vec4 a1 = -1.0 / 3.0 * d0 + d2 - 1.0 / 6.0 * d3;
    vec4 a2 = 1.0 / 2.0 * d0 + 1.0 / 2.0 * d2;
    vec4 a3 = -1.0 / 6.0 * d0 - 1.0 / 2.0 * d2 + 1.0 / 6.0 * d3;

    vec4 Cc = a0 + a1 * dy + a2 * dy * dy + a3 * dy * dy  * dy;

    return Cc;
  }
}
