/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const int kx = int(KX);
const int ky = int(KY);

vec4 operation(float gly, float iglx) {
  float size = KX * KY;
  float glx = floor(iglx / COUNT);
  float currentIndex = iglx - (glx * COUNT);

  vec4 count = vec4(0.0);

  for (int y = 0; y < ky; y += 1) {
    for (int x = 0; x < kx; x += 1) {
      count += pickValue_tSrc(gly * KY + float(y), (glx * KX + float(x)) * COUNT + currentIndex);
    }
  }

  return count;
}
