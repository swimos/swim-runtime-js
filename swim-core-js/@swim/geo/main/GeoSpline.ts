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
import {CurveR2, SplineR2} from "@swim/math";
import {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";
import {GeoPoint} from "./GeoPoint";
import {GeoCurve} from "./GeoCurve";
import {GeoSplineBuilder} from "./GeoSplineBuilder";
import {GeoBox} from "./GeoBox";

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
      const newCurves = new Array<CurveR2>(n);
      for (let i = 0; i < n; i += 1) {
        newCurves[i] = oldCurves[i].project(f);
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

  static builder(): GeoSplineBuilder {
    return new GeoSpline.Builder();
  }

  // Forward type declarations
  /** @hidden */
  static Builder: typeof GeoSplineBuilder; // defined by GeoSplineBuilder
}
