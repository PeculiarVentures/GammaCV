precision highp float;

float intersectionX(vec4 line, float x) {
  return ((x - line.x) / (line.z - line.x) * (line.w - line.y) + line.y);
}

float intersectionY(vec4 line, float y) {
  return ((y - line.y) / (line.w - line.y) * (line.z - line.x) + line.x);
}

vec4 findSide(float x1, float y1, float x2, float y2) {
  int i = 0;
  vec2 i0 = vec2(0, 0);
  vec2 i1 = vec2(0, 0);

  float ax = 0.0;
  float ay = intersectionY(vec4(x1, y1, x2, y2), ax);

  float by = 0.0;
  float bx = intersectionX(vec4(x1, y1, x2, y2), by);

  float cx = MAX_DIST;
  float cy = intersectionY(vec4(x1, y1, x2, y2), cx);

  float dy = MAX_DIST;
  float dx = intersectionX(vec4(x1, y1, x2, y2), dy);

  if (ay <= MAX_DIST && ay >= 0.0) {
    if (i == 0) {
      i0 = vec2(ax, ay);
      i += 1;
    }
  }

  if (cy <= MAX_DIST && cy >= 0.0) {
    if (i == 0) {
      i0 = vec2(cx, cy);
      i += 1;
    } else {
      i1 = vec2(cx, cy);
    }
  }

  if (bx <= MAX_DIST && bx >= 0.0) {
    if (i == 0) {
      i0 = vec2(bx, by);
      i += 1;
    } else {
      i1 = vec2(bx, by);
    }
  }

  if (dx <= MAX_DIST && dx >= 0.0) {
    if (i == 0) {
      i0 = vec2(dx, dy);
      i += 1;
    } else {
      i1 = vec2(dx, dy);
    }
  }

  return vec4(i0.x, i0.y, i1.x, i1.y);
}

float pow(float a) {
  return a * a;
}

vec4 getStraight(float aIndex, float v, float dist, float angles) {
  float y1;
  float y2;
  if (aIndex > angles) {
    aIndex -= angles;
    y1 = MAX_ANGLE - (angles * v / aIndex);
    y2 = (-1.0 + angles / aIndex) * uWidth + y1;
  } else {
    aIndex = angles - aIndex;
    y1 = (angles * v / aIndex);
    y2 = (1.0 - angles / aIndex) * uWidth + y1;
  }

  return vec4(0.0, y1, uWidth, y2);
}

float getValue(float i, float lx, float ly, vec4 side) {
  float xx = 0.0;
  float yy = 0.0;

  if (lx < ly) {
    xx = i;
    yy = intersectionY(side, xx);
  } else {
    yy = i;
    xx = intersectionX(side, yy);
  }

  if (xx > 0.0 && xx < uWidth && yy > 0.0 && yy < uHeight) {
    float a = pickScalarValue_tSrc(yy, xx);

    if (a > 0.0) {
      return 1.0;
    }
  }

  return 0.0;
}

vec4 operation(float y, float x) {
  float v_out = 0.0;

  vec4 straight = getStraight(x, y, MAX_DIST, MAX_ANGLE / 2.0);
  vec4 side = findSide(straight.x, straight.y, straight.z, straight.w);

  float lx = abs(side.z - side.x);
  float ly = abs(side.w - side.y);
  float k = 1.0 / D;

  for (float i = 0.0; i <= D; i += STEP) {
    float a = getValue(i, lx, ly, side);

    if (a > 0.0) {
      v_out += k;
    }
  }

  return vec4(v_out, v_out, v_out, 255.0);
}