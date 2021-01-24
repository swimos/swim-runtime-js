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
import {Length} from "../length/Length";
import {TranslateTransform} from "./TranslateTransform";

/** @hidden */
export const TranslateTransformInterpolator = function (f0: TranslateTransform, f1: TranslateTransform): Interpolator<TranslateTransform> {
  const interpolator = function (u: number): TranslateTransform {
    const f0 = interpolator[0];
    const f1 = interpolator[1];
    const x = Length.from(f0._x.value + u * (f1._x.value - f0._x.value), f1._x.units);
    const y = Length.from(f0._y.value + u * (f1._y.value - f0._y.value), f1._y.units);
    return new TranslateTransform(x, y);
  } as Interpolator<TranslateTransform>;
  Object.setPrototypeOf(interpolator, TranslateTransformInterpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: f0._x.units === f1._x.units && f0._y.units === f1._y.units
         ? f0 : new TranslateTransform(f0._x.to(f1._x.units), f0._y.to(f1._y.units)),
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: f1,
    enumerable: true,
  });
  return interpolator;
} as {
  (f0: TranslateTransform, f1: TranslateTransform): Interpolator<TranslateTransform>;

  /** @hidden */
  prototype: Interpolator<TranslateTransform>;
};

TranslateTransformInterpolator.prototype = Object.create(Interpolator.prototype);
