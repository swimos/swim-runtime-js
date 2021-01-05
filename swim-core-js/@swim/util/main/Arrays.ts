// Copyright 2015-2020 Swim inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Murmur3} from "./Murmur3";
import {Values} from "./Values";

/**
 * Utilities for immutably updating, comparing, and hashing arrays.
 */
export const Arrays = {} as {
  /**
   * Returns `true` if `x` and `y` are structurally equal arrays; otherwise
   * returns `x === y` if either `x` or `y` is not an array.
   */
  equal(x: ArrayLike<unknown> | null | undefined, y: ArrayLike<unknown> | null | undefined): boolean;

  /**
   * Returns `true` if `x` and `y` are structurally [[Equivalent.equivalent
   * equivalent]] arrays; otherwise returns `x === y` if either `x` or `y` is
   * not an array.
   */
  equivalent(x: ArrayLike<unknown> | null | undefined, y: ArrayLike<unknown> | null | undefined, epsilon?: number): boolean;

  /**
   * Returns the relative order of `x` with respect to `y`.  Returns `-1` if
   * the elements of array `x` order lexicographically before the elements of
   * array `y`; returns `1` if the elements of array `x` order lexicographically
   * after the elements of array `y`; and returns `0` if `x` and `y` are equal
   * arrays.  If either `x` or `y` is `null` or `undefined`, then arrays order
   * before `null`, and `null` orders before `undefined`.
   */
  compare(x: ArrayLike<unknown> | null | undefined, y: ArrayLike<unknown> | null | undefined): number;

  /**
   * Returns a 32-bit hash value for the elements of array `x`, if defined;
   * otherwise returns `0` or `1` if `x` is `undefined` or `null`, respectively.
   */
  hash(x: ArrayLike<unknown> | null | undefined): number;
};

Arrays.equal = function (x: ArrayLike<unknown> | null | undefined, y: ArrayLike<unknown> | null | undefined): boolean {
  if (typeof x === "object" && x !== null && typeof y === "object" && y !== null) {
    if (x !== y) {
      const n = x.length;
      if (n !== y.length) {
        return false;
      }
      for (let i = 0; i < n; i += 1) {
        if (!Values.equal(x[i], y[i])) {
          return false;
        }
      }
    }
    return true;
  } else {
    return x === y;
  }
};

Arrays.equivalent = function (x: ArrayLike<unknown> | null | undefined, y: ArrayLike<unknown> | null | undefined, epsilon?: number): boolean {
  if (typeof x === "object" && x !== null && typeof y === "object" && y !== null) {
    if (x !== y) {
      const n = x.length;
      if (n !== y.length) {
        return false;
      }
      for (let i = 0; i < n; i += 1) {
        if (!Values.equivalent(x[i], y[i], epsilon)) {
          return false;
        }
      }
    }
    return true;
  } else {
    return x === y;
  }
};

Arrays.compare = function (x: ArrayLike<unknown> | null | undefined, y: ArrayLike<unknown> | null | undefined): number {
  if (typeof x === "object" && x !== null) {
    if (typeof y === "object" && y !== null) {
      if (x !== y) {
        const p = x.length as number;
        const q = y.length as number;
        let order = 0;
        for (let i = 0, n = Math.min(p, q); i < n && order === 0; i += 1) {
          order = Values.compare(x[i], y[i]);
        }
        return order !== 0 ? order : p > q ? 1 : p < q ? -1 : 0;
      } else {
        return 0;
      }
    } else {
      return -1;
    }
  } else if (x === null) {
    return y === void 0 ? -1 : y === null ? 0 : 1;
  } else if (x === void 0) {
    return y === void 0 ? 0 : 1;
  } else {
    return NaN;
  }
};

Arrays.hash = function (x: ArrayLike<unknown> | null | undefined): number {
  if (typeof x === "object" && x !== null) {
    let code = 0;
    for (let i = 0, n = x.length; i < n; i += 1) {
      code = Murmur3.mix(code, Values.hash(x[i]));
    }
    return Murmur3.mash(code);
  } else if (x === null) {
    return 1;
  } else if (x === void 0) {
    return 0;
  } else {
    throw new TypeError("" + x);
  }
};
