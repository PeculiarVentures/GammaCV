/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  vec3 chanels = pickValue_tSrc(y, x).rgb;
  vec3 mean = pickValue_tStdMean(0.0, 0.0).rgb;
  vec3 std = pickValue_tStdMean(1.0, 0.0).rgb;
  vec3 value = (chanels - mean) / std;

	return vec4(value, 1.0);
}
