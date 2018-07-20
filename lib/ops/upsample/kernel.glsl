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
    // Nearest neighbor
    value = pickValue_tSrc(floor(y / K), floor(x / K));
  } else {
    // Linear
    float _y = y / K - 0.501; // 501 to fix calculations for K=2,4...
    float _x = x / K - 0.501;
    float fy = floor(_y);
    float fx = floor(_x);
    float cy = ceil(_y);
    float cx = ceil(_x);
    float dcy = cy - _y;
    float dcx = cx - _x;
    float dfy = _y - fy;
    float dfx = _x - fx;

    value = pickValue_tSrc(fy, fx) * (dcy * dcx)
    + pickValue_tSrc(cy, fx) * (dfy * dcx)
    + pickValue_tSrc(cy, cx) * (dfy * dfx)
    + pickValue_tSrc(fy, cx) * (dcy * dfx);
  }

	return value;
}
