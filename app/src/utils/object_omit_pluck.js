/* eslint-disable */

/**
 * Expand object prototype. Add omit method
 * @example
 *  Have variable obj
 *  const obj = {
 *    foo: 1,
 *    bar: 'hello',
 *    des: false
 *  };
 *  Omit variable obj
 *  obj.omit(['foo', 'des']) // -> { bar: 'hello' }
 */
if (!Object.prototype.omit) {
  Object.defineProperty(Object.prototype, 'omit', {
    writable: true,
    value(...args) {
      let toOmit;

      if (!Array.isArray(args[0])) {
        toOmit = Array.prototype.slice.call(args);
      } else {
        toOmit = args[0];
      }

      const result = {};
      const keys = Object.keys(this);

      for (let i = keys.length - 1; i >= 0; i--) {
        const k = keys[i];

        if (toOmit.indexOf(k) === -1) {
          result[k] = this[k];
        }
      }

      return result;
    },
  });
}

/**
 * Expand object prototype. Add omit pluck
 * @example
 *  Have variable obj
 *  const obj = {
 *    foo: 1,
 *    bar: 'hello',
 *    des: false
 *  };
 *  Pluck variable obj
 *  obj.pluck(['foo', 'des']) // -> { foo: 1, des: false }
 */
if (!Object.prototype.pluck) {
  Object.defineProperty(Object.prototype, 'pluck', {
    writable: false,
    value(...args) {
      const result = {};

      for (let i = 0; i < args.length; i += 1) {
        const k = args[i];

        if (this[k] !== undefined) {
          result[k] = this[k];
        }
      }

      return result;
    },
  });
}

/**
 * Expand object prototype. Add Omit method
 * @example
 *  Have variable obj
 *  const obj = {
 *    foo: 1,
 *    bar: 'hello',
 *    des: false
 *  };
 *  Omit variable obj
 *  obj.Omit(['foo', 'des']) // -> { bar: 'hello' }
 */
if (!Object.Omit) {
  Object.defineProperty(Object, 'Omit', {
    writable: false,
    value(...args) {
      return Object.prototype.omit.apply(args.shift(), args);
    },
  });
}
