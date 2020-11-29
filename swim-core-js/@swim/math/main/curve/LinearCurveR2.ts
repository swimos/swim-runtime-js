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
import {R2Function} from "../vector/R2Function";
import {PointR2} from "../affine/PointR2";
import {CurveR2Context} from "./CurveR2Context";
import {CurveR2} from "./CurveR2";
import {BezierCurveR2} from "./BezierCurveR2";

export class LinearCurveR2 extends BezierCurveR2 implements Debug {
  /** @hidden */
  readonly _x0: number;
  /** @hidden */
  readonly _y0: number;
  /** @hidden */
  readonly _x1: number;
  /** @hidden */
  readonly _y1: number;

  constructor(x0: number, y0: number, x1: number, y1: number) {
    super();
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
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

  interpolateX(u: number): number {
    return (1.0 - u) * this._x0 + u * this._x1;
  }

  interpolateY(u: number): number {
   return (1.0 - u) * this._y0 + u * this._y1;
  }

  interpolate(u: number): PointR2 {
    const v = 1.0 - u;
    const x01 = v * this._x0 + u * this._x1;
    const y01 = v * this._y0 + u * this._y1;
    return new PointR2(x01, y01);
  }

  split(u: number): [LinearCurveR2, LinearCurveR2] {
    const v = 1.0 - u;
    const x01 = v * this._x0 + u * this._x1;
    const y01 = v * this._y0 + u * this._y1;
    const c0 = new LinearCurveR2(this._x0, this._y0, x01, y01);
    const c1 = new LinearCurveR2(x01, y01, this._x1, this._y1);
    return [c0, c1];
  }

  transform(f: R2Function): LinearCurveR2 {
    return new LinearCurveR2(f.transformX(this._x0, this._y0), f.transformY(this._x0, this._y0),
                             f.transformX(this._x1, this._y1), f.transformY(this._x1, this._y1));
  }

  drawMove(context: CurveR2Context): void {
    context.moveTo(this._x0, this._y0);
  }

  drawRest(context: CurveR2Context): void {
    context.lineTo(this._x1, this._y1);
  }

  writeMove(output: Output): void {
    output.write(77/*'M'*/);
    Format.displayNumber(this._x0, output)
    output.write(44/*','*/)
    Format.displayNumber(this._y0, output);
  }

  writeRest(output: Output): void {
    output.write(76/*'L'*/);
    Format.displayNumber(this._x1, output)
    output.write(44/*','*/)
    Format.displayNumber(this._y1, output);
  }

  equivalentTo(that: CurveR2, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof LinearCurveR2) {
      return Objects.equivalent(this._x0, that._x0, epsilon)
          && Objects.equivalent(this._y0, that._y0, epsilon)
          && Objects.equivalent(this._x1, that._x1, epsilon)
          && Objects.equivalent(this._y1, that._y1, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof LinearCurveR2) {
      return this._x0 === that._x0 && this._y0 === that._y0
          && this._x1 === that._x1 && this._y1 === that._y1;
    }
    return false;
  }

  debug(output: Output): void {
    output.write("CurveR2").write(46/*'.'*/).write("linear").write(40/*'('*/)
        .debug(this._x0).write(", ").debug(this._y0).write(", ")
        .debug(this._x1).write(", ").debug(this._y1).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }
}
CurveR2.Linear = LinearCurveR2;
