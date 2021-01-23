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

import {__extends} from "tslib";
import {Interpolator} from "./Interpolator";

/** @hidden */
export declare abstract class IdentityInterpolator<Y> {
  /** @hidden */
  declare readonly value: Y;

  get 0(): Y;

  get 1(): Y;

  equals(that: unknown): boolean;
}

export interface IdentityInterpolator<Y> extends Interpolator<Y> {
}

/** @hidden */
export function IdentityInterpolator<Y>(value: Y): IdentityInterpolator<Y> {
  const interpolator = function (u: number): Y {
    return interpolator.value;
  } as IdentityInterpolator<Y>;
  Object.setPrototypeOf(interpolator, IdentityInterpolator.prototype);
  Object.defineProperty(interpolator, "value", {
    value: value,
    enumerable: true,
  });
  return interpolator;
}
__extends(IdentityInterpolator, Interpolator);

Object.defineProperty(IdentityInterpolator.prototype, 0, {
  get<Y>(this: IdentityInterpolator<Y>): Y {
    return this.value;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(IdentityInterpolator.prototype, 1, {
  get<Y>(this: IdentityInterpolator<Y>): Y {
    return this.value;
  },
  enumerable: true,
  configurable: true,
});

IdentityInterpolator.prototype.equals = function (that: unknown): boolean {
  if (this === that) {
    return true;
  } else if (that instanceof IdentityInterpolator) {
    return this.value === that.value;
  }
  return false;
};
