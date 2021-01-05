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

/**
 * Type that implements a universal equivalence relation.
 */
export interface Equals {
  /**
   * Returns `true` if `this` is equal to `that`, otherwise returns `false`.
   */
  equals(that: unknown): boolean;
}

export const Equals = {} as {
  /**
   * Returns `true` if `x` is an object and is [[Equals.equals equal]] to `y`,
   * otherwise returns `x === y`.
   */
  equal(x: Object | null | undefined, y: unknown): boolean;

  /**
   * Returns `true` if `object` conforms to the [[Equals]] interface.
   */
  is(object: unknown): object is Equals;
};

Equals.equal = function (x: Object | null | undefined, y: unknown): boolean {
  if (typeof x === "object" && x !== null && typeof (x as Equals).equals === "function") {
    return (x as Equals).equals(y);
  } else {
    return x === y;
  }
};

Equals.is = function (object: unknown): object is Equals {
  if (typeof object === "object" && object !== null || typeof object === "function") {
    return typeof (object as Equals).equals === "function";
  }
  return false;
};
