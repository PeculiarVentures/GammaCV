#define STROKE uSize

vec4 operation(float y, float x) {
  vec4 M = pickValue_tSrc(y, x);
  float N = pickValue_tSrc(y + STROKE, x).r;
  float S = pickValue_tSrc(y - STROKE, x).r;
  float W = pickValue_tSrc(y, x - STROKE).r;
  float E = pickValue_tSrc(y, x + STROKE).r;

  float SE = pickValue_tSrc(y - STROKE, x + STROKE).r;
  float NW = pickValue_tSrc(y + STROKE, x - STROKE).r;

  float NE = pickValue_tSrc(y + STROKE, x + STROKE).r;
  float SW = pickValue_tSrc(y - STROKE, x - STROKE).r;
  float H = 0.0;

  float V = M.r;
  float dx = M.g;
  float dy = M.b;

  float theta = atan(dy / dx);
  float deg = theta * (180.0 / PI);
  float angle = 0.0;

  if (deg < 0.0) {
    deg = 180.0 + deg;
  }

  if (deg < 22.5 || deg >= 157.5) {
    // 0 deg
    if (V > W && V > E) {
      H += 1.0;
    }
  }

  if (deg < 67.5 && deg >= 22.5) {
    // 45 deg
    if (V > SW && V > NE) {
      H += 1.0;
    }
  }

  if (deg < 112.5 && deg >= 67.5) {
    // 90 deg
    if (V > N && V > S) {
      H += 1.0;
    }
  }

  if (deg < 157.5 && deg >= 112.5) {
    // 135 deg
    if (V > NW && V > SE) {
      H += 1.0;
    }
  }

  if (H == 1.0) {
    return vec4(V, V, V, 255);
  } else {
    return vec4(0, 0, 0, 255);
  }
}