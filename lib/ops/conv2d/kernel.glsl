/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const float hWidth = (KERNEL_WIDTH - 1.0) / 2.0;
const float hHeight = (KERNEL_HEIGHT - 1.0) / 2.0;

vec4 operation(float y, float x) {
  vec3 finalColour = vec3(0.0);

  for (float dy=-hHeight; dy <= hHeight; dy += 1.0) {
    for (float dx=-hWidth; dx <= hWidth; dx += 1.0) {
      vec3 k = pickValue_tKernel(float(dy + hHeight), float(dx + hWidth)).rgb;

      finalColour += pickValue_tSrc(y + dy, x + dx).rgb * k;
    }
  }

  return vec4(finalColour * factor + bias, 1.0);
}
