const int kx = int(KX);
const int ky = int(KY);
const float INF = 1.0 / 0.0;
const float h2 = OUT_VIEW.y / 2.0;

vec4 operation(float igly, float glx) {
  float size = KX * KY;
  vec3 minV = vec3(INF);
  vec3 maxV = vec3(-INF);
  float gly = igly;

  if (gly >= h2) {
    gly -= h2;
  }

  for (int y = 0; y < ky * 2; y += 1) {
    for (int x = 0; x < kx; x += 1) {
      vec3 value = pickValue_tSrc(gly * KY + float(y), glx * KX + float(x)).rgb;
      minV = min(minV, value.rgb);
      maxV = max(maxV, value.rgb);
    }
  }

  if (igly < h2) {
    return vec4(minV, 255.0);
  } else {
    return vec4(maxV, 255.0);
  }
}
