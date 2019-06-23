/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  vec4 value = vec4(0.0);
  
  for (float dx = 0.0; dx < K; dx += 1.0) {
    for (float dy = 0.0; dy < K; dy += 1.0) {
      vec4 v = pickValue_tSrc((y * K) + dy, (x * K) + dx);

      if (S == 0.0) {
        value = v;
      } 

      if (S == 1.0) {
        value += v;
      } 
    }
  }

  if (S == 1.0) {
    value /= K * K;
  } 

	return value;
}
