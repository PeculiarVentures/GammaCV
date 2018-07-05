/**
 * @author Mikhail Zachepilo <mihailzachepilo@gmail.com>
 */

/**
 * @typedef {number} Ratio - number representation of ratio: width / height
 * @example 4 / 3 = 1.3333333333333333
 */

/**
 * @typedef {{width: number, height: number}} Size
 */

/**
 * @param {Ratio} ratio
 * @param {number} h
 */
export function width(ratio, h) {
  return ratio * h;
}

/**
 * @param {Ratio} ratio
 * @param {number} w
 */
export function height(ratio, w) {
  return w / ratio;
}

/**
 *
 * @param {Ratio} ratio
 * @param {number} maxWidth
 * @param {number} [maxHeight]
 * @return {Size}
 */
export function getMaxAvailableSize(ratio, maxWidth, maxHeight) {
  if (maxWidth) {
    const _height = height(ratio, maxWidth);
    if (_height <= maxHeight) {
      return {
        width: maxWidth,
        height: _height,
      };
    }
  }

  return {
    width: width(ratio, maxHeight),
    height: maxHeight,
  };
}

/**
 *
 * @param {Ratio} ratio
 * @param {number} minWidth
 * @param {number} [minHeight]
 * @return {Size}
 */
export function getMinAvailableSize(ratio, minWidth, minHeight) {
  if (minWidth) {
    const _height = height(ratio, minWidth);
    if (_height > minHeight) {
      return {
        width: minHeight,
        height: _height,
      };
    }
  }

  return {
    width: width(ratio, minHeight),
    height: minHeight,
  };
}
