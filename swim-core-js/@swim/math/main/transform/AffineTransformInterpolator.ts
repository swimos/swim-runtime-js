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
import {AffineTransform} from "./AffineTransform";

/** @hidden */
export function AffineTransformInterpolator(f0: AffineTransform, f1: AffineTransform): Interpolator<AffineTransform> {
  const interpolator = function (u: number): AffineTransform {
    // TODO: interpolate and recompose matrices
    const f0 = interpolator[0];
    const f1 = interpolator[1];
    const x0 = f0._x0 + u * (f1._x0 - f0._x0);
    const y0 = f0._y0 + u * (f1._y0 - f0._y0);
    const x1 = f0._x1 + u * (f1._x1 - f0._x1);
    const y1 = f0._y1 + u * (f1._y1 - f0._y1);
    const tx = f0._tx + u * (f1._tx - f0._tx);
    const ty = f0._ty + u * (f1._ty - f0._ty);
    return new AffineTransform(x0, y0, x1, y1, tx, ty);
  } as Interpolator<AffineTransform>;
  Object.setPrototypeOf(interpolator, AffineTransformInterpolator.prototype);
  // TODO: decompose matrices
  Object.defineProperty(interpolator, 0, {
    value: f0,
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: f1,
    enumerable: true,
  });
  return interpolator;
}
__extends(AffineTransformInterpolator, Interpolator);
