/**
 * @author twerdster from https://stackoverflow.com/a/7237286
 */
precision highp float;

highp vec4 encode_float(highp float f) {
  if (f == 1. / 0.) {
    return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
  }

  highp vec4 rgba;
  highp float e =5.0;
  highp float F = abs(f); 
  highp float sign = step(0.0,-f);
  highp float exponent = floor(log2(F));
  highp float mantissa = (exp2(- exponent) * F);
  exponent = floor(log2(F) + 127.0) + floor(log2(mantissa));
  rgba[0] = 128.0 * sign + floor(exponent * exp2(-1.0));
  rgba[1] = 128.0 * mod(exponent, 2.0) + mod(floor(mantissa * 64.0 * 2.0), 128.0);  
  rgba[2] = floor(mod(floor(mantissa * exp2(23.0 -8.0)), exp2(8.0)));
  rgba[3] = floor(exp2(23.0) * mod(mantissa, exp2(-15.0)));

  return rgba.abgr / 255.0;
}

float decode_float(highp vec4 rgba) {
  rgba = rgba.abgr * 255.0;
  highp float sign = 1.0 - step(128.0,rgba[0])*2.0;
  highp float exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0; 
  exponent = floor(exponent + 0.5);
  highp float mantissa = mod(rgba[1],128.0)*32768.0 * 2.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
  highp float result = sign
    * mantissa
    * exp2(-23.0)
    * exp2(exponent);

  return result;
}
