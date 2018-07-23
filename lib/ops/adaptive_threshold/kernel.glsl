/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

const int Channel = int(C);

vec4 operation(float y, float x) {
	vec4 pixel = pickValue_tSrc(y, x);
	float huS = uS / 2.0;
	
	vec2 p1 = max(floor(vec2(x, y) - huS), vec2(1.0));
	vec2 p2 = min(floor(vec2(x, y) + huS), OUT_VIEW - 1.0);
	vec2 pd = p2 - p1;
	float s = pd.x * pd.y;
	p1 -= 1.0;
	float sum = pickValue_tIntegralImage(p2.y, p2.x)[Channel]
		- pickValue_tIntegralImage(p1.y, p2.x)[Channel]
		- pickValue_tIntegralImage(p2.y, p1.x)[Channel]
		+ pickValue_tIntegralImage(p1.y, p1.x)[Channel];

	if (pixel[Channel] * s <= sum * (100.0 - uT)/ 100.0) {
		return vec4(0.0, 0.0, 0.0, 1.0);	
	} else {
		return vec4(1.0, 1.0, 1.0, 1.0);
	}
}
