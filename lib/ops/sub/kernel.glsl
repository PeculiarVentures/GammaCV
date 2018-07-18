/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  vec4 A = pickValue_tA(y, x);
  vec4 B = pickValue_tB(y, x);

	return vec4(A.rgb - B.rgb, 1.0);
}