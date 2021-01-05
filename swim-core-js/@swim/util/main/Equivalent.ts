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
 * Type that implements an equivalence relation over type `T`.
 */
export interface Equivalent<T> {
  /**
   * Returns `true` if `this` is equivalent to `that` within some optionally
   * specified error tolerance `epsilon`, otherwise returns `false`.
   */
  equivalentTo(that: T, epsilon?: number): boolean;
}

export const Equivalent = {} as {
  /**
   * Default equivalence tolerance.
   */
  Epsilon: number;

  /**
   * Returns `true` if `x` and `y` are objects and `x` is
   * [[Equivalent.equivalent equivalent]] to `y`, otherwise returns `x === y`.
   */
  equivalent<T>(x: Equivalent<T> | null | undefined, y: T | null | undefined, epsilon?: number): boolean;

  /**
   * Returns `true` if `object` conforms to the [[Equivalent]] interface.
   */
  is<T>(object: unknown): object is Equivalent<T>;
};

Equivalent.Epsilon = 1.0e-8;

Equivalent.equivalent = function <T>(x: Equivalent<T> | null | undefined, y: T | null | undefined, epsilon?: number): boolean {
  if (x !== null && x !== void 0 && y !== null && y !== void 0) {
    return x.equivalentTo(y, epsilon);
  } else {
    return x === y;
  }
};

Equivalent.is = function <T>(object: unknown): object is Equivalent<T> {
  if (typeof object === "object" && object !== null || typeof object === "function") {
    return typeof (object as Equivalent<T>).equivalentTo === "function";
  }
  return false;
};
