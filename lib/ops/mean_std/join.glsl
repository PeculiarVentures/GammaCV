vec4 operation(float gly, float glx) {
 if (gly == 0.0) {
    return texture2D(tMean, vec2(0, 0));
 } else {
    return texture2D(tStd, vec2(0, 0));
 }
}
