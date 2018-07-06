/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

float A = 180.0 / 9.0; // size of channel in deg
float S = 3.0;

vec4 operation(float y, float x) {
  float my = y - (S * floor(y / S));
  float mx = x - (S * floor(x / S));

  x = x / S;
  y = y / S;
  float index = mx + (my * S);

  float sum = 0.0;

  for (float dx = 0.0; dx < K; dx += 1.0) {
    for (float dy = 0.0; dy < K; dy += 1.0) {
      vec4 v = pickValue_tSrc(((y * K) + dy), ((x * K) + dx));

        float theta = abs(PI / 2.0 - v.g);
        float deg = theta * (180.0 / PI);
        float i = floor(deg / A);

      if (i == index) {
        sum += v.r;
      }
    }
  }

   float rad = (index / 9.0 * PI);

   return vec4(sum, rad, 0.0, 0.0);
}
