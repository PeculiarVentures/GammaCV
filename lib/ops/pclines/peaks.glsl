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
  float mmax = 0.0;
  float maxX = 0.0;
  float maxY = 0.0;
  float sy = _y * H;
  float sx = _x * W;
  float yLimit = O_HEIGHT - sy;
  float xLimit = O_WIDTH - sx;
  vec4 value;

  for (float y = 0.0; y < H; y += 1.0) {
    if (y >= yLimit) {
      break;
    }
    for (float x = 0.0; x < W; x += 1.0) {
      if (x >= xLimit) {
        break;
      }
      value = pickValue_tSrc(y + sy, x + sx);

      if (value.r >= mmax) {
        mmax = value.r;

        if (uF < 0.5) {
          maxX = x + sx;
          maxY = y + sy;
        } else {
          maxX = value.g;
          maxY = value.b;
        }
      }
    }
  }

  return vec4(mmax, maxX, maxY, 255.0);
}
