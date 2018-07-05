#define WIN_LENGTH WIN_SIZE_X * WIN_SIZE_Y

vec4 operation(float gly, float glx) {
  float i;

  if (SWAP_COORDS) {
    i = gly;
  } else {
    i = glx;
  }

  float x = floor(i / WIN_LENGTH);
  float y = i - x * WIN_LENGTH;

  float _sy = floor(x / SX);
  float _sx = x - (_sy * SX);

  float _y = floor(y / WIN_SIZE_X);
  float _x = y - (_y * WIN_SIZE_X);

	return pickValue_tSrc(_sy * STRIDE_Y + _y, _sx * STRIDE_X + _x);
}
