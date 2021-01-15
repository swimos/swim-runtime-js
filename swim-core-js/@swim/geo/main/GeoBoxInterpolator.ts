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

import type {Interpolator} from "@swim/interpolate";
import {AnyGeoBox, GeoBox} from "./GeoBox";
import {GeoShapeInterpolator} from "./GeoShapeInterpolator";

export class GeoBoxInterpolator extends GeoShapeInterpolator<GeoBox, AnyGeoBox> {
  /** @hidden */
  readonly xMin: number;
  /** @hidden */
  readonly dxMin: number;
  /** @hidden */
  readonly yMin: number;
  /** @hidden */
  readonly dyMin: number;
  /** @hidden */
  readonly xMax: number;
  /** @hidden */
  readonly dxMax: number;
  /** @hidden */
  readonly yMax: number;
  /** @hidden */
  readonly dyMax: number;

  constructor(s0: GeoBox, s1: GeoBox) {
    super();
    this.xMin = s0.latMin;
    this.dxMin = s1.latMin - this.xMin;
    this.yMin = s0.lngMin;
    this.dyMin = s1.lngMin - this.yMin;
    this.xMax = s0.latMax;
    this.dxMax = s1.latMax - this.xMax;
    this.yMax = s0.lngMax;
    this.dyMax = s1.lngMax - this.yMax;
  }

  interpolate(u: number): GeoBox {
    const xMin = this.xMin + this.dxMin * u;
    const yMin = this.yMin + this.dyMin * u;
    const xMax = this.xMax + this.dxMax * u;
    const yMax = this.yMax + this.dyMax * u;
    return new GeoBox(xMin, yMin, xMax, yMax);
  }

  deinterpolate(b: AnyGeoBox): number {
    return 0;
  }

  range(): readonly [GeoBox, GeoBox];
  range(ss: readonly [AnyGeoBox, AnyGeoBox]): GeoBoxInterpolator;
  range(s0: AnyGeoBox, s1: AnyGeoBox): GeoBoxInterpolator;
  range(s0?: readonly [AnyGeoBox, AnyGeoBox] | AnyGeoBox,
        s1?: AnyGeoBox): readonly [GeoBox, GeoBox] | GeoBoxInterpolator {
    if (arguments.length === 0) {
      return [this.interpolate(0), this.interpolate(1)];
    } else if (arguments.length === 1) {
      s0 = s0 as readonly [AnyGeoBox, AnyGeoBox];
      return GeoBoxInterpolator.between(s0[0], s0[1]);
    } else {
      return GeoBoxInterpolator.between(s0 as AnyGeoBox, s1 as AnyGeoBox);
    }
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoBoxInterpolator) {
      return this.xMin === that.xMin && this.dxMin === that.dxMin
          && this.yMin === that.yMin && this.dyMin === that.dyMin
          && this.xMax === that.xMax && this.dxMax === that.dxMax
          && this.yMax === that.yMax && this.dyMax === that.dyMax;
    }
    return false;
  }

  static between(s0: AnyGeoBox, s1: AnyGeoBox): GeoBoxInterpolator;
  static between(a: unknown, b: unknown): Interpolator<unknown>;
  static between(a: unknown, b: unknown): Interpolator<unknown> {
    if (a instanceof GeoBox && b instanceof GeoBox) {
      return new GeoBoxInterpolator(a, b);
    } else if (GeoBox.isAny(a) && GeoBox.isAny(b)) {
      return new GeoBoxInterpolator(GeoBox.fromAny(a), GeoBox.fromAny(b));
    }
    return GeoShapeInterpolator.between(a, b);
  }
}
GeoShapeInterpolator.Box = GeoBoxInterpolator;
