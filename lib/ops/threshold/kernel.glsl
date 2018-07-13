/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
	vec4 pixel = pickValue_tSrc(y, x);

	if (pixel[int(C)] > uT) {
		return vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		return vec4(0.0, 0.0, 0.0, 1.0);
	}
}
