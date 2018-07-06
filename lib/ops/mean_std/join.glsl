/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

vec4 operation(float gly, float glx) {
 if (gly == 0.0) {
    return texture2D(tMean, vec2(0, 0));
 } else {
    return texture2D(tStd, vec2(0, 0));
 }
}
