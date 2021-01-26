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

import {Equivalent, Equals, Arrays} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import {ShapeR2, SetR2} from "@swim/math";
import type {GeoProjection} from "./GeoProjection";
import {AnyGeoShape, GeoShape} from "./GeoShape";
import type {GeoBox} from "./GeoBox";

export class GeoSet<S extends GeoShape = GeoShape> extends GeoShape implements Equals, Equivalent, Debug {
  /** @hidden */
  readonly _shapes: ReadonlyArray<S>;
  /** @hidden */
  _boundingBox?: GeoBox;

  constructor(shapes: ReadonlyArray<S>) {
    super();
    this._shapes = shapes;
  }

  isDefined(): boolean {
    return this._shapes.length !== 0;
  }

  get shapes(): ReadonlyArray<S> {
    return this._shapes;
  }

  get lngMin(): number {
    return this.bounds.lngMin;
  }

  get latMin(): number {
    return this.bounds.latMin;
  }

  get lngMax(): number {
    return this.bounds.lngMax;
  }

  get latMax(): number {
    return this.bounds.latMax;
  }

  contains(that: AnyGeoShape): boolean;
  contains(x: number, y: number): boolean;
  contains(that: AnyGeoShape | number, y?: number): boolean {
    return false; // TODO
  }

  intersects(that: AnyGeoShape): boolean {
    return false; // TODO
  }

  project(f: GeoProjection): SetR2 {
    const oldShapes = this._shapes;
    const n = oldShapes.length;
    if (n > 0) {
      const newShapes = new Array<ShapeR2>(n);
      for (let i = 0; i < n; i += 1) {
        newShapes[i] = oldShapes[i]!.project(f);
      }
      return new SetR2(newShapes);
    } else {
      return SetR2.empty();
    }
  }

  get bounds(): GeoBox {
    let boundingBox = this._boundingBox;
    if (boundingBox === void 0) {
      let lngMin = Infinity;
      let latMin = Infinity;
      let lngMax = -Infinity;
      let latMax = -Infinity;
      const shapes = this._shapes;
      for (let i = 0, n = shapes.length; i < n; i += 1) {
        const shape = shapes[i]!;
        lngMin = Math.min(lngMin, shape.lngMin);
        latMin = Math.min(latMin, shape.latMin);
        lngMax = Math.max(shape.lngMax, lngMax);
        latMax = Math.max(shape.latMax, latMax);
      }
      boundingBox = new GeoShape.Box(lngMin, latMin, lngMax, latMax);
      this._boundingBox = boundingBox;
    }
    return boundingBox;
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSet) {
      return Arrays.equivalent(this._shapes, that._shapes, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GeoSet) {
      return Arrays.equal(this._shapes, that._shapes);
    }
    return false;
  }

  debug(output: Output): void {
    const shapes = this._shapes;
    const n = shapes.length;
    output = output.write("GeoSet").write(46/*'.'*/);
    if (n === 0) {
      output = output.write("empty").write(40/*'('*/);
    } else {
      output = output.write("of").write(40/*'('*/);
      output = output.debug(shapes[0]!);
      for (let i = 1; i < n; i += 1) {
        output = output.write(", ").debug(shapes[i]!);
      }
    }
    output = output.write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  static empty<S extends GeoShape>(): GeoSet<S> {
    return new GeoSet([]);
  }

  static of<S extends GeoShape>(...shapes: S[]): GeoSet<S> {
    return new GeoSet(shapes);
  }
}
