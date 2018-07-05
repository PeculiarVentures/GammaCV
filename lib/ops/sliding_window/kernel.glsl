vec4 operation(float gly, float glx) {
  float x;
  float y;

  if (SWAP_COORDS) {
    x = gly;
    y = glx;
  } else {
    x = glx;
    y = gly;
  }

  float _sy = floor(x / SX);
  float _sx = x - (_sy * SX);

  float _y = floor(y / WIN_SIZE_X);
  float _x = y - (_y * WIN_SIZE_X);

	return pickValue_tSrc(_sy * STRIDE_Y + _y, _sx * STRIDE_X + _x);
}
