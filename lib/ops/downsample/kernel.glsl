/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  
  for (float dx = 0.0; dx < K; dx += 1.0) {
    for (float dy = 0.0; dy < K; dy += 1.0) {
      vec4 v = pickValue_tSrc((y * K) - dy, (x * K) - dx);

      if (S == 0.0) {
        r = v.r;
        g = v.g;
        b = v.b;
      } 

      if (S == 1.0) {
        r += v.r;
        g += v.g;
        b += v.b;
      } 
    }
  }

  if (S == 1.0) {
    r /= K * K;
    g /= K * K;
    b /= K * K;
  } 

	return vec4(r, g, b, 1.0);
}
