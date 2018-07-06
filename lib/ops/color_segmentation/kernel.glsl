/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const float _step = 1.0 / CLUSTERS;

vec4 operation(float y, float x) {
  float minDistance = 256.0;
  float label = 0.0;
  vec3 value = pickValue_tSrc(y, x).rgb;

  for (int i = 0; i < int(CLUSTERS); i += 1) {
    vec3 curr = pickValue_tCentroids(float(i), 0.0).rgb;
    float distance = sqrt(((value.r - curr.r) * (value.r - curr.r)));

    if (distance < minDistance) {
      minDistance = distance;
      label = float(i) / CLUSTERS;
    }
  }

  return vec4(label, label, label, 1.0);
}
