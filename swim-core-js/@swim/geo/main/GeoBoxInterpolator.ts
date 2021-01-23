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
import {GeoBox} from "./GeoBox";

/** @hidden */
export function GeoBoxInterpolator(s0: GeoBox, s1: GeoBox): Interpolator<GeoBox> {
  const interpolator = function (u: number): GeoBox {
    const s0 = interpolator[0];
    const s1 = interpolator[1];
    const lngMin = s0._lngMin + u * (s1._lngMin - s0._lngMin);
    const latMin = s0._latMin + u * (s1._latMin - s0._latMin);
    const lngMax = s0._lngMax + u * (s1._lngMax - s0._lngMax);
    const latMax = s0._latMax + u * (s1._latMax - s0._latMax);
    return new GeoBox(lngMin, latMin, lngMax, latMax);
  } as Interpolator<GeoBox>;
  Object.setPrototypeOf(interpolator, GeoBoxInterpolator.prototype);
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
__extends(GeoBoxInterpolator, Interpolator);
