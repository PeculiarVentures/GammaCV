vec4 operation(float y, float x) {
  float value = 0.0;
  
  for (float dx = 0.0; dx < K; dx += 1.0) {
    for (float dy = 0.0; dy < K; dy += 1.0) {
      float v = pickValue_tSrc((y * K) - dy, (x * K) - dx).r;

      if (S == 0.0) {
        if (v > 0.0) {
          value = v;
        }
      } 

      if (S == 1.0) {
        value += v;
      } 
    }
  }

  if (S == 1.0) {
    value /= K * K;
  } 

	return vec4(value, value, value, 1.0);
}
