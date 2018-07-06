/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  const int mSize = int(KERNEL_SIZE);
  const int kSize = (mSize - 1) / 2;
  vec3 finalColour = vec3(0.0);

  for (int i=-kSize; i <= kSize; i += 1) {
    for (int j=-kSize; j <= kSize; j += 1) {
      float k = pickValue_tKernel(float(i + kSize), float(j + kSize)).a;

      finalColour += pickValue_tSrc(y + float(i), x + float(j)).rgb * k;
    }
  }

  return vec4(finalColour, 1.0);
}
