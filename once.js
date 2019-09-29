"use strict";

const _ = require("lodash");
const util = require("util");
const wrappy = require("wrappy");
const assert = require("assert");

/**
 * Call a function only once during its execution lifetime
 * @param {function} fn function to wrap, remember to bind "this"!
 * @param {{ reentrant: boolean }} reentrant whether async functions should be reentrant or not. If this is set to TRUE,
 * any function that returns a promise can be called again after its execution is finished but not during its execution.
 * @see async and reentrant version of: https://www.npmjs.com/package/once
 */
function once(fn, opts = { reentrant: false }) {
  // this only works with functions so assert it
  assert.ok(_.isFunction(fn));
  // if we are passed an async function and we need it to be reentrant, check it
  const f =
    util.types.isAsyncFunction(fn) && _.get(opts, "reentrant", false)
      ? function() {
          if (f.called) return f.value;
          f.called = true;
          // wrap the async function
          return (f.value = new Promise(async (resolve, reject) => {
            try {
              // call the original async function and pass the return value
              const result = await fn.apply(this, arguments);
              _.isUndefined(result) ? resolve() : resolve(result);
            } catch (err) {
              // propagate the error to the caller
              reject(err);
            }
            // reset to false for reentrance functions
            f.called = false;
          }));
        }
      : function() {
          if (f.called) return f.value;
          f.called = true;
          return (f.value = fn.apply(this, arguments));
        };
  f.called = false;
  return f;
}

module.exports = wrappy(once);
