/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const int w = int(W);
const int h = int(H);

vec4 operation(float _y, float _x) {
  float sum = 0.0;
  float mmax = 0.0;
  float maxX = 0.0;
  float maxY = 0.0;
  float sy = _y * H;
  float sx = _x * W;

  for (int x = 0; x < w; x += 1) {
    for (int y = 0; y < h; y += 1) {
      vec4 value;
      if (uWidth == uSrcWidth) {
        value = pickValue_tSrc(_y, _x);
      } else {
        value = pickValue_tSrc(float(y) + sy, float(x) + sx);
      }

      if (value.r > mmax) {
        mmax = value.r;

        if (uF == 0.0) {
          maxX = float(x) + sx;
          maxY = float(y) + sy;
        } else {
          maxX = value.g;
          maxY = value.b;
        }
      }
    }
  }

  return vec4(mmax, maxX, maxY, 255.0);
}
