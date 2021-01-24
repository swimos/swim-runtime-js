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
import {GeoPoint} from "./GeoPoint";

/** @hidden */
export const GeoPointInterpolator = function (p0: GeoPoint, p1: GeoPoint): Interpolator<GeoPoint> {
  const interpolator = function (u: number): GeoPoint {
    const p0 = interpolator[0];
    const p1 = interpolator[1];
    const lng = p0._lng + u * (p1._lng - p0._lng);
    const lat = p0._lat + u * (p1._lat - p0._lat);
    return new GeoPoint(lng, lat);
  } as Interpolator<GeoPoint>;
  Object.setPrototypeOf(interpolator, GeoPointInterpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: p0,
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: p1,
    enumerable: true,
  });
  return interpolator;
} as {
  (p0: GeoPoint, p1: GeoPoint): Interpolator<GeoPoint>;

  /** @hidden */
  prototype: Interpolator<GeoPoint>;
};

GeoPointInterpolator.prototype = Object.create(Interpolator.prototype);
