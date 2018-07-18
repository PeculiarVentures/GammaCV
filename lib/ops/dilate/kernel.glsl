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
  float R = 0.0;
  float G = 0.0;
  float B = 0.0;

  y = y + HKH;
  x = x + HKW;
 
  for (float dx = 0.0; dx < KW; dx += 1.0) {
    for (float dy = 0.0; dy < KH; dy += 1.0) {
      vec4 v = pickValue_tSrc((y - dy), (x - dx));
      vec4 m = pickValue_tKernel(dy, dx);

      if (v.r > R && m.r > 0.0) {
        R = v.r;
      }

      if (v.g > G && m.g > 0.0) {
        G = v.g;
      }

      if (v.b > B && m.b > 0.0) {
        B = v.b;
      }
    }
  }

	return vec4(R, G, B, 1.0);
}
