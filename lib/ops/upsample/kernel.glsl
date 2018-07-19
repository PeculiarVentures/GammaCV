/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  vec4 value;
  
  if (S == 0.0) {
    value = pickValue_tSrc(floor(y / K), floor(x / K));
  } else {
    float _y = y / K;
    float _x = x / K;
    float fy = floor(_y);
    float fx = floor(_x);
    float cy = ceil(_y);
    float cx = ceil(_x);

    value = (pickValue_tSrc(fy, fx) + pickValue_tSrc(cy, cx) + pickValue_tSrc(cy, fx) + pickValue_tSrc(fy, cx)) / 4.0;
  }

	return value;
}
