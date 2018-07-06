/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const float norm = 1.0 / (OUT_VIEW.x * OUT_VIEW.y);

vec4 operation(float y, float x) {
  vec4 histBase = pickValue_tSrc(y, x) * 255.0;
  float r = pickValue_tHist(0.0, histBase.r).r;
  float g = pickValue_tHist(0.0, histBase.g).g;
  float b = pickValue_tHist(0.0, histBase.b).b;
  float a = pickValue_tHist(0.0, histBase.a).a;

	return vec4(r, g, b, 255.0 / norm) * norm;
}
