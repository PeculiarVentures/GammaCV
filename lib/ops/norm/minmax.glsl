vec4 operation(float y, float x) {
  vec3 chanels = pickValue_tSrc(y, x).rgb;
  vec3 minV = pickValue_tMinMax(0.0, 0.0).rgb;
  vec3 maxV = pickValue_tMinMax(1.0, 0.0).rgb;
  vec3 value = (chanels - minV) / (maxV - minV);

	return vec4(value, 1.0);
}
