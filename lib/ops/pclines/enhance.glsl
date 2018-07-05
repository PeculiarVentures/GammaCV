#define X_STEPS 10.0
#define Y_STEPS 10.0

vec4 operation(float y, float x) {
  float value = pickValue_tSrc(y, x).r;
  float c = value * value;
  float sum = 0.0;

  for (float j = 0.0; j < Y_STEPS; j += 1.0) {
    for (float i = 0.0; i < X_STEPS; i += 1.0) {
      sum += pickValue_tSrc((y - Y_STEPS / 2.0) + j, (x - X_STEPS / 2.0) + i).r;
    }
  }
  float v = (c / sum) * X_STEPS * Y_STEPS;

  return vec4(v, v, v, 1);
}
