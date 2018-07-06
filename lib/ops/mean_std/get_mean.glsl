/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const int kx = int(KX);
const int ky = int(KY);
const int w = int(WIDTH);
const int h = int(HEIGHT);

vec4 operation(float gly, float glx) {
 float size = KY * KX;
 float mean = 0.0;
 float std = 0.0;

 vec3 color = vec3(0.0, 0.0, 0.0);

  for (int y = 0; y < ky; y += 1) {
    for (int x = 0; x < kx; x += 1) {
      vec3 value = pickValue_tSrc(gly * KY + float(y), glx * KX + float(x)).rgb;
      color += value.rgb;
    }
  }

  color /= size;

  mean = color.r;

  for (int y = 0; y < ky; y += 1) {
    for (int x = 0; x < kx; x += 1) {
      vec3 value = pickValue_tSrc(gly * KY + float(y), glx * KX + float(x)).rgb;
      std += (value.r - mean) * (value.r - mean);
    }
  }

  std /= size;
  std = sqrt(std);

  if (std == 0.0) {
    std = 1.0;
  }

  return vec4(color, 255.0);
}
