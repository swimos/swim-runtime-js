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

import {Murmur3, HashCode, Numbers, Constructors} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import type {Interpolate, Interpolator} from "@swim/mapping";
import {SegmentR2} from "@swim/math";
import type {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";
import {GeoPoint} from "./GeoPoint";
import {GeoCurve} from "./GeoCurve";
import {GeoSegmentInterpolator} from "./"; // forward import

export type AnyGeoSegment = GeoSegment | GeoSegmentInit;

export interface GeoSegmentInit {
  lng0: number;
  lat0: number;
  lng1: number;
  lat1: number;
}

export class GeoSegment extends GeoCurve implements Interpolate<GeoSegment>, HashCode, Debug {
  /** @hidden */
  readonly _lng0: number;
  /** @hidden */
  readonly _lat0: number;
  /** @hidden */
  readonly _lng1: number;
  /** @hidden */
  readonly _lat1: number;

  constructor(lng0: number, lat0: number, lng1: number, lat1: number) {
    super();
    this._lng0 = lng0;
    this._lat0 = lat0;
    this._lng1 = lng1;
    this._lat1 = lat1;
  }

  isDefined(): boolean {
    return isFinite(this._lng0) && isFinite(this._lat0)
        && isFinite(this._lng1) && isFinite(this._lat1);
  }

  get lng0(): number {
    return this._lng0;
  }

  get lat0(): number {
    return this._lat0;
  }

  get lng1(): number {
    return this._lng1;
  }

  get lat1(): number {
    return this._lat1;
  }

  get lngMin(): number {
    return Math.min(this._lng0, this._lng1);
  }

  get latMin(): number {
    return Math.min(this._lat0, this._lat1);
  }

  get lngMax(): number {
    return Math.max(this._lng0, this._lng1);
  }

  get latMax(): number {
    return Math.max(this._lat0, this._lat1);
  }

  interpolateLng(u: number): number {
    return (1.0 - u) * this._lng0 + u * this._lng1;
  }

  interpolateLat(u: number): number {
   return (1.0 - u) * this._lat0 + u * this._lat1;
  }

  interpolate(u: number): GeoPoint {
    const v = 1.0 - u;
    const lng01 = v * this._lng0 + u * this._lng1;
    const lat01 = v * this._lat0 + u * this._lat1;
    return new GeoPoint(lng01, lat01);
  }

  contains(that: AnyGeoShape): boolean;
  contains(lng: number, lat: number): boolean;
  contains(that: AnyGeoShape | number, lat?: number): boolean {
    if (typeof that === "number") {
      return SegmentR2.contains(this._lng0, this._lat0, this._lng1, this._lat1, that, lat!);
    } else {
      that = GeoShape.fromAny(that);
      if (that instanceof GeoPoint) {
        return this.containsPoint(that);
      } else if (that instanceof GeoSegment) {
        return this.containsSegment(that);
      }
      return false;
    }
  }

  /** @hidden */
  containsPoint(that: GeoPoint): boolean {
    return SegmentR2.contains(this._lng0, this._lat0, this._lng1, this._lat1, that._lng, that._lat);
  }

  /** @hidden */
  containsSegment(that: GeoSegment): boolean {
    return SegmentR2.contains(this._lng0, this._lat0, this._lng1, this._lat1, that._lng0, that._lat0)
        && SegmentR2.contains(this._lng0, this._lat0, this._lng1, this._lat1, that._lng1, that._lat1);
  }

  intersects(that: AnyGeoShape): boolean {
    that = GeoShape.fromAny(that);
    if (that instanceof GeoPoint) {
      return this.intersectsPoint(that);
    } else if (that instanceof GeoSegment) {
      return this.intersectsSegment(that);
    } else {
      return (that as GeoShape).intersects(this);
    }
    return false;
  }

  /** @hidden */
  intersectsPoint(that: GeoPoint): boolean {
    return SegmentR2.contains(this._lng0, this._lat0, this._lng1, this._lat1, that._lng, that._lat);
  }

  /** @hidden */
  intersectsSegment(that: GeoSegment): boolean {
    return SegmentR2.intersects(this._lng0, this._lat0, this._lng1 - this._lat0, this._lng1 - this._lat0,
                                that._lng0, that._lat0, that._lng1 - that._lat0, that._lng1 - that._lat0);
  }

  split(u: number): [GeoSegment, GeoSegment] {
    const v = 1.0 - u;
    const lng01 = v * this._lng0 + u * this._lng1;
    const lat01 = v * this._lat0 + u * this._lat1;
    const c0 = new GeoSegment(this._lng0, this._lat0, lng01, lat01);
    const c1 = new GeoSegment(lng01, lat01, this._lng1, this._lat1);
    return [c0, c1];
  }

  project(f: GeoProjection): SegmentR2 {
    const p0 = f.project(this._lng0, this._lat0);
    const p1 = f.project(this._lng1, this._lat1);
    return new SegmentR2(p0.x, p0.y, p1.x, p1.y);
  }

  forEachCoord<R>(callback: (lng: number, lat: number) => R | void): R | undefined;
  forEachCoord<R, S>(callback: (this: S, lng: number, lat: number) => R | void,
                     thisArg: S): R | undefined;
  forEachCoord<R, S>(callback: (this: S | undefined, lng: number, lat: number) => R | undefined,
                     thisArg?: S): R | undefined {
    let result: R | void;
    result = callback.call(thisArg, this._lng0, this._lat0);
    if (result !== void 0) {
      return result;
    }
    result = callback.call(thisArg, this._lng1, this._lat1);
    if (result !== void 0) {
      return result;
    }
    return void 0;
  }

  forEachCoordRest<R>(callback: (lng: number, lat: number) => R | void): R | undefined;
  forEachCoordRest<R, S>(callback: (this: S, lng: number, lat: number) => R | void,
                         thisArg: S): R | undefined;
  forEachCoordRest<R, S>(callback: (this: S | undefined, lng: number, lat: number) => R | void,
                         thisArg?: S): R | undefined {
    const result = callback.call(thisArg, this._lng1, this._lat1);
    if (result !== void 0) {
      return result;
    }
    return void 0;
  }

  toAny(): GeoSegmentInit {
    return {
      lng0: this._lng0,
      lat0: this._lat0,
      lng1: this._lng1,
      lat1: this._lat1,
    };
  }

  interpolateTo(that: GeoSegment): Interpolator<GeoSegment>;
  interpolateTo(that: unknown): Interpolator<GeoSegment> | null;
  interpolateTo(that: unknown): Interpolator<GeoSegment> | null {
    if (that instanceof GeoSegment) {
      return GeoSegmentInterpolator(this, that);
    } else {
      return null;
    }
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSegment) {
      return Numbers.equivalent(that._lng0, this._lng0, epsilon)
          && Numbers.equivalent(that._lat0, this._lat0, epsilon)
          && Numbers.equivalent(that._lng1, this._lng1, epsilon)
          && Numbers.equivalent(that._lat1, this._lat1, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSegment) {
      return this._lng0 === that._lng0 && this._lat0 === that._lat0
          && this._lng1 === that._lng1 && this._lat1 === that._lat1;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(
        Constructors.hash(GeoSegment), Numbers.hash(this._lng0)), Numbers.hash(this._lat0)),
        Numbers.hash(this._lng1)), Numbers.hash(this._lat1)));
  }

  debug(output: Output): void {
    output.write("GeoSegment").write(46/*'.'*/).write("of").write(40/*'('*/)
        .debug(this._lng0).write(", ").debug(this._lat0).write(", ")
        .debug(this._lng1).write(", ").debug(this._lat1).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  static of(lng0: number, lat0: number, lng1: number, lat1: number): GeoSegment {
    return new GeoSegment(lng0, lat0, lng1, lat1);
  }

  static fromInit(value: GeoSegmentInit): GeoSegment {
    return new GeoSegment(value.lng0, value.lat0, value.lng1, value.lat1);
  }

  static fromAny(value: AnyGeoSegment): GeoSegment {
    if (value instanceof GeoSegment) {
      return value;
    } else if (GeoSegment.isInit(value)) {
      return GeoSegment.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  /** @hidden */
  static isInit(value: unknown): value is GeoSegmentInit {
    if (typeof value === "object" && value !== null) {
      const init = value as GeoSegmentInit;
      return typeof init.lng0 === "number"
          && typeof init.lat0 === "number"
          && typeof init.lng1 === "number"
          && typeof init.lat1 === "number";
    }
    return false;
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyGeoSegment {
    return value instanceof GeoSegment
        || GeoSegment.isInit(value);
  }
}
GeoShape.Segment = GeoSegment;
