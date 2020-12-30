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

import {Objects} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import {CurveR2, SegmentR2, SplineR2} from "@swim/math";
import {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";
import {AnyGeoPoint, GeoPoint} from "./GeoPoint";
import {GeoCurve} from "./GeoCurve";
import {GeoSegment} from "./GeoSegment";
import {GeoSplineBuilder} from "./GeoSplineBuilder";
import {GeoBox} from "./GeoBox";

export type AnyGeoSpline = GeoSpline | GeoSplinePoints;

export type GeoSplinePoints = ReadonlyArray<AnyGeoPoint>;

export class GeoSpline extends GeoCurve implements Debug {
  /** @hidden */
  readonly _curves: ReadonlyArray<GeoCurve>;
  /** @hidden */
  readonly _closed: boolean;
  /** @hidden */
  _boundingBox?: GeoBox;

  constructor(curves: ReadonlyArray<GeoCurve>, closed: boolean) {
    super();
    this._curves = curves;
    this._closed = closed;
  }

  isDefined(): boolean {
    return this._curves.length !== 0;
  }

  isClosed(): boolean {
    return this._closed;
  }

  get curves(): ReadonlyArray<GeoCurve> {
    return this._curves;
  }

  get lngMin(): number {
    return this.boundingBox().lngMin;
  }

  get latMin(): number {
    return this.boundingBox().latMin;
  }

  get lngMax(): number {
    return this.boundingBox().lngMax;
  }

  get latMax(): number {
    return this.boundingBox().latMax;
  }

  interpolateLng(u: number): number {
    const curves = this._curves;
    const n = curves.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      return curves[k].interpolateLng(v);
    } else {
      return NaN;
    }
  }

  interpolateLat(u: number): number {
    const curves = this._curves;
    const n = curves.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      return curves[k].interpolateLat(v);
    } else {
      return NaN;
    }
  }

  interpolate(u: number): GeoPoint {
    const curves = this._curves;
    const n = curves.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      return curves[k].interpolate(v);
    } else {
      return new GeoPoint(NaN, NaN);
    }
  }

  contains(that: AnyGeoShape): boolean;
  contains(lng: number, lat: number): boolean;
  contains(that: AnyGeoShape | number, lat?: number): boolean {
    return false; // TODO
  }

  intersects(that: AnyGeoShape): boolean {
    return false; // TODO
  }

  split(u: number): [GeoSpline, GeoSpline] {
    const curves = this._curves;
    const n = curves.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      const [c0, c1] = curves[k].split(v);
      const curves0 = new Array<GeoCurve>(k + 1);
      const curves1 = new Array<GeoCurve>(n - k);
      for (let i = 0; i < k; i += 1) {
        curves0[i] = curves[i];
      }
      curves0[k] = c0;
      curves1[0] = c1;
      for (let i = k + 1; i < n; i += 1) {
        curves1[i - k] = curves[i];
      }
      return [new GeoSpline(curves0, false), new GeoSpline(curves1, false)];
    } else {
      return [GeoSpline.empty(), GeoSpline.empty()];
    }
  }

  subdivide(u: number): GeoSpline {
    const oldCurves = this._curves;
    const n = oldCurves.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      const [c0, c1] = oldCurves[k].split(v);
      const newCurves = new Array<GeoCurve>(n + 1);
      for (let i = 0; i < k; i += 1) {
        newCurves[i] = oldCurves[i];
      }
      newCurves[k] = c0;
      newCurves[k + 1] = c1;
      for (let i = k + 1; i < n; i += 1) {
        newCurves[i + 1] = oldCurves[i];
      }
      return new GeoSpline(newCurves, this._closed);
    } else {
      return GeoSpline.empty();
    }
  }

  project(f: GeoProjection): SplineR2 {
    const oldCurves = this._curves;
    const n = oldCurves.length;
    if (n > 0) {
      let i = 0;
      const newCurves = new Array<CurveR2>(n);

      // project leading adjacent segments
      let curve = oldCurves[0];
      if (curve instanceof GeoSegment) {
        // project first point
        let p0 = f.project(curve._lng0, curve._lat0);
        while (i < n) {
          curve = oldCurves[i];
          if (curve instanceof GeoSegment) {
            // project next point
            const p1 = f.project(curve._lng1, curve._lat1);
            newCurves[i] = new SegmentR2(p0.x, p0.y, p1.x, p1.y);
            p0 = p1;
            i += 1;
          } else {
            break;
          }
        }
      }

      // project any remaining curves
      while (i < n) {
        curve = oldCurves[i];
        newCurves[i] = curve.project(f);
        i += 1;
      }

      return new SplineR2(newCurves, this._closed);
    } else {
      return SplineR2.empty();
    }
  }

  boundingBox(): GeoBox {
    let boundingBox = this._boundingBox;
    if (boundingBox === void 0) {
      let lngMin = Infinity;
      let latMin = Infinity;
      let lngMax = -Infinity;
      let latMax = -Infinity;
      const curves = this._curves;
      for (let i = 0, n = curves.length; i < n; i += 1) {
        const curve = curves[i];
        lngMin = Math.min(lngMin, curve.lngMin);
        latMin = Math.min(latMin, curve.latMin);
        lngMax = Math.max(curve.lngMax, lngMax);
        latMax = Math.max(curve.latMax, latMax);
      }
      boundingBox = new GeoShape.Box(lngMin, latMin, lngMax, latMax);
      this._boundingBox = boundingBox;
    }
    return boundingBox;
  }

  forEachCoord<R, S = unknown>(callback: (this: S, lng: number, lat: number) => R | void,
                               thisArg?: S): R | undefined {
    const curves = this._curves;
    const n = curves.length;
    if (n > 0) {
      let curve = curves[0];
      let result = curve.forEachCoord(callback, thisArg);
      if (result !== void 0) {
        return result;
      }
      for (let i = 1; i < n; i += 1) {
        curve = curves[i];
        result = curve.forEachCoordRest(callback, thisArg);
        if (result !== void 0) {
          return result;
        }
      }
    }
    return void 0;
  }

  forEachCoordRest<R, S = unknown>(callback: (this: S, lng: number, lat: number) => R | void,
                                   thisArg?: S): R | undefined {
    const curves = this._curves;
    for (let i = 0, n = curves.length; i < n; i += 1) {
      const curve = curves[i];
      const result = curve.forEachCoordRest(callback, thisArg);
      if (result !== void 0) {
        return result;
      }
    }
    return void 0;
  }

  equivalentTo(that: GeoCurve, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSpline) {
      return Objects.equivalent(this._curves, that._curves, epsilon)
          && this._closed === that._closed;
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSpline) {
      return Objects.equal(this._curves, that._curves)
          && this._closed === that._closed;
    }
    return false;
  }

  debug(output: Output): void {
    const curves = this._curves;
    const n = curves.length;
    output = output.write("GeoSpline").write(46/*'.'*/);
    if (n === 0) {
      output = output.write("empty").write(40/*'('*/);
    } else if (n !== 0) {
      output = output.write(this._closed ? "closed" : "open").write(40/*'('*/);
      output = output.debug(curves[0]);
      for (let i = 1; i < n; i += 1) {
        output = output.write(", ").debug(curves[i]);
      }
    }
    output = output.write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  static empty(): GeoSpline {
    return new GeoSpline([], false);
  }

  static open(...curves: GeoCurve[]): GeoSpline {
    return new GeoSpline(curves, false);
  }

  static closed(...curves: GeoCurve[]): GeoSpline {
    return new GeoSpline(curves, true);
  }

  static fromPoints(points: GeoSplinePoints): GeoSpline {
    const n = points.length;
    if (n > 1) {
      const curves = new Array<GeoCurve>(n - 1);
      const p0 = GeoPoint.fromAny(points[0]);
      let p1 = p0;
      for (let i = 1; i < n; i += 1) {
        const p2 = GeoPoint.fromAny(points[i]);
        curves[i - 1] = new GeoSegment(p1.lng, p1.lat, p2.lng, p2.lat);
        p1 = p2;
      }
      const closed = p0.equals(p1);
      return new GeoSpline(curves, closed);
    } else {
      return GeoSpline.empty();
    }
  }

  static fromAny(value: AnyGeoSpline): GeoSpline;
  static fromAny(value: AnyGeoShape): GeoShape;
  static fromAny(value: AnyGeoSpline | AnyGeoShape): GeoShape {
    if (value instanceof GeoSpline) {
      return value;
    } else if (GeoSpline.isPoints(value)) {
      return GeoSpline.fromPoints(value);
    } else {
      return GeoShape.fromAny(value);
    }
  }

  static builder(): GeoSplineBuilder {
    return new GeoSpline.Builder();
  }

  /** @hidden */
  static isPoints(value: unknown): value is GeoSplinePoints {
    return Array.isArray(value)
        && value.length >= 2
        && GeoPoint.isAny(value[0]);
  }

  /** @hidden */
  static isAnySpline(value: unknown): value is AnyGeoSpline {
    return value instanceof GeoSpline
        || GeoSpline.isPoints(value);
  }

  // Forward type declarations
  /** @hidden */
  static Builder: typeof GeoSplineBuilder; // defined by GeoSplineBuilder
}