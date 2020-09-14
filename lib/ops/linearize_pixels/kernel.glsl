/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2020 Peculiar Ventures.
 * All rights reserved.
 */

vec2 mapIdx(float idx) {
  return vec2(
    fract(idx / INPUT_SHAPE.x) * INPUT_SHAPE.x,
    floor(idx / INPUT_SHAPE.x)
  );
}

vec4 operation(float y, float x) {
  float idx = y * OUT_VIEW.x + x;
  float sourceIdx = idx * 4.0;
  vec2 inputCoord;

  inputCoord = mapIdx(sourceIdx);
  float r = pickScalarValue_tSrc(inputCoord.y, inputCoord.x);

  inputCoord = mapIdx(sourceIdx + 1.0);
  float g = pickScalarValue_tSrc(inputCoord.y, inputCoord.x);


  inputCoord = mapIdx(sourceIdx + 2.0);
  float b = pickScalarValue_tSrc(inputCoord.y, inputCoord.x);

  inputCoord = mapIdx(sourceIdx + 3.0);
  float a = pickScalarValue_tSrc(inputCoord.y, inputCoord.x);

  return vec4(r, g, b, a);
}
