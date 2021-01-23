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
import {Angle} from "../angle/Angle";
import {SkewTransform} from "./SkewTransform";

/** @hidden */
export function SkewTransformInterpolator(f0: SkewTransform, f1: SkewTransform): Interpolator<SkewTransform> {
  const interpolator = function (u: number): SkewTransform {
    const f0 = interpolator[0];
    const f1 = interpolator[1];
    const x = Angle.from(f0._x.value + u * (f1._x.value - f0._x.value), f1._x.units);
    const y = Angle.from(f0._y.value + u * (f1._y.value - f0._y.value), f1._y.units);
    return new SkewTransform(x, y);
  } as Interpolator<SkewTransform>;
  Object.setPrototypeOf(interpolator, SkewTransformInterpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: f0._x.units === f1._x.units && f0._y.units === f1._y.units
         ? f0 : new SkewTransform(f0._x.to(f1._x.units), f0._y.to(f1._y.units)),
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: f1,
    enumerable: true,
  });
  return interpolator;
}
__extends(SkewTransformInterpolator, Interpolator);
