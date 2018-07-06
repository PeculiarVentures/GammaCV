/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const int w = int(W);
const int h = int(H);
const int k = int(K);
const float S = 3.0;
float A = 180.0 / 9.0; // size of channel in deg

vec4 getPixel(float y, float x) {
  float x1 = x / float(w);
  float y1 = y / float(h);

  return pickValue_tSrc(floor(y1 * uSrcHeight), floor(x1 * uSrcWidth));
}

vec4 getPixel(float y, float x, float xOffset, float yOffset) {
  float x1 = x / float(w);
  float y1 = y / float(h);

  return pickValue_tSrc(floor(y1 * uSrcHeight) + yOffset, floor(x1 * uSrcWidth) + xOffset);
}

vec4 operation(float y, float x) {
   float x1 = x / W;
   float y1 = y / H;
   float res = 0.0;
   float tmpx = x / S;
   float tmpy = y / S;
   float sum[9];
   int count = 0;

   vec4 value = getPixel(y, x);

   for (int _x = 0; _x < k; _x += 1) {
      for (int _y = 0; _y < k; _y += 1) {
        vec4 v = getPixel(y, x, float(_y), float(_x));

        float theta = abs(PI / 2.0 - v.g);
        float deg = theta * (180.0 / PI);
        int i = int(floor(deg / A));

        // if (i == 0) {
        //   sum[0] += v.r;
        // }
        if (i == 1) {
          sum[1] += v.r;
        }
        if (i == 2) {
          sum[2] += v.r;
        }
        if (i == 3) {
          sum[3] += v.r;
        }
        if (i == 4) {
          sum[4] += v.r;
        }
        if (i == 5) {
          sum[5] += v.r;
        }
        if (i == 6) {
          sum[6] += v.r;
        }
        if (i == 7) {
          sum[7] += v.r;
        }
        if (i == 8) {
          sum[8] += v.r;
        }
      }
   }

   int maxI = 0;
   float maxV = 0.0;

   for (int i = 0; i < 9; i++) {
      if (maxV < sum[i]) {
        maxI = i;
        maxV = sum[i];
      }
   }

   return vec4(maxI, maxV, 0.0, 0.0);
}
