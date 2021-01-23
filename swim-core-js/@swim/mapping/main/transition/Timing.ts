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
import {Values} from "@swim/util";
import {Domain} from "../mapping/Domain";
import {Interpolator} from "../interpolate/Interpolator";
import type {Easing} from "./Easing";
import {Tweening} from "../"; // forward import

export declare abstract class Timing {
  abstract readonly easing: Easing;

  abstract readonly 0: number;

  abstract readonly 1: number;

  get duration(): number;

  withDomain(t0: number, t1: number): Timing;

  overRange<Y>(range: Interpolator<Y>): Tweening<Y>;
  overRange<Y>(y0: Y, y1: Y): Tweening<Y>;

  canEqual(that: unknown): boolean;

  equals(that: unknown): boolean;

  toString(): string;
}

export interface Timing extends Domain<number> {
}

export function Timing(easing: Easing, t0: number, t1: number): Timing {
  const timing = function (t: number): number {
    const t0 = timing[0];
    const t1 = timing[1];
    return timing.easing(Math.min(Math.max(0, (t - t0) / (t1 - t0)), 1));
  } as Timing;
  Object.setPrototypeOf(timing, Timing.prototype);
  Object.defineProperty(timing, "easing", {
    value: easing,
    enumerable: true,
  });
  Object.defineProperty(timing, 0, {
    value: t0,
    enumerable: true,
  });
  Object.defineProperty(timing, 1, {
    value: t1,
    enumerable: true,
  });
  return timing;
}
__extends(Timing, Domain);

Object.defineProperty(Timing.prototype, "duration", {
  get(this: Timing): number {
    return this[1] - this[0];
  },
  enumerable: true,
  configurable: true,
});

Timing.prototype.withDomain = function (t0: number, t1: number): Timing {
  return Timing(this.easing, t0, t1);
};

Timing.prototype.overRange = function <Y>(this: Timing, y0: Interpolator<Y> | Y, y1: Y): Tweening<Y> {
  let range: Interpolator<Y>;
  if (arguments.length === 1) {
    range = y0 as Interpolator<Y>;
  } else {
    range = Interpolator(y0 as Y, y1);
  }
  return Tweening(this, range);
} as typeof Timing.prototype.overRange;

Timing.prototype.canEqual = function (that: unknown): boolean {
  return that instanceof Timing;
};

Timing.prototype.equals = function (that: unknown): boolean {
  if (this === that) {
    return true;
  } else if (that instanceof Timing) {
    return that.canEqual(this)
        && this.easing.equals(that.easing)
        && Values.equal(this[0], that[0])
        && Values.equal(this[1], that[1]);
  }
  return false;
};

Timing.prototype.toString = function (): string {
  return "Timing(" + this.easing + ", " + this[0] + ", " + this[1] + ")";
};
