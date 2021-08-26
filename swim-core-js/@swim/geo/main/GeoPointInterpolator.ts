// Copyright 2015-2021 Swim Inc.
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
    const lng0 = p0.lng;
    const lat0 = p0.lat;
    const p1 = interpolator[1];
    const lng1 = p1.lng;
    const lat1 = p1.lat;
    let lng: number;
    if (lng0 > 0 && lng1 < 0 && lng0 - lng1 > 180) {
      // east across anti-meridian
      const w = 180 - lng0;
      const e = 180 + lng1;
      const uw = w / (w + e);
      if (u < uw) {
        lng = lng0 + (u / uw) * w;
      } else {
        const ue = 1 - uw;
        lng = -180 + ((u - uw) / ue) * e;
      }
    } else if (lng0 < 0 && lng1 > 0 && lng1 - lng0 > 180) {
      // west across anti-meridian
      const e = 180 + lng0;
      const w = 180 - lng1;
      const ue = e / (e + w);
      if (u < ue) {
        lng = lng0 - (u / ue) * e;
      } else {
        const uw = 1 - ue;
        lng = 180 - ((u - ue) / uw) * w;
      }
    } else {
      lng = lng0 + u * (lng1 - lng0);
    }
    const lat = lat0 + u * (lat1 - lat0);
    return new GeoPoint(lng, lat);
  } as Interpolator<GeoPoint>;
  Object.setPrototypeOf(interpolator, GeoPointInterpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: p0.normalized(),
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: p1.normalized(),
    enumerable: true,
  });
  return interpolator;
} as {
  (p0: GeoPoint, p1: GeoPoint): Interpolator<GeoPoint>;

  /** @hidden */
  prototype: Interpolator<GeoPoint>;
};

GeoPointInterpolator.prototype = Object.create(Interpolator.prototype);
