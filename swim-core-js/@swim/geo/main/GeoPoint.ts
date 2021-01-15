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

import {Murmur3, Equivalent, HashCode, Numbers, Constructors} from "@swim/util";
import {Output, Debug, Format} from "@swim/codec";
import type {PointR2} from "@swim/math";
import type {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";

export type AnyGeoPoint = GeoPoint | GeoPointInit | GeoPointTuple;

export interface GeoPointInit {
  lng: number;
  lat: number;
}

export type GeoPointTuple = [number, number];

/**
 * A geographic point represented by a WGS84 longitude and latitude.
 */
export class GeoPoint extends GeoShape implements HashCode, Equivalent, Debug {
  /** @hidden */
  readonly _lng: number;
  /** @hidden */
  readonly _lat: number;

  constructor(lng: number, lat: number) {
    super();
    this._lng = lng;
    this._lat = lat;
  }

  isDefined(): boolean {
    return isFinite(this._lng) && isFinite(this._lat);
  }

  get lng(): number {
    return this._lng;
  }

  get lat(): number {
    return this._lat;
  }

  get lngMin(): number {
    return this._lng;
  }

  get latMin(): number {
    return this._lat;
  }

  get lngMax(): number {
    return this._lng;
  }

  get latMax(): number {
    return this._lat;
  }

  contains(that: AnyGeoShape): boolean;
  contains(lng: number, lat: number): boolean;
  contains(that: AnyGeoShape | number, lat?: number): boolean {
    if (typeof that === "number") {
      return this._lng === that && this._lat === lat!;
    } else {
      that = GeoShape.fromAny(that);
      if (that instanceof GeoPoint) {
        return this._lng === that._lng && this._lat === that._lat;
      } else if (that instanceof GeoShape) {
        return this._lng <= that.lngMin && that.lngMax <= this._lng
            && this._lat <= that.latMin && that.latMax <= this._lat;
      }
      return false;
    }
  }

  intersects(that: AnyGeoShape): boolean {
    that = GeoShape.fromAny(that);
    return (that as GeoShape).intersects(this);
  }

  project(f: GeoProjection): PointR2 {
    return f.project(this);
  }

  toAny(): GeoPointInit {
    return {
      lng: this._lng,
      lat: this._lat,
    };
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoPoint) {
      return Numbers.equivalent(that._lng, this._lng, epsilon)
          && Numbers.equivalent(that._lat, this._lat, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoPoint) {
      return this._lng === that._lng && this._lat === that._lat;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(GeoPoint),
        Numbers.hash(this._lng)), Numbers.hash(this._lat)));
  }

  debug(output: Output): void {
    output = output.write("GeoPoint").write(46/*'.'*/).write("of").write(40/*'('*/)
        .debug(this._lng).write(", ").debug(this._lat).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  private static _origin?: GeoPoint;
  static origin(): GeoPoint {
    if (GeoPoint._origin === void 0) {
      GeoPoint._origin = new GeoPoint(0, 0);
    }
    return GeoPoint._origin;
  }

  private static _undefined?: GeoPoint;
  static undefined(): GeoPoint {
    if (GeoPoint._undefined === void 0) {
      GeoPoint._undefined = new GeoPoint(NaN, NaN);
    }
    return GeoPoint._undefined;
  }

  static of(lng: number, lat: number): GeoPoint {
    return new GeoPoint(lng, lat);
  }

  static fromInit(value: GeoPointInit): GeoPoint {
    return new GeoPoint(value.lng, value.lat);
  }

  static fromTuple(value: GeoPointTuple): GeoPoint {
    return new GeoPoint(value[0], value[1]);
  }

  static fromAny(value: AnyGeoPoint): GeoPoint {
    if (value instanceof GeoPoint) {
      return value;
    } else if (GeoPoint.isInit(value)) {
      return GeoPoint.fromInit(value);
    } else if (GeoPoint.isTuple(value)) {
      return GeoPoint.fromTuple(value);
    }
    throw new TypeError("" + value);
  }

  /** @hidden */
  static isInit(value: unknown): value is GeoPointInit {
    if (typeof value === "object" && value !== null) {
      const init = value as GeoPointInit;
      return typeof init.lng === "number"
          && typeof init.lat === "number";
    }
    return false;
  }

  /** @hidden */
  static isTuple(value: unknown): value is GeoPointTuple {
    return Array.isArray(value)
        && value.length === 2
        && typeof value[0] === "number"
        && typeof value[1] === "number";
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyGeoPoint {
    return value instanceof GeoPoint
        || GeoPoint.isInit(value)
        || GeoPoint.isTuple(value);
  }
}
GeoShape.Point = GeoPoint;
