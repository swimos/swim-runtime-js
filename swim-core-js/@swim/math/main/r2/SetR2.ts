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
import type {R2Function} from "./R2Function";
import {AnyShapeR2, ShapeR2} from "./ShapeR2";
import type {BoxR2} from "./BoxR2";

export class SetR2<S extends ShapeR2 = ShapeR2> extends ShapeR2 implements Equals, Equivalent, Debug {
  /** @hidden */
  readonly _shapes: ReadonlyArray<S>;
  /** @hidden */
  _boundingBox?: BoxR2;

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

  get xMin(): number {
    return this.boundingBox().xMin;
  }

  get yMin(): number {
    return this.boundingBox().yMin;
  }

  get xMax(): number {
    return this.boundingBox().xMax;
  }

  get yMax(): number {
    return this.boundingBox().yMax;
  }

  contains(that: AnyShapeR2): boolean;
  contains(x: number, y: number): boolean;
  contains(that: AnyShapeR2 | number, y?: number): boolean {
    return false; // TODO
  }

  intersects(that: AnyShapeR2): boolean {
    return false; // TODO
  }

  transform(f: R2Function): SetR2 {
    const oldShapes = this._shapes;
    const n = oldShapes.length;
    if (n > 0) {
      const newShapes = new Array<ShapeR2>(n);
      for (let i = 0; i < n; i += 1) {
        newShapes[i] = oldShapes[i]!.transform(f);
      }
      return new SetR2(newShapes);
    } else {
      return SetR2.empty();
    }
  }

  boundingBox(): BoxR2 {
    let boundingBox = this._boundingBox;
    if (boundingBox === void 0) {
      let xMin = Infinity;
      let yMin = Infinity;
      let xMax = -Infinity;
      let yMax = -Infinity;
      const shapes = this._shapes;
      for (let i = 0, n = shapes.length; i < n; i += 1) {
        const shape = shapes[i]!;
        xMin = Math.min(xMin, shape.xMin);
        yMin = Math.min(yMin, shape.yMin);
        xMax = Math.max(shape.xMax, xMax);
        yMax = Math.max(shape.yMax, yMax);
      }
      boundingBox = new ShapeR2.Box(xMin, yMin, xMax, yMax);
      this._boundingBox = boundingBox;
    }
    return boundingBox;
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof SetR2) {
      return Arrays.equivalent(this._shapes, that._shapes, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof SetR2) {
      return Arrays.equal(this._shapes, that._shapes);
    }
    return false;
  }

  debug(output: Output): void {
    const shapes = this._shapes;
    const n = shapes.length;
    output = output.write("SetR2").write(46/*'.'*/);
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

  static empty<S extends ShapeR2>(): SetR2<S> {
    return new SetR2([]);
  }

  static of<S extends ShapeR2>(...shapes: S[]): SetR2<S> {
    return new SetR2(shapes);
  }
}
