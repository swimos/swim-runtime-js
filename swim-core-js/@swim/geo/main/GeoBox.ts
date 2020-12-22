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

import {Equivalent, HashCode, Murmur3, Objects} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import {BoxR2} from "@swim/math";
import {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";
import {AnyGeoPoint, GeoPoint} from "./GeoPoint";
import {GeoSegment} from "./GeoSegment";

export type AnyGeoBox = GeoBox | GeoBoxInit;

export interface GeoBoxInit {
  lngMin: number;
  latMin: number;
  lngMax: number;
  latMax: number;
}

export class GeoBox extends GeoShape implements Equivalent<GeoBox>, HashCode, Debug {
  /** @hidden */
  readonly _lngMin: number;
  /** @hidden */
  readonly _latMin: number;
  /** @hidden */
  readonly _lngMax: number;
  /** @hidden */
  readonly _latMax: number;

  constructor(lngMin: number, latMin: number, lngMax: number, latMax: number) {
    super();
    this._lngMin = lngMin;
    this._latMin = latMin;
    this._lngMax = lngMax;
    this._latMax = latMax;
  }

  isDefined(): boolean {
    return isFinite(this._lngMin) && isFinite(this._latMin)
        && isFinite(this._lngMax) && isFinite(this._latMax);
  }

  get lngMin(): number {
    return this._lngMin;
  }

  get latMin(): number {
    return this._latMin;
  }

  get lngMax(): number {
    return this._lngMax;
  }

  get latMax(): number {
    return this._latMax;
  }

  get west(): number {
    return this._lngMin;
  }

  get north(): number {
    return this._latMin;
  }

  get east(): number {
    return this._lngMax;
  }

  get south(): number {
    return this._latMax;
  }

  get northWest(): GeoPoint {
    return new GeoPoint(this._lngMin, this._latMin);
  }

  get northEast(): GeoPoint {
    return new GeoPoint(this._lngMax, this._latMin);
  }

  get southEast(): GeoPoint {
    return new GeoPoint(this._lngMax, this._latMax);
  }

  get southWest(): GeoPoint {
    return new GeoPoint(this._lngMin, this._latMax);
  }

  get center(): GeoPoint {
    return new GeoPoint((this._lngMin + this._lngMax) / 2,
                        (this._latMin + this._latMax) / 2);
  }

  contains(that: AnyGeoPoint | AnyGeoBox): boolean;
  contains(lng: number, lat: number): boolean;
  contains(that: AnyGeoPoint | AnyGeoBox | number, y?: number): boolean {
    if (typeof that === "number") {
      return this._lngMin <= that && that <= this._lngMax
          && this._latMin <= y! && y! <= this._latMax;
    } else if (GeoPoint.isAny(that)) {
      return this.containsPoint(GeoPoint.fromAny(that));
    } else if (GeoSegment.isAny(that)) {
      return this.containsSegment(GeoSegment.fromAny(that));
    } else if (GeoBox.isAny(that)) {
      return this.containsBox(GeoBox.fromAny(that));
    } else {
      throw new TypeError("" + that);
    }
  }

  /** @hidden */
  containsPoint(that: GeoPoint): boolean {
    return this._lngMin <= that._lng && that._lng <= this._lngMax
        && this._latMin <= that._lat && that._lat <= this._latMax;
  }

  /** @hidden */
  containsSegment(that: GeoSegment): boolean {
    return this._lngMin <= that._lng0 && that._lng0 <= this._lngMax
        && this._latMin <= that._lat0 && that._lat0 <= this._latMax
        && this._lngMin <= that._lng1 && that._lng1 <= this._lngMax
        && this._latMin <= that._lat1 && that._lat1 <= this._latMax;
  }

  /** @hidden */
  containsBox(that: GeoBox): boolean {
    return this._lngMin <= that._lngMin && that._lngMax <= this._lngMax
        && this._latMin <= that._latMin && that._latMax <= this._latMax;
  }

  intersects(that: AnyGeoPoint | AnyGeoBox): boolean {
    if (GeoPoint.isAny(that)) {
      return this.intersectsPoint(GeoPoint.fromAny(that));
    } else if (GeoSegment.isAny(that)) {
      return this.intersectsSegment(GeoSegment.fromAny(that));
    } else if (GeoBox.isAny(that)) {
      return this.intersectsBox(GeoBox.fromAny(that));
    } else {
      throw new TypeError("" + that);
    }
  }

  /** @hidden */
  intersectsPoint(that: GeoPoint): boolean {
    return this._lngMin <= that._lng && that._lng <= this._lngMax
        && this._latMin <= that._lat && that._lat <= this._latMax;
  }

  /** @hidden */
  intersectsSegment(that: GeoSegment): boolean {
    const lngMin = this._lngMin;
    const latMin = this._latMin;
    const lngMax = this._lngMax;
    const latMax = this._latMax;
    const lng0 = that._lng0;
    const lat0 = that._lat0;
    const lng1 = that._lng1;
    const lat1 = that._lat1;
    if (lng0 < lngMin && lng1 < lngMin || lng0 > lngMax && lng1 > lngMax ||
        lat0 < latMin && lat1 < latMin || lat0 > latMax && lat1 > latMax) {
      return false;
    } else if (lng0 > lngMin && lng0 < lngMax && lat0 > latMin && lat0 < latMax) {
      return true;
    } else if ((BoxR2.intersectsSegment(lng0 - lngMin, lng1 - lngMin, lng0, lat0, lng1, lat1) && BoxR2._hitY > latMin && BoxR2._hitY < latMax)
            || (BoxR2.intersectsSegment(lat0 - latMin, lat1 - latMin, lng0, lat0, lng1, lat1) && BoxR2._hitX > lngMin && BoxR2._hitX < lngMax)
            || (BoxR2.intersectsSegment(lng0 - lngMax, lng1 - lngMax, lng0, lat0, lng1, lat1) && BoxR2._hitY > latMin && BoxR2._hitY < latMax)
            || (BoxR2.intersectsSegment(lat0 - latMax, lat1 - latMax, lng0, lat0, lng1, lat1) && BoxR2._hitX > lngMin && BoxR2._hitX < lngMax)) {
      return true;
    } else {
      return false;
    }
  }

  /** @hidden */
  intersectsBox(that: GeoBox): boolean {
    return this._lngMin <= that._lngMax && that._lngMin <= this._lngMax
        && this._latMin <= that._latMax && that._latMin <= this._latMax;
  }

  union(that: AnyGeoShape): GeoBox {
    return super.union(that) as GeoBox;
  }

  project(f: GeoProjection): BoxR2 {
    const bottomLeft = f.project(this._lngMin, this._latMin);
    const topRight = f.project(this._lngMax, this._latMax);
    let xMin = bottomLeft._x;
    let yMin = bottomLeft._y;
    let xMax = topRight._x;
    let yMax = topRight._y;
    if (xMin > xMax) {
      const x = xMin;
      xMin = xMax;
      xMax = x;
    }
    if (yMin > yMax) {
      const y = yMin;
      yMin = yMax;
      yMax = y;
    }
    if (!isFinite(xMin)) {
      xMin = -Infinity;
    }
    if (!isFinite(yMin)) {
      yMin = -Infinity;
    }
    if (!isFinite(xMax)) {
      xMax = Infinity;
    }
    if (!isFinite(yMax)) {
      yMax = Infinity;
    }
    return new BoxR2(xMin, yMin, xMax, yMax);
  }

  boundingBox(): GeoBox {
    return this;
  }

  toAny(): GeoBoxInit {
    return {
      lngMin: this._lngMin,
      latMin: this._latMin,
      lngMax: this._lngMax,
      latMax: this._latMax,
    };
  }

  equivalentTo(that: GeoBox, epsilon?: number): boolean {
    return Objects.equivalent(that._lngMin, this._lngMin, epsilon)
        && Objects.equivalent(that._latMin, this._latMin, epsilon)
        && Objects.equivalent(that._lngMax, this._lngMax, epsilon)
        && Objects.equivalent(that._latMax, this._latMax, epsilon);
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoBox) {
      return this._lngMin === that._lngMin && this._latMin === that._latMin
          && this._lngMax === that._lngMax && this._latMax === that._latMax;
    }
    return false;
  }

  hashCode(): number {
    if (GeoBox._hashSeed === void 0) {
      GeoBox._hashSeed = Murmur3.seed(GeoBox);
    }
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(GeoBox._hashSeed,
        Murmur3.hash(this._lngMin)), Murmur3.hash(this._latMin)),
        Murmur3.hash(this._lngMax)), Murmur3.hash(this._latMax)));
  }

  debug(output: Output): void {
    output.write("GeoBox").write(46/*'.'*/).write("of").write(40/*'('*/)
        .debug(this._lngMin).write(", ").debug(this._latMin).write(", ")
        .debug(this._lngMax).write(", ").debug(this._latMax).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  private static _hashSeed?: number;

  private static _undefined?: GeoBox;
  static undefined(): GeoBox {
    if (GeoBox._undefined === void 0) {
      GeoBox._undefined = new GeoBox(Infinity, Infinity, -Infinity, -Infinity);
    }
    return GeoBox._undefined;
  }

  private static _globe?: GeoBox;
  static globe(): GeoBox {
    if (GeoBox._globe === void 0) {
      GeoBox._globe = new GeoBox(-180, -90, 180, 90);
    }
    return GeoBox._globe;
  }

  static of(lngMin: number, latMin: number, lngMax?: number, latMax?: number): GeoBox {
    if (lngMax === void 0) {
      lngMax = lngMin;
    }
    if (latMax === void 0) {
      latMax = latMin;
    }
    return new GeoBox(lngMin, latMin, lngMax, latMax);
  }

  static fromInit(value: GeoBoxInit): GeoBox {
    return new GeoBox(value.lngMin, value.latMin, value.lngMax, value.latMax);
  }

  static fromAny(value: AnyGeoBox): GeoBox {
    if (value instanceof GeoBox) {
      return value;
    } else if (GeoBox.isInit(value)) {
      return GeoBox.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  /** @hidden */
  static isInit(value: unknown): value is GeoBoxInit {
    if (typeof value === "object" && value !== null) {
      const init = value as GeoBoxInit;
      return typeof init.lngMin === "number"
          && typeof init.latMin === "number"
          && typeof init.lngMax === "number"
          && typeof init.latMax === "number";
    }
    return false;
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyGeoBox {
    return value instanceof GeoBox
        || GeoBox.isInit(value);
  }
}
GeoShape.Box = GeoBox;
