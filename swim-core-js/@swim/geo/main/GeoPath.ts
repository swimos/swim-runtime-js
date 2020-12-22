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

import {Equivalent, Equals, Objects} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import {SplineR2, PathR2} from "@swim/math";
import {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";
import {GeoPoint} from "./GeoPoint";
import {GeoCurve} from "./GeoCurve";
import {GeoSpline} from "./GeoSpline";
import {GeoPathBuilder} from "./GeoPathBuilder";
import {GeoBox} from "./GeoBox";

export class GeoPath extends GeoShape implements Equivalent<GeoPath>, Equals, Debug {
  /** @hidden */
  readonly _splines: ReadonlyArray<GeoSpline>;
  /** @hidden */
  _boundingBox?: GeoBox;

  constructor(splines: ReadonlyArray<GeoSpline>) {
    super();
    this._splines = splines;
  }

  isDefined(): boolean {
    return this._splines.length !== 0;
  }

  get splines(): ReadonlyArray<GeoSpline> {
    return this._splines;
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
    const splines = this._splines;
    const n = splines.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      return splines[k].interpolateLng(v);
    } else {
      return NaN;
    }
  }

  interpolateLat(u: number): number {
    const splines = this._splines;
    const n = splines.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      return splines[k].interpolateLat(v);
    } else {
      return NaN;
    }
  }

  interpolate(u: number): GeoPoint {
    const splines = this._splines;
    const n = splines.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      return splines[k].interpolate(v);
    } else {
      return new GeoPoint(NaN, NaN);
    }
  }

  contains(that: AnyGeoShape): boolean;
  contains(x: number, y: number): boolean;
  contains(that: AnyGeoShape | number, y?: number): boolean {
    return false; // TODO
  }

  intersects(that: AnyGeoShape): boolean {
    return false; // TODO
  }

  split(u: number): [GeoPath, GeoPath] {
    const splines = this._splines;
    const n = splines.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      const [s0, s1] = splines[k].split(v);
      const splines0 = new Array<GeoSpline>(k + 1);
      const splines1 = new Array<GeoSpline>(n - k);
      for (let i = 0; i < k; i += 1) {
        splines0[i] = splines[i];
      }
      splines0[k] = s0;
      splines1[0] = s1;
      for (let i = k + 1; i < n; i += 1) {
        splines1[i - k] = splines[i];
      }
      return [new GeoPath(splines0), new GeoPath(splines1)];
    } else {
      return [GeoPath.empty(), GeoPath.empty()];
    }
  }

  subdivide(u: number): GeoPath {
    const oldSplines = this._splines;
    const n = oldSplines.length;
    if (n > 0) {
      const l = 1 / n;
      const k = Math.min(Math.max(0, Math.floor(u / l)), n);
      const v = u * n - k * l;
      const newSplines = new Array<GeoSpline>(n);
      for (let i = 0; i < k; i += 1) {
        newSplines[i] = oldSplines[i];
      }
      newSplines[k] = oldSplines[k].subdivide(v);
      for (let i = k + 1; i < n; i += 1) {
        newSplines[i] = oldSplines[i];
      }
      return new GeoPath(newSplines);
    } else {
      return GeoPath.empty();
    }
  }

  project(f: GeoProjection): PathR2 {
    const oldSplines = this._splines;
    const n = oldSplines.length;
    if (n > 0) {
      const newSplines = new Array<SplineR2>(n);
      for (let i = 0; i < n; i += 1) {
        newSplines[i] = oldSplines[i].project(f);
      }
      return new PathR2(newSplines);
    } else {
      return PathR2.empty();
    }
  }

  boundingBox(): GeoBox {
    let boundingBox = this._boundingBox;
    if (boundingBox === void 0) {
      let lngMin = Infinity;
      let latMin = Infinity;
      let lngMax = -Infinity;
      let latMax = -Infinity;
      const splines = this._splines;
      for (let i = 0, n = splines.length; i < n; i += 1) {
        const spline = splines[i];
        lngMin = Math.min(lngMin, spline.lngMin);
        latMin = Math.min(latMin, spline.latMin);
        lngMax = Math.max(spline.lngMax, lngMax);
        latMax = Math.max(spline.latMax, latMax);
      }
      boundingBox = new GeoShape.Box(lngMin, latMin, lngMax, latMax);
      this._boundingBox = boundingBox;
    }
    return boundingBox;
  }

  equivalentTo(that: GeoPath, epsilon?: number): boolean {
    return this === that || Objects.equivalent(this._splines, that._splines, epsilon);
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoPath) {
      return Objects.equal(this._splines, that._splines);
    }
    return false;
  }

  debug(output: Output): void {
    const splines = this._splines;
    const n = splines.length;
    output = output.write("GeoPath").write(46/*'.'*/);
    if (n === 0) {
      output = output.write("empty").write(40/*'('*/);
    } else if (n === 1) {
      const spline = splines[0];
      output = output.write(spline._closed ? "closed" : "open").write(40/*'('*/);
      const curves = spline._curves;
      const m = curves.length;
      if (m !== 0) {
        output = output.debug(curves[0]);
        for (let i = 1; i < m; i += 1) {
          output = output.write(", ").debug(curves[i]);
        }
      }
    } else {
      output = output.write("of").write(40/*'('*/);
      output = output.debug(splines[0]);
      for (let i = 1; i < n; i += 1) {
        output = output.write(", ").debug(splines[i]);
      }
    }
    output = output.write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  static empty(): GeoPath {
    return new GeoPath([]);
  }

  static of(...splines: GeoSpline[]): GeoPath {
    return new GeoPath(splines);
  }

  static open(...curves: GeoCurve[]): GeoPath {
    return new GeoPath([new GeoSpline(curves, false)]);
  }

  static closed(...curves: GeoCurve[]): GeoPath {
    return new GeoPath([new GeoSpline(curves, true)]);
  }

  static builder(): GeoPathBuilder {
    return new GeoPath.Builder();
  }

  // Forward type declarations
  /** @hidden */
  static Builder: typeof GeoPathBuilder; // defined by GeoPathBuilder
}
