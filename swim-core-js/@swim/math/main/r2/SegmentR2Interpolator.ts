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
import {Interpolator} from "@swim/mapping";
import {SegmentR2} from "./SegmentR2";

/** @hidden */
export function SegmentR2Interpolator(s0: SegmentR2, s1: SegmentR2): Interpolator<SegmentR2> {
  const interpolator = function (u: number): SegmentR2 {
    const s0 = interpolator[0];
    const s1 = interpolator[1];
    const x0 = s0._x0 + u * (s1._x0 - s0._x0);
    const y0 = s0._y0 + u * (s1._y0 - s0._y0);
    const x1 = s0._x1 + u * (s1._x1 - s0._x1);
    const y1 = s0._y1 + u * (s1._y1 - s0._y1);
    return new SegmentR2(x0, y0, x1, y1);
  } as Interpolator<SegmentR2>;
  Object.setPrototypeOf(interpolator, SegmentR2Interpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: s0,
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: s1,
    enumerable: true,
  });
  return interpolator;
}
__extends(SegmentR2Interpolator, Interpolator);
