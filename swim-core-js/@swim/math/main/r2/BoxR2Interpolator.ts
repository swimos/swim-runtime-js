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
import {BoxR2} from "./BoxR2";

/** @hidden */
export function BoxR2Interpolator(s0: BoxR2, s1: BoxR2): Interpolator<BoxR2> {
  const interpolator = function (u: number): BoxR2 {
    const s0 = interpolator[0];
    const s1 = interpolator[1];
    const xMin = s0._xMin + u * (s1._xMin - s0._xMin);
    const yMin = s0._yMin + u * (s1._yMin - s0._yMin);
    const xMax = s0._xMax + u * (s1._xMax - s0._xMax);
    const yMax = s0._yMax + u * (s1._yMax - s0._yMax);
    return new BoxR2(xMin, yMin, xMax, yMax);
  } as Interpolator<BoxR2>;
  Object.setPrototypeOf(interpolator, BoxR2Interpolator.prototype);
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
__extends(BoxR2Interpolator, Interpolator);
