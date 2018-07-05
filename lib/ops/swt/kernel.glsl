vec4 findForAngle(float theta, bool invert, float gly, float glx) {
  const float thetaTreshold = PI / 6.0;
  float PER_STEP = (uStrokeMax - uStrokeMin) / STEPS;
  if (invert) {
    theta += PI;
  }

  float sn = sin(theta);
  float cs = cos(theta);
  float tx = cs * PER_STEP;
  float ty = sn * PER_STEP;
  float minX = cs * uStrokeMin;
  float minY = sn * uStrokeMin;

  float strokeWidth = 0.0;
  int intersect = 0;
  int cx = 0;
  int cy = 0;

  for (int i = int(STEPS); i > 0; i -= 1) {
    int nx = int(glx + minX + tx * float(i));
    int ny = int(gly + minY + ty * float(i));
    float dist = sqrt(float((nx - int(glx)) * (nx - int(glx))) + float((ny - int(gly)) * (ny - int(gly))));
    float cannyValue = pickValue_tCanny(float(ny), float(nx)).r;

    vec4 sobelValue = pickValue_tSobel(float(ny), float(nx));
    float theta2 = atan(sobelValue.b, sobelValue.g);

    if (invert) {
      theta2 += PI;
    }

    if (
      cannyValue > 0.0
      && dist > uStrokeMin
      && dist < uStrokeMax
      && abs(abs(theta - theta2) - PI) < thetaTreshold
    ) {
      strokeWidth = dist;
      cx = nx;
      cy = ny;
    }
  }

  return vec4(strokeWidth, cx, cy, theta);
}

vec4 operation(float _y, float _x) {
  vec4 sobel = pickValue_tSobel(_y, _x);
  vec4 canny = pickValue_tCanny(_y, _x);

  float dx = sobel.g;
  float dy = sobel.b;
  float _theta = atan(dy, dx);

  vec4 result = findForAngle(_theta, INVERT > 0.0, _y, _x);

  float strokeWidth = result.r;
  int cx = int(result.g);
  int cy = int(result.b);
  float theta = result.a;

  float a = float(cx) - _x;
  float b = float(cy) - _y;

  if (C > 0.0) {
    if (canny.r > 0.0 && cx > 0 && cy > 0) {
     return vec4(strokeWidth, theta, int(cx), int(cy));
   } else {
     return vec4(0, 0, 0, 0);
   }
  }
  if (canny.r > 0.0 && cx > 0 && cy > 0) {
    return vec4(strokeWidth, theta, 0, 1.0);
  } else {
    return vec4(0, 0, 0, 0);
  }
}
