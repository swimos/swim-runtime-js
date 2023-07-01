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

/** @public */
export interface ToAny<T> {
  toAny(): T;
}

/** @public */
export const ToAny = (function () {
  const ToAny = function (value: unknown): unknown {
    if (ToAny[Symbol.hasInstance](value)) {
      return value.toAny();
    }
    return value;
  } as {
    /**
     * Returns the [[ToAny.toAny toAny]] conversion `value`, if `value`
     * conforms to the `ToAny` interface; otherwise returns `value` itself.
     */
    <T>(value: ToAny<T>): T;
    (value: unknown): unknown;

    /**
     * Returns `true` if `instance` appears to conform to the [[ToAny]] interface.
     */
    [Symbol.hasInstance]<T>(instance: unknown): instance is ToAny<T>
  };

  Object.defineProperty(ToAny, Symbol.hasInstance, {
    value: function <T>(instance: unknown): instance is ToAny<T> {
      if (instance === null || (typeof instance !== "object" && typeof instance !== "function")) {
        return false;
      }
      return typeof (instance as ToAny<T>).toAny === "function";
    },
    enumerable: true,
    configurable: true,
  });

  return ToAny;
})();
