/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  vec4 res = pickValue_tSrc(y, x);
  res = res * res;
  vec4 v = vec4(0.0);

  for (float I = 1.0; I <= SAMPLES_PER_PASS; I += 1.0) {
    float cx = x - ceil(pow(1.0 + SAMPLES_PER_PASS, PASSI) * I);

    if (cx < 0.0) {
      break;
    }

    v = pickValue_tSrc(y, cx);
    res += v * v;
  }

  return res;
}
