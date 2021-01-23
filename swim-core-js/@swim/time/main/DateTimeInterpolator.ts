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
import {DateTime} from "./DateTime";

/** @hidden */
export function DateTimeInterpolator(d0: DateTime, d1: DateTime): Interpolator<DateTime> {
  const interpolator = function (u: number): DateTime {
    const d0 = interpolator[0];
    const d1 = interpolator[1];
    return new DateTime(d0._time + u * (d1._time - d0._time), d1._zone);
  } as Interpolator<DateTime>;
  Object.setPrototypeOf(interpolator, DateTimeInterpolator.prototype);
  Object.defineProperty(interpolator, 0, {
    value: d0,
    enumerable: true,
  });
  Object.defineProperty(interpolator, 1, {
    value: d1,
    enumerable: true,
  });
  return interpolator;
}
__extends(DateTimeInterpolator, Interpolator);
