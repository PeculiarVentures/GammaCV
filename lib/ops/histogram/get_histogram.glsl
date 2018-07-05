const int kx = int(KX);
const int ky = int(KY);

precision highp float;

vec4 operation(float gly, float iglx) {
  float size = KX * KY;
  float glx = floor(iglx / COUNT);
  float currentIndex = iglx - (glx * COUNT);

  vec4 count = vec4(0.0);
  vec4 ones = vec4(1.0);
  vec4 twos = vec4(2.0);
  vec4 currentIndex4 = vec4(currentIndex);
  vec4 value;

  for (int y = 0; y < ky; y += 1) {
    for (int x = 0; x < kx; x += 1) {
      value = pickValue_tSrc(gly * KY + float(y), glx * KX + float(x));
      vec4 index = floor((value - MIN) / STEP + 0.5);      

      count += step(twos, ones / (abs(index - currentIndex4)));
    }
  }

  return count;
}
