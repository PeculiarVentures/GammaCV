vec4 operation(float y, float x) {
  vec4 col = pickValue_tSrc(y, x) * 255.0;
  float res = 0.0;

  if ((col.r > uRThreshold) && (col.g > uGThreshold) && (col.b > uBThreshold)
      && (col.r > col.g) && (col.r > col.b)
      && (col.r - min(col.g, col.b) > uRtoMinDiffThreshold)
      && (abs(col.r - col.g) > uRtoGDiffThreshold)) {
    res = 1.0;
  }

  return vec4(res, 0.0, 0.0, 1.0);
}
