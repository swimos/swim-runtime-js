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

export class EllipticCurveR2 extends CurveR2 implements Debug {
  /** @hidden */
  readonly _cx: number;
  /** @hidden */
  readonly _cy: number;
  /** @hidden */
  readonly _rx: number;
  /** @hidden */
  readonly _ry: number;
  /** @hidden */
  readonly _phi: number;
  /** @hidden */
  readonly _a0: number;
  /** @hidden */
  readonly _da: number;

  constructor(cx: number, cy: number, rx: number, ry: number,
              phi: number, a0: number, da: number) {
    super();
    this._cx = cx;
    this._cy = cy;
    this._rx = rx;
    this._ry = ry;
    this._phi = phi;
    this._a0 = a0;
    this._da = da;
  }

  get cx(): number {
    return this._cx;
  }

  get cy(): number {
    return this._cy;
  }

  get rx(): number {
    return this._rx;
  }

  get ry(): number {
    return this._ry;
  }

  get phi(): number {
    return this._phi;
  }

  get a0(): number {
    return this._a0;
  }

  get da(): number {
    return this._da;
  }

  get xMin(): number {
    return this._cx - Math.max(this._rx, this._ry);
  }

  get yMin(): number {
    return this._cy - Math.max(this._rx, this._ry);
  }

  get xMax(): number {
    return this._cx + Math.max(this._rx, this._ry);
  }

  get yMax(): number {
    return this._cy + Math.max(this._rx, this._ry);
  }

  interpolateX(u: number): number {
    const a0 = this._a0;
    const da = this._da;
    const a = a0 + u * da;
    const dx = this._rx * Math.cos(a);
    const dy = this._ry * Math.sin(a);
    const phi = this._phi;
    if (phi === 0) {
      return this._cx + dx;
    } else {
      return this._cx + dx * Math.cos(phi) - dy * Math.sin(phi);
    }
  }

  interpolateY(u: number): number {
    const a0 = this._a0;
    const da = this._da;
    const a = a0 + u * da;
    const dx = this._rx * Math.cos(a);
    const dy = this._ry * Math.sin(a);
    const phi = this._phi;
    if (phi === 0) {
      return this._cy + dy;
    } else {
      return this._cy + dx * Math.sin(phi) + dy * Math.cos(phi);
    }
  }

  interpolate(u: number): PointR2 {
    const a0 = this._a0;
    const da = this._da;
    const a = a0 + u * da;
    const dx = this._rx * Math.cos(a);
    const dy = this._ry * Math.sin(a);
    const phi = this._phi;
    if (phi === 0) {
      return new PointR2(this._cx + dx, this._cy + dy);
    } else {
      return new PointR2(this._cx + dx * Math.cos(phi) - dy * Math.sin(phi),
                         this._cy + dx * Math.sin(phi) + dy * Math.cos(phi));
    }
  }

  contains(that: AnyShapeR2): boolean;
  contains(x: number, y: number): boolean;
  contains(that: AnyShapeR2 | number, y?: number): boolean {
    return false; // TODO
  }

  intersects(that: AnyShapeR2): boolean {
    return false; // TODO
  }

  split(u: number): [EllipticCurveR2, EllipticCurveR2] {
    const a0 = this._a0;
    const da = this._da;
    const a = a0 + u * da;
    const c0 = new EllipticCurveR2(this._cx, this._cy, this._rx, this._ry,
                                   this._phi, a0, a - a0);
    const c1 = new EllipticCurveR2(this._cx, this._cy, this._rx, this._ry,
                                   this._phi, a, a0 + da - a);
    return [c0, c1];
  }

  transform(f: R2Function): EllipticCurveR2 {
    const a0 = this._a0;
    const a1 = a0 + this._da;
    const a0x = Math.cos(a0);
    const a0y = Math.sin(a0);
    const a1x = Math.cos(a1);
    const a1y = Math.sin(a1);
    const b0x = f.transformX(a0x, a0y);
    const b0y = f.transformY(a0x, a0y);
    const b1x = f.transformX(a1x, a1y);
    const b1y = f.transformY(a1x, a1y);
    const b0 = Math.atan2(b0y, b0x);
    const b1 = Math.atan2(b1y, b1x);
    return new EllipticCurveR2(f.transformX(this._cx, this._cy), f.transformY(this._cx, this._cy),
                               f.transformX(this._rx, this._ry), f.transformY(this._rx, this._ry),
                               this._phi, b0, b1 - b0);
  }

  drawMove(context: CurveR2Context): void {
    const {x0, y0} = this.toEndpoints();
    context.moveTo(x0, y0);
  }

  drawRest(context: CurveR2Context): void {
    context.ellipse(this._cx, this._cy, this._rx, this._ry, this._phi,
                    this._a0, this._a0 + this._da, this._da < 0);
  }

  transformDrawMove(context: CurveR2Context, f: R2Function): void {
    const {x0, y0} = this.toEndpoints();
    context.moveTo(f.transformX(x0, y0), f.transformY(x0, y0));
  }

  transformDrawRest(context: CurveR2Context, f: R2Function): void {
    const a0 = this._a0;
    const a1 = a0 + this._da;
    const a0x = Math.cos(a0);
    const a0y = Math.sin(a0);
    const a1x = Math.cos(a1);
    const a1y = Math.sin(a1);
    const b0x = f.transformX(a0x, a0y);
    const b0y = f.transformY(a0x, a0y);
    const b1x = f.transformX(a1x, a1y);
    const b1y = f.transformY(a1x, a1y);
    const b0 = Math.atan2(b0y, b0x);
    const b1 = Math.atan2(b1y, b1x);
    context.ellipse(f.transformX(this._cx, this._cy), f.transformY(this._cx, this._cy),
                    f.transformX(this._rx, this._ry), f.transformY(this._rx, this._ry),
                    this._phi, b0, b1, b1 - b0 < 0);
  }

