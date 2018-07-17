/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */


float HKW = KW / 2.0;
float HKH = KW / 2.0;

vec4 operation(float y, float x) {
  float value = 10000.0;

  y = y + HKH;
  x = x + HKW;

  for (float dx = 0.0; dx < KW; dx += SW) {
    for (float dy = 0.0; dy < KH; dy += SH) {
      float v = pickValue_tSrc((y - dy), (x - dx)).r;


      if (v < value) {
        value = v;
      }
    }
  }

	return vec4(value, value, value, 1.0);
}