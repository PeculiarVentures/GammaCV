/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float y, float x) {
  float wk = 1.0;
  float hk = 1.0;

  float dx = 0.0;
  float dy = 0.0;

  /*
    -1 0 +1
    -2 0 +2
    -1 0 +1
  */
  dx += -1.0 * pickScalarValue_tSrc(y - hk, x - wk);
  dx += -2.0 * pickScalarValue_tSrc(y,      x - wk);
  dx += -1.0 * pickScalarValue_tSrc(y + wk, x - wk);

  dx += +1.0 * pickScalarValue_tSrc(y - wk, x + wk);
  dx += +2.0 * pickScalarValue_tSrc(y,      x + wk);
  dx += +1.0 * pickScalarValue_tSrc(y + wk, x + wk);

  /*
    -1 -2 -1
     0  0  0
    +1 +2 +1
  */
  dy += -1.0 * pickScalarValue_tSrc(y - wk, x - wk);
  dy += -2.0 * pickScalarValue_tSrc(y - wk, x    );
  dy += -1.0 * pickScalarValue_tSrc(y - wk, x + wk);

  dy += +1.0 * pickScalarValue_tSrc(y + wk, x - wk);
  dy += +2.0 * pickScalarValue_tSrc(y + wk, x    );
  dy += +1.0 * pickScalarValue_tSrc(y + wk, x + wk);

  float magniture = sqrt((dx * dx) + (dy * dy));
  float theta = atan(dy / dx);

	return vec4(magniture, dx, dy, theta);
}
