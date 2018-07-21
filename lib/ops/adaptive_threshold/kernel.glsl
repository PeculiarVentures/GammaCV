/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
	vec4 pixel = pickValue_tSrc(y, x);
	vec4 value = pickValue_tIntegralImage(y, x);
	
	vec2 p1 = max(vec2(x, y) - uS / 2.0, vec2(1.0));
	vec2 p2 = min(vec2(x, y) + uS / 2.0, OUT_VIEW);
	vec2 pd = p2 - p1;
	float s = pd.x * pd.y;
	float sum = pickValue_tIntegralImage(p2.y, p2.x).r
		- pickValue_tIntegralImage(p2.y, p1.x - 1.0).r
		- pickValue_tIntegralImage(p1.y - 1.0, p2.x).r
		+ pickValue_tIntegralImage(p1.y - 1.0, p1.x - 1.0).r;

	if (pixel[int(C)] * s <= sum * (100.0 - uT)/ 100.0) {
		return vec4(0.0, 0.0, 0.0, 1.0);	
	} else {
		return vec4(1.0, 1.0, 1.0, 1.0);
	}
}