  writeMove(output: Output): void {
    const {x0, y0} = this.toEndpoints();
    output.write(77/*'M'*/);
    Format.displayNumber(x0, output)
    output.write(44/*','*/)
    Format.displayNumber(y0, output);
  }

  writeRest(output: Output): void {
    const {rx, ry, phi, large, sweep, x1, y1} = this.toEndpoints();
    output.write(65/*'A'*/);
    Format.displayNumber(rx, output)
    output.write(44/*','*/)
    Format.displayNumber(ry, output);
    output.write(32/*' '*/)
    Format.displayNumber(phi, output)
    output.write(32/*' '*/)
    output.write(large ? 49/*'1'*/ : 48/*'0'*/);
    output.write(44/*','*/)
    output.write(sweep ? 49/*'1'*/ : 48/*'0'*/);
    output.write(32/*' '*/)
    Format.displayNumber(x1, output);
    output.write(44/*','*/)
    Format.displayNumber(y1, output);
  }

  toEndpoints(): {x0: number, y0: number, rx: number, ry: number, phi: number,
                  large: boolean, sweep: boolean, x1: number, y1: number} {
    const cx = this._cx;
    const cy = this._cy;
    const rx = this._rx;
    const ry = this._ry;
    const phi = this._phi;
    const a0 = this._a0;
    const da = this._da;
    const a1 = a0 + da;

    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosA0 = Math.cos(a0);
    const sinA0 = Math.sin(a0);
    const cosA1 = Math.cos(a1);
    const sinA1 = Math.sin(a1);
    const x0 = cosPhi * rx * cosA0 - sinPhi * ry * sinA0 + cx;
    const y0 = sinPhi * rx * cosA0 + cosPhi * ry * sinA0 + cy;
    const x1 = cosPhi * rx * cosA1 - sinPhi * ry * sinA1 + cx;
    const y1 = sinPhi * rx * cosA1 + cosPhi * ry * sinA1 + cy;
    const large = Math.abs(da) > Math.PI;
    const sweep = da > 0;
    return {x0, y0, rx, ry, phi, large, sweep, x1, y1};
  }

  equivalentTo(that: CurveR2, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof EllipticCurveR2) {
      return Numbers.equivalent(this._cx, that._cx, epsilon)
          && Numbers.equivalent(this._cy, that._cy, epsilon)
          && Numbers.equivalent(this._rx, that._rx, epsilon)
          && Numbers.equivalent(this._ry, that._ry, epsilon)
          && Numbers.equivalent(this._phi, that._phi, epsilon)
          && Numbers.equivalent(this._a0, that._a0, epsilon)
          && Numbers.equivalent(this._da, that._da, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof EllipticCurveR2) {
      return this._cx === that._cx && this._cy === that._cy
          && this._rx === that._rx && this._ry === that._ry
          && this._phi === that._phi && this._a0 === that._a0
          && this._da === that._da;
    }
    return false;
  }

  debug(output: Output): void {
    output.write("CurveR2").write(46/*'.'*/).write("elliptic").write(40/*'('*/)
        .debug(this._cx).write(", ").debug(this._cy).write(", ")
        .debug(this._rx).write(", ").debug(this._ry).write(", ")
        .debug(this._phi).write(", ").debug(this._a0).write(", ")
        .debug(this._da).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  static fromEndpoints(x0: number, y0: number, rx: number, ry: number, phi: number,
                       large: boolean, sweep: boolean, x1: number, y1: number): EllipticCurveR2 {
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const x0p =  cosPhi * ((x0 - x1) / 2) + sinPhi * ((y0 - y1) / 2);
    const y0p = -sinPhi * ((x0 - x1) / 2) + cosPhi * ((y0 - y1) / 2);

    const rx2 = rx * rx;
    const ry2 = ry * ry;
    const x0p2 = x0p * x0p;
    const y0p2 = y0p * y0p;
    let sp = Math.sqrt((rx2 * ry2 - rx2 * y0p2 - ry2 * x0p2) / (rx2 * y0p2 + ry2 * x0p2));
    if (large === sweep) {
      sp = -sp;
    }
    const cxp =  sp * rx * y0p / ry;
    const cyp = -sp * ry * x0p / rx;
    const cx = cosPhi * cxp - sinPhi * cyp + (x0 + x1) / 2;
    const cy = sinPhi * cxp + cosPhi * cyp + (y0 + y1) / 2;

    function angle(ux: number, uy: number, vx: number, vy: number): number {
      const uv = ux * vx + uy * vy;
      const uu = ux * ux + uy * uy;
      const vv = vx * vx + vy * vy;
      let a = Math.acos(uv / (Math.sqrt(uu) * Math.sqrt(vv)));
      if (ux * vy - uy * vx < 0) {
        a = -a;
      }
      return a;
    }
    const a0 = angle(1, 0, (x0p - cxp) / rx, (y0p - cyp) / ry);
    let da = angle((x0p - cxp) / rx, (y0p - cyp) / ry, (-x0p - cxp) / rx, (-y0p - cyp) / ry) % (2 * Math.PI);
    if (!sweep && da > 0) {
      da -= 2 * Math.PI;
    } else if (sweep && da < 0) {
      da += 2 * Math.PI;
    }

    return new EllipticCurveR2(cx, cy, rx, ry, phi, a0, da);
  }
}
CurveR2.Elliptic = EllipticCurveR2;
