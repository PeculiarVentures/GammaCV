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
 float size = KX * KY;

 vec3 std = vec3(0.0, 0.0, 0.0);
 vec3 mean = pickValue_tMean(0.0, 0.0).rgb;

  for (int y = 0; y < ky; y += 1) {
    for (int x = 0; x < kx; x += 1) {
      vec3 value = pickValue_tSrc(gly * KY + float(y), glx * KX + float(x)).rgb;
      std += (value - mean) * (value - mean);
    }
  }

  std /= size;
  std = sqrt(std);

  if (std.r == 0.0) {
    std.r = 255.0;
  }

  if (std.g == 0.0) {
    std.g = 255.0;
  }

  if (std.b == 0.0) {
    std.b = 255.0;
  }

  return vec4(std, 255.0);
}
