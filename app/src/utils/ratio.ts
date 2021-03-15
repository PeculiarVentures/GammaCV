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
export function getWidth(ratio: number, h: number): number {
  return ratio * h;
}

/**
 * @param {Ratio} ratio
 * @param {number} w
 */
export function getHeight(ratio: number, w: number): number {
  return w / ratio;
}

/**
 *
 * @param {Ratio} ratio
 * @param {number} maxWidth
 * @param {number} [maxHeight]
 * @return {Size}
 */
export function getMaxAvailableSize(ratio: number, maxWidth: number, maxHeight: number) {
  if (maxWidth) {
    const height = getHeight(ratio, maxWidth);

    if (height <= maxHeight) {
      return {
        height,
        width: maxWidth,
      };
    }
  }

  return {
    width: getWidth(ratio, maxHeight),
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
export function getMinAvailableSize(ratio: number, minWidth: number, minHeight: number) {
  if (minWidth) {
    const height = getHeight(ratio, minWidth);

    if (height > minHeight) {
      return {
        height,
        width: minHeight,
      };
    }
  }

  return {
    width: getWidth(ratio, minHeight),
    height: minHeight,
  };
}
