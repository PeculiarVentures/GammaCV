/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */


float HKW = floor(KW / 2.0);
float HKH = floor(KW / 2.0);

vec4 operation(float y, float x) {
  float value = 10000.0;

  y = y + HKH;
  x = x + HKW;

  for (float dx = 0.0; dx < KW; dx += 1.0) {
    for (float dy = 0.0; dy < KH; dy += 1.0) {
      float v = pickValue_tSrc((y - dy), (x - dx)).r;
      float m = pickValue_tKernel(dy, dx).r;

      if (v < value && m > 0.0) {
        value = v;
      }
    }
  }

	return vec4(value, value, value, 1.0);
}