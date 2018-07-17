/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const int mWidth = int(KERNEL_WIDTH);
const int hWidth = (mWidth - 1) / 2;
const int wHeight = int(KERNEL_HEIGHT);
const int hHeight = (wHeight - 1) / 2;

vec4 operation(float y, float x) {
  vec3 finalColour = vec3(0.0);

  for (int dy=-hHeight; dy <= hHeight; dy += 1) {
    for (int dx=-hWidth; dx <= hWidth; dx += 1) {
      float k = pickValue_tKernel(float(dy + hHeight), float(dx + hWidth)).a;

      finalColour += pickValue_tSrc(y * Y_STEP + float(dy), x * X_STEP + float(dx)).rgb * k;
    }
  }

  return vec4(finalColour, 1.0);
}
