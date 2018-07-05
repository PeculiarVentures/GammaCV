const vec3 k = vec3(0.2128, 0.7148, 0.0724);

vec4 operation(float y, float x) {
  float value = dot(pickValue_tSrc(y, x).rgb, k);

	return vec4(value, value, value, 1.0);
}
