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
import {Range} from "../mapping/Range";
import type {Interpolate} from "../interpolate/Interpolate";
import type {Interpolator} from "../interpolate/Interpolator";
import {LinearDomain} from "../"; // forward import
import {LinearRangeInterpolator} from "../"; // forward import

export declare abstract class LinearRange {
  declare readonly 0: number;

  declare readonly 1: number;

  get inverse(): LinearDomain;

  interpolateTo(that: LinearRange): Interpolator<LinearRange>;
  interpolateTo(that: unknown): Interpolator<LinearRange> | null;

  canEqual(that: unknown): boolean;

  equals(that: unknown): boolean;

  toString(): string;
}

export interface LinearRange extends Range<number>, Interpolate<LinearRange> {
}

export function LinearRange(y0: number, y1: number): LinearRange {
  const range = function (u: number): number {
    const y0 = range[0];
    const y1 = range[1];
    return y0 + u * (y1 - y0);
  } as LinearRange;
  Object.setPrototypeOf(range, LinearRange.prototype);
  Object.defineProperty(range, 0, {
    value: y0,
    enumerable: true,
  });
  Object.defineProperty(range, 1, {
    value: y1,
    enumerable: true,
  });
  return range;
}
__extends(LinearRange, Range);

Object.defineProperty(LinearRange.prototype, "inverse", {
  get(this: LinearRange): LinearDomain {
    return LinearDomain(this[0], this[1]);
  },
  enumerable: true,
  configurable: true,
});

LinearRange.prototype.interpolateTo = function (this: LinearRange, that: unknown): Interpolator<LinearRange> | null {
  if (that instanceof LinearRange) {
    return LinearRangeInterpolator(this, that);
  }
  return null;
} as typeof LinearRange.prototype.interpolateTo;

LinearRange.prototype.canEqual = function (that: unknown): boolean {
  return that instanceof LinearRange;
};

LinearRange.prototype.equals = function (that: unknown): boolean {
  if (this === that) {
    return true;
  } else if (that instanceof LinearRange) {
    return that.canEqual(this) && this[0] === that[0] && this[1] === that[1];
  }
  return false;
};

LinearRange.prototype.toString = function (): string {
  return "LinearRange(" + this[0] + ", " + this[1] + ")";
};
