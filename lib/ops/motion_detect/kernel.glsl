vec4 operation(float y, float x) {
  vec4 prev = pickValue_tPrev(y, x);
  vec4 curr = pickValue_tCurr(y, x);

  float v = sqrt(
    (curr.x - prev.x) * (curr.x - prev.x) +
    (curr.y - prev.y) * (curr.y - prev.y) +
    (curr.w - prev.w) * (curr.w - prev.w)
  );


  // return vec4(v.rgb * 2.0, 1.0);

  return vec4(v, v, v, 1.0);

}
