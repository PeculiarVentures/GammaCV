vec4 getPoint(vec2 p) {
  return pickValue_tSrc(p.y, p.x);
}

mat3 getTransformMatrix() {
  vec3 r1 = pickValue_tTransform(0.0, 0.0).rgb;
  vec3 r2 = pickValue_tTransform(1.0, 0.0).rgb;
  vec3 r3 = pickValue_tTransform(3.0, 0.0).rgb;

  return mat3(
    r1,
    r2,
    r3
  );
}

vec4 operation(float y, float x) {
  mat3 m = getTransformMatrix();

  float off=0.0;
  float ixs=0.0;
  float iys=0.0;
  float xs=0.0;
  float ys=0.0;
  float xs0=0.0;
  float ys0=0.0;
  float ws=0.0;
  float sc=0.0;
  float a=0.0;
  float b=0.0;

  xs0 = m[0][1] * y + m[0][2];
  ys0 = m[1][1] * y + m[1][2];
  ws  = m[2][1] * y + m[2][2];

  xs0 += m[0][0] * x;
  ys0 += m[1][0] * x;
  ws += m[2][0] * x;


  sc = 1.0 / ws;
  xs = xs0 * sc;
  ys = ys0 * sc;
  ixs = xs;
  iys = ys;

  a = max(xs - ixs, 0.0);
  b = max(ys - iys, 0.0);

  vec2 mvec = vec2(ixs, iys);
  vec2 ox = vec2(1.0, 0.0);
  vec2 oy = vec2(1.0, 1.0);

  vec4 p0 = getPoint(mvec) + a * (getPoint(mvec + ox) - getPoint(mvec));
  vec4 p1 = getPoint(mvec + oy) + a * (getPoint(mvec + ox + oy) - getPoint(mvec + oy));
  vec4 pres = p0 + b * (p1 - p0);

  return pres;
}
