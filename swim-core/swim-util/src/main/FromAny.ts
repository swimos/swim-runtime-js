// Copyright 2015-2023 Swim.inc
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

import {Strings} from "./Strings";
import {Numbers} from "./Numbers";
import {Booleans} from "./Booleans";
import {Identity} from "./Identity";

/** @public */
export interface FromAny<T, U = T> {
  fromAny(value: T | U): T;
}

/** @public */
export const FromAny = (function () {
  const FromAny = function <T, U>(type: FromAny<T, U>, value?: T | U): FromAny<T, U> | T {
    if (FromAny[Symbol.hasInstance](type)) {
      // conforms
    } else if (type === String) {
      type = Strings as unknown as FromAny<T, U>;
    } else if (type === Number) {
      type = Numbers as unknown as FromAny<T, U>;
    } else if (type === Boolean) {
      type = Booleans as unknown as FromAny<T, U>;
    } else {
      type = Identity as FromAny<T, U>;
    }
    if (arguments.length === 1) {
      return type;
    }
    return type.fromAny(value as T | U);
  } as {
    /**
     * Returns a `FromAny` instance for the given `type`. Returns `type` itself,
     * if `type` implements `FromAny`; returns a primitive converter, if `type`
     * is the `String`, `Number`, or `Boolean` constructor; otherwise returns
     * an identity converter.
     */
    <T, U = T>(type: unknown): FromAny<T, U>;
    /**
     * Returns the [[FromAny]] conversion of `value` by `type`, if `type`
     * conforms to the `FromAny` interface; otherwise returns `value` itself.
     */
    <T, U = T>(type: unknown, value: T | U): T;

    /**
     * Returns `true` if `instance` appears to conform to the [[FromAny]] interface.
     */
    [Symbol.hasInstance]<T, U = T>(instance: unknown): instance is FromAny<T, U>
  };

  Object.defineProperty(FromAny, Symbol.hasInstance, {
    value: function <T, U>(instance: unknown): instance is FromAny<T, U> {
      if (instance === null || (typeof instance !== "object" && typeof instance !== "function")) {
        return false;
      }
      return typeof (instance as FromAny<T, U>).fromAny === "function";
    },
    enumerable: true,
    configurable: true,
  });

  return FromAny;
})();
