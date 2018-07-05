vec4 operation(float y, float x) {
  float dx = pickValue_tSrc(y, x + 1.0).r - pickValue_tSrc(y, x - 1.0).r;
  float dy = pickValue_tSrc(y + 1.0, x).r - pickValue_tSrc(y - 1.0, x).r;

  float magniture = sqrt((dx * dx) + (dy * dy));

	return vec4(magniture, atan(dy / dx), dx, dy);
}