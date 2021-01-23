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
import {GeoSegment} from "./GeoSegment";

/** @hidden */
export function GeoSegmentInterpolator(s0: GeoSegment, s1: GeoSegment): Interpolator<GeoSegment> {
  const interpolator = function (u: number): GeoSegment {
    const s0 = interpolator[0];
    const s1 = interpolator[1];
    const lng0 = s0._lng0 + u * (s1._lng0 - s0._lng0);
    const lat0 = s0._lat0 + u * (s1._lat0 - s0._lat0);
    const lng1 = s0._lng1 + u * (s1._lng1 - s0._lng1);
    const lat1 = s0._lat1 + u * (s1._lat1 - s0._lat1);
    return new GeoSegment(lng0, lat0, lng1, lat1);
  } as Interpolator<GeoSegment>;
  Object.setPrototypeOf(interpolator, GeoSegmentInterpolator.prototype);
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
__extends(GeoSegmentInterpolator, Interpolator);
