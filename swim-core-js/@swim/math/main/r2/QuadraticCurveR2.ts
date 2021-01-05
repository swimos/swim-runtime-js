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

import {Numbers} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import {R2Function} from "./R2Function";
import {AnyShapeR2} from "./ShapeR2";
import {PointR2} from "./PointR2";
import {CurveR2Context} from "./CurveR2Context";
import {CurveR2} from "./CurveR2";
import {BezierCurveR2} from "./BezierCurveR2";

export class QuadraticCurveR2 extends BezierCurveR2 implements Debug {
  /** @hidden */
  readonly _x0: number;
  /** @hidden */
  readonly _y0: number;
  /** @hidden */
  readonly _x1: number;
  /** @hidden */
  readonly _y1: number;
  /** @hidden */
  readonly _x2: number;
  /** @hidden */
  readonly _y2: number;

  constructor(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number) {
    super();
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
  }

  isDefined(): boolean {
    return isFinite(this._x0) && isFinite(this._y0)
        && isFinite(this._x1) && isFinite(this._y1)
        && isFinite(this._x2) && isFinite(this._y2);
  }

  get x0(): number {
    return this._x0;
  }

  get y0(): number {
    return this._y0;
  }

  get x1(): number {
    return this._x1;
  }

  get y1(): number {
    return this._y1;
  }

  get x2(): number {
    return this._x2;
  }

  get y2(): number {
    return this._y2;
  }

  get xMin(): number {
    return Math.min(this._x0, this._x1, this._x2);
  }

  get yMin(): number {
    return Math.min(this._y0, this._y1, this._y2);
  }

  get xMax(): number {
    return Math.max(this._x0, this._x1, this._x2);
  }

  get yMax(): number {
    return Math.max(this._y0, this._y1, this._y2);
  }

  interpolateX(u: number): number {
    const v = 1.0 - u;
    const x01 = v * this._x0 + u * this._x1;
    const x12 = v * this._x1 + u * this._x2;
    return v * x01 + u * x12;
  }

  interpolateY(u: number): number {
    const v = 1.0 - u;
    const y01 = v * this._y0 + u * this._y1;
    const y12 = v * this._y1 + u * this._y2;
    return v * y01 + u * y12;
  }

  interpolate(u: number): PointR2 {
    const v = 1.0 - u;
    const x01 = v * this._x0 + u * this._x1;
    const y01 = v * this._y0 + u * this._y1;
    const x12 = v * this._x1 + u * this._x2;
    const y12 = v * this._y1 + u * this._y2;
    const x02 = v * x01 + u * x12;
    const y02 = v * y01 + u * y12;
    return new PointR2(x02, y02);
  }

  contains(that: AnyShapeR2): boolean;
  contains(x: number, y: number): boolean;
  contains(that: AnyShapeR2 | number, y?: number): boolean {
    return false; // TODO
  }

  intersects(that: AnyShapeR2): boolean {
    return false; // TODO
  }

  split(u: number): [QuadraticCurveR2, QuadraticCurveR2] {
    const v = 1.0 - u;
    const x01 = v * this._x0 + u * this._x1;
    const y01 = v * this._y0 + u * this._y1;
    const x12 = v * this._x1 + u * this._x2;
    const y12 = v * this._y1 + u * this._y2;
    const x02 = v * x01 + u * x12;
    const y02 = v * y01 + u * y12;
    const c0 = new QuadraticCurveR2(this._x0, this._y0, x01, y01, x02, y02);
    const c1 = new QuadraticCurveR2(x02, y02, x12, y12, this._x2, this._y2);
    return [c0, c1];
  }

  transform(f: R2Function): QuadraticCurveR2 {
    return new QuadraticCurveR2(f.transformX(this._x0, this._y0), f.transformY(this._x0, this._y0),
                                f.transformX(this._x1, this._y1), f.transformY(this._x1, this._y1),
                                f.transformX(this._x2, this._y2), f.transformY(this._x2, this._y2));
  }

  drawMove(context: CurveR2Context): void {
    context.moveTo(this._x0, this._y0);
  }

  drawRest(context: CurveR2Context): void {
    context.quadraticCurveTo(this._x1, this._y1, this._x2, this._y2);
  }

  transformDrawMove(context: CurveR2Context, f: R2Function): void {
    context.moveTo(f.transformX(this._x0, this._y0), f.transformY(this._x0, this._y0));
  }

  transformDrawRest(context: CurveR2Context, f: R2Function): void {
    context.quadraticCurveTo(f.transformX(this._x1, this._y1), f.transformY(this._x1, this._y1),
                             f.transformX(this._x2, this._y2), f.transformY(this._x2, this._y2));
  }

  writeMove(output: Output): void {
    output.write(77/*'M'*/);
    Format.displayNumber(this._x0, output)
    output.write(44/*','*/)
    Format.displayNumber(this._y0, output);
  }

  writeRest(output: Output): void {
    output.write(81/*'Q'*/);
    Format.displayNumber(this._x1, output)
    output.write(44/*','*/)
    Format.displayNumber(this._y1, output);
    output.write(44/*','*/)
    Format.displayNumber(this._x2, output)
    output.write(44/*','*/)
    Format.displayNumber(this._y2, output);
  }

  equivalentTo(that: CurveR2, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof QuadraticCurveR2) {
      return Numbers.equivalent(this._x0, that._x0, epsilon)
          && Numbers.equivalent(this._y0, that._y0, epsilon)
          && Numbers.equivalent(this._x1, that._x1, epsilon)
          && Numbers.equivalent(this._y1, that._y1, epsilon)
          && Numbers.equivalent(this._x2, that._x2, epsilon)
          && Numbers.equivalent(this._y2, that._y2, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof QuadraticCurveR2) {
      return this._x0 === that._x0 && this._y0 === that._y0
          && this._x1 === that._x1 && this._y1 === that._y1
          && this._x2 === that._x2 && this._y2 === that._y2;
    }
    return false;
  }

  debug(output: Output): void {
    output.write("CurveR2").write(46/*'.'*/).write("quadratic").write(40/*'('*/)
        .debug(this._x0).write(", ").debug(this._y0).write(", ")
        .debug(this._x1).write(", ").debug(this._y1).write(", ")
        .debug(this._x2).write(", ").debug(this._y2).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }
}
CurveR2.Quadratic = QuadraticCurveR2;
