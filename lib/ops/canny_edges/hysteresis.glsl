/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

#define STROKE uSize

vec4 operation(float y, float x) {
  vec4 M = pickValue_tSrc(y, x);
  float N = pickValue_tSrc(y + STROKE, x).r;
  float S = pickValue_tSrc(y - STROKE, x).r;
  float W = pickValue_tSrc(y, x - STROKE).r;
  float E = pickValue_tSrc(y, x + STROKE).r;

  float SE = pickValue_tSrc(y - STROKE, x + STROKE).r;
  float NW = pickValue_tSrc(y + STROKE, x - STROKE).r;

  float NE = pickValue_tSrc(y + STROKE, x + STROKE).r;
  float SW = pickValue_tSrc(y - STROKE, x - STROKE).r;
  float V = M.r;
  float H = 0.0;

  if (V > uThresholdHigh) {
    H += 1.0;
  }

  if (V > uThresholdLow && V < uThresholdHigh) {
    if (
      N > 0.0 ||
      S > 0.0 ||
      W > 0.0 ||
      E > 0.0 ||
      SE > 0.0 ||
      NW > 0.0 ||
      NE > 0.0 ||
      SW > 0.0
    ) {
      H += 1.0;
    }
  }

  if (H == 1.0) {
    return vec4(255, 255, 255, 255);
  } else {
    return vec4(0, 0, 0, 255);
  }
}
