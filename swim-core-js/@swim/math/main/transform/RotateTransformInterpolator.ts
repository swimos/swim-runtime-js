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

import {Interpolator} from "@swim/mapping";
import {Angle} from "../angle/Angle";
import {RotateTransform} from "./RotateTransform";

/** @hidden */
export const RotateTransformInterpolator = function (f0: RotateTransform, f1: RotateTransform): Interpolator<RotateTransform> {
  const interpolator = function (u: number): RotateTransform {
    const f0 = interpolator[0];
    const f1 = interpolator[1];
    const a = Angle.from(f0._a.value + u * (f1._a.value - f0._a.value), f1._a.units);
    return new RotateTransform(a);
  } as Interpolator<RotateTransform>;
  Object.setPrototypeOf(interpolator, RotateTransformInterpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: f0._a.units === f1._a.units ? f0 : new RotateTransform(f0._a.to(f1._a.units)),
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: f1,
    enumerable: true,
  });
  return interpolator;
} as {
  (f0: RotateTransform, f1: RotateTransform): Interpolator<RotateTransform>;

  /** @hidden */
  prototype: Interpolator<RotateTransform>;
};

RotateTransformInterpolator.prototype = Object.create(Interpolator.prototype);
