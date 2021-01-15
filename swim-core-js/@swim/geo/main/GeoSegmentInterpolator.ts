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
import {AnyGeoSegment, GeoSegment} from "./GeoSegment";
import {GeoShapeInterpolator} from "./GeoShapeInterpolator";

export class GeoSegmentInterpolator extends GeoShapeInterpolator<GeoSegment, AnyGeoSegment> {
  /** @hidden */
  readonly x0: number;
  /** @hidden */
  readonly dx0: number;
  /** @hidden */
  readonly y0: number;
  /** @hidden */
  readonly dy0: number;
  /** @hidden */
  readonly x1: number;
  /** @hidden */
  readonly dx1: number;
  /** @hidden */
  readonly y1: number;
  /** @hidden */
  readonly dy1: number;

  constructor(s0: GeoSegment, s1: GeoSegment) {
    super();
    this.x0 = s0.lng0;
    this.dx0 = s1.lng0 - this.x0;
    this.y0 = s0.lat0;
    this.dy0 = s1.lat0 - this.y0;
    this.x1 = s0.lng1;
    this.dx1 = s1.lng1 - this.x1;
    this.y1 = s0.lat1;
    this.dy1 = s1.lat1 - this.y1;
  }

  interpolate(u: number): GeoSegment {
    const x0 = this.x0 + this.dx0 * u;
    const y0 = this.y0 + this.dy0 * u;
    const x1 = this.x1 + this.dx1 * u;
    const y1 = this.y1 + this.dy1 * u;
    return new GeoSegment(x0, y0, x1, y1);
  }

  deinterpolate(s: AnyGeoSegment): number {
    return 0;
  }

  range(): readonly [GeoSegment, GeoSegment];
  range(ss: readonly [AnyGeoSegment, AnyGeoSegment]): GeoSegmentInterpolator;
  range(s0: AnyGeoSegment, s1: AnyGeoSegment): GeoSegmentInterpolator;
  range(s0?: readonly [AnyGeoSegment, AnyGeoSegment] | AnyGeoSegment,
        s1?: AnyGeoSegment): readonly [GeoSegment, GeoSegment] | GeoSegmentInterpolator {
    if (arguments.length === 0) {
      return [this.interpolate(0), this.interpolate(1)];
    } else if (arguments.length === 1) {
      s0 = s0 as readonly [AnyGeoSegment, AnyGeoSegment];
      return GeoSegmentInterpolator.between(s0[0], s0[1]);
    } else {
      return GeoSegmentInterpolator.between(s0 as AnyGeoSegment, s1 as AnyGeoSegment);
    }
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSegmentInterpolator) {
      return this.x0 === that.x0 && this.dx0 === that.dx0
          && this.y0 === that.y0 && this.dy0 === that.dy0
          && this.x1 === that.x1 && this.dx1 === that.dx1
          && this.y1 === that.y1 && this.dy1 === that.dy1;
    }
    return false;
  }

  static between(s0: AnyGeoSegment, s1: AnyGeoSegment): GeoSegmentInterpolator;
  static between(a: unknown, b: unknown): Interpolator<unknown>;
  static between(a: unknown, b: unknown): Interpolator<unknown> {
    if (a instanceof GeoSegment && b instanceof GeoSegment) {
      return new GeoSegmentInterpolator(a, b);
    } else if (GeoSegment.isAny(a) && GeoSegment.isAny(b)) {
      return new GeoSegmentInterpolator(GeoSegment.fromAny(a), GeoSegment.fromAny(b));
    }
    return GeoShapeInterpolator.between(a, b);
  }
}
GeoShapeInterpolator.Segment = GeoSegmentInterpolator;
