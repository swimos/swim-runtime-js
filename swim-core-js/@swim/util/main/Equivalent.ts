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
   * Returns `true` if `this` is equivalent to `that` within some optional
   * error tolerance `epsilon`, otherwise returns `false`.
   */
  equivalentTo(that: T, epsilon?: number): boolean;
}

/** @hidden */
export const Equivalent = {
  Epsilon: 1.0e-8,
};
