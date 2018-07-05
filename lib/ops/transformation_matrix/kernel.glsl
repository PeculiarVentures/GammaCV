vec2 getPoint(bool tx, int pn) {
  if (tx) {
    return pickValue_tPoints(float(pn), 0.0).xy;
  } else {
    return pickValue_tDstPoints(float(pn), 0.0).xy;
  }
}

mat3 merge(mat3 src, mat3 dst) {
  float Hr0 = src[0][0];
  float Hr1 = src[0][1];
  float Hr2 = src[0][2];
  float Hr3 = src[1][0];
  float Hr4 = src[1][1];
  float Hr5 = src[1][2];
  float Hr6 = src[2][0];
  float Hr7 = src[2][1];

  float Hl0 = dst[0][0];
  float Hl1 = dst[0][1];
  float Hl2 = dst[0][2];
  float Hl3 = dst[1][0];
  float Hl4 = dst[1][1];
  float Hl5 = dst[1][2];
  float Hl6 = dst[2][0];
  float Hl7 = dst[2][1];

  float t2 = Hr4 - Hr7 * Hr5;
  float t4 = Hr0 * Hr4;
  float t5 = Hr0 * Hr5;
  float t7 = Hr3 * Hr1;
  float t8 = Hr2 * Hr3;
  float t10 = Hr1 * Hr6;
  float t12 = Hr2 * Hr6;
  float t15 = 1.0 / (t4 - t5 * Hr7 - t7 + t8 * Hr7 + t10 * Hr5 - t12 * Hr4);
  float t18 = -Hr3 + Hr5 * Hr6;
  float t23 = -Hr3 * Hr7 + Hr4 * Hr6;
  float t28 = -Hr1 + Hr2 * Hr7;
  float t31 = Hr0 - t12;
  float t35 = Hr0 * Hr7 - t10;
  float t41 = -Hr1 * Hr5 + Hr2 * Hr4;
  float t44 = t5 - t8;
  float t47 = t4 - t7;
  float t48 = t2 * t15;
  float t49 = t28 * t15;
  float t50 = t41 * t15;
  float mat_0 = Hl0 * t48 + Hl1 * (t18 * t15) - Hl2 * (t23 * t15);
  float mat_1 = Hl0 * t49 + Hl1 * (t31 * t15) - Hl2 * (t35 * t15);
  float mat_2 = -Hl0 * t50 - Hl1 * (t44 * t15) + Hl2 * (t47 * t15);
  float mat_3 = Hl3 * t48 + Hl4 * (t18 * t15) - Hl5 * (t23 * t15);
  float mat_4 = Hl3 * t49 + Hl4 * (t31 * t15) - Hl5 * (t35 * t15);
  float mat_5 = -Hl3 * t50 - Hl4 * (t44 * t15) + Hl5 * (t47 * t15);
  float mat_6 = Hl6 * t48 + Hl7 * (t18 * t15) - t23 * t15;
  float mat_7 = Hl6 * t49 + Hl7 * (t31 * t15) - t35 * t15;
  float mat_8 = -Hl6 * t50 - Hl7 * (t44 * t15) + t47 * t15;

  return mat3(
    mat_0,
    mat_1,
    mat_2,
    mat_3,
    mat_4,
    mat_5,
    mat_6,
    mat_7,
    mat_8
  );
}

mat3 calcProm(bool tx) {
  float t1 = getPoint(tx, 0).x;
  float t2 = getPoint(tx, 2).x;
  float t4 = getPoint(tx, 1).y;
  float t5 = t1 * t2 * t4;
  float t6 = getPoint(tx, 3).y;
  float t7 = t1 * t6;
  float t8 = t2 * t7;
  float t9 = getPoint(tx, 2).y;
  float t10 = t1 * t9;
  float t11 = getPoint(tx, 1).x;
  float t14 = getPoint(tx, 0).y;
  float t15 = getPoint(tx, 3).x;
  float t16 = t14 * t15;
  float t18 = t16 * t11;
  float t20 = t15 * t11 * t9;
  float t21 = t15 * t4;
  float t24 = t15 * t9;
  float t25 = t2 * t4;
  float t26 = t6 * t2;
  float t27 = t6 * t11;
  float t28 = t9 * t11;
  float t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28);
  float t32 = t1 * t15;
  float t35 = t14 * t11;
  float t41 = t4 * t1;
  float t42 = t6 * t41;
  float t43 = t14 * t2;
  float t46 = t16 * t9;
  float t48 = t14 * t9 * t11;
  float t51 = t4 * t6 * t2;
  float t55 = t6 * t14;
  float Hr0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30;
  float Hr1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30;
  float Hr2 = t1;
  float Hr3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30;
  float Hr4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30;
  float Hr5 = t14;
  float Hr6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30;
  float Hr7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30;

  return mat3(
    Hr0, Hr1, Hr2,
    Hr3, Hr4, Hr5,
    Hr6, Hr7, 0.0
  );
}

vec4 operation(float y, float x) {
  mat3 src = calcProm(true);
  mat3 dst = calcProm(false);
  mat3 res = merge(src, dst);

  if (y == 0.0) {
    return vec4(res[0][0], res[0][1], res[0][2], 0.0);
  }
  if (y == 1.0) {
    return vec4(res[1][0], res[1][1], res[1][2], 0.0);
  }
  if (y == 2.0) {
    return vec4(res[2][0], res[2][1], res[2][2], 0.0);
  }

  return vec4(0.0, 0.0, 0.0, 0.0);
}
