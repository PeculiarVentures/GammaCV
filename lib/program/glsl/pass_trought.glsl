/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

precision highp float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoords;
varying vec2 texCoords;

void main(void) {
  texCoords = aTextureCoords;

  gl_Position = vec4(aVertexPosition, 1.0);
}