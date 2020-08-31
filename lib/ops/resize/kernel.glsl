/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  vec4 value = vec4(0.0);

  for (float dx = 0.0; dx < ceil(H); dx += 1.0) {
    for (float dy = 0.0; dy < ceil(W); dy += 1.0) {
      vec4 v = pickValue_tSrc((y * H) + dy, (x * W) + dx);

      if (S == 0.0) {
        value = v;
      }

      if (S == 1.0) {
        value += v;
      }
    }
  }

  if (S == 1.0) {
    value /= W * H;
  }

	return value;
}
