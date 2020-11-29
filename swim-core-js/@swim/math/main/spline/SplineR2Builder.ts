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

import {CurveR2} from "../curve/CurveR2";
import {LinearCurveR2} from "../curve/LinearCurveR2";
import {QuadraticCurveR2} from "../curve/QuadraticCurveR2";
import {CubicCurveR2} from "../curve/CubicCurveR2";
import {EllipticCurveR2} from "../curve/EllipticCurveR2";
import {SplineR2Context} from "./SplineR2Context";
import {SplineR2} from "./SplineR2";

export class SplineR2Builder implements SplineR2Context {
  /** @hidden */
  _curves: CurveR2[];
  /** @hidden */
  _closed: boolean;
  /** @hidden */
  _aliased: boolean;
  /** @hidden */
  _x0: number;
  /** @hidden */
  _y0: number;
  /** @hidden */
  _x: number;
  /** @hidden */
  _y: number;
  /** @hidden */

  constructor() {
    this._curves = [];
    this._closed = false;
    this._aliased = false;
    this._x0 = 0;
    this._y0 = 0;
    this._x = 0;
    this._y = 0;
  }

  private dealias(): void {
    if (this._aliased) {
      this._curves = this._curves.slice(0);
      this._aliased = false;
    }
  }

  moveTo(x: number, y: number): void {
    if (this._aliased) {
      this._curves = [];
      this._aliased = false;
    } else {
      this._curves.length = 0;
    }
    this._closed = false;
    this._x0 = x;
    this._y0 = y;
    this._x = x;
    this._y = y;
  }

  closePath(): void {
    this.dealias();
    this._curves.push(new LinearCurveR2(this._x, this._y, this._x0, this._y0));
    this._closed = true;
    this._x = this._x0;
    this._y = this._y0;
  }

  lineTo(x: number, y: number): void {
    this.dealias();
    this._curves.push(new LinearCurveR2(this._x, this._y, x, y));
    this._x = x;
    this._y = y;
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number): void {
    this.dealias();
    this._curves.push(new QuadraticCurveR2(this._x, this._y, x1, y1, x, y));
    this._x = x;
    this._y = y;
  }

  bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void {
    this.dealias();
    this._curves.push(new CubicCurveR2(this._x, this._y, x1, y1, x2, y2, x, y));
    this._x = x;
    this._y = y;
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
    this.dealias();
    const x0 = this._x;
    const y0 = this._y;
    const dx01 = x1 - x0;
    const dy01 = y1 - y0;
    const dx12 = x2 - x1;
    const dy12 = y2 - y1;
    const a0 = Math.atan2(dy01, dx01) - Math.PI / 2;
    const a1 = Math.atan2(dy12, dx12) - Math.PI / 2;
    const da = a1 - a0;
    const r0x = Math.cos(a0);
    const r0y = Math.sin(a0);
    const r1x = Math.cos(a1);
    const r1y = Math.sin(a1);
    const r0x0 = x0 - r0x;
    const r0y0 = y0 - r0y;
    const r0x1 = x1 - r0x;
    const r0y1 = y1 - r0y;
    const r1x1 = x1 - r1x;
    const r1y1 = y1 - r1y;
    const r1x2 = x2 - r1x;
    const r1y2 = y2 - r1y;
    const u = SplineR2Builder.intersection(r0x0, r0y0, r0x1 - r0x0, r0y1 - r0y0,
                                           r1x1, r1y1, r1x2 - r1x1, r1y2 - r1y1);
    const cx = r0x0 + u * (r0x1 - r0x0);
    const cy = r0y0 + u * (r0y1 - r0y0);
    this._curves.push(new EllipticCurveR2(cx, cy, r, r, 0, a0, da));
    this._x = x2;
    this._y = y2;
  }

  private static intersection(px: number, py: number, rx: number, ry: number,
                              qx: number, qy: number, sx: number, sy: number): number {
    const pqx = qx - px;
    const pqy = qy - py;
    const pqr = pqx * ry - pqy * rx;
    const rs = rx * sy - ry * sx;
    if (pqr === 0 && rs === 0) { // collinear
      const rr = rx * rx + ry * ry;
      const sr = sx * rx + sy * ry;
      const t0 = (pqx * rx + pqy * ry) / rr;
      const t1 = t0 + sr / rr;
      if (sr >= 0 ? 0 < t1 && t0 < 1 : 0 < t0 && t1 < 1) {
        return t0;
      } else {
        return NaN;
      }
    } else if (rs === 0) { // parallel
      return NaN;
    } else {
      const pqs = pqx * sy - pqy * sx;
      const t = pqs / rs; // (q − p) × s / (r × s)
      const u = pqr / rs; // (q − p) × r / (r × s)
      if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
        return t;
      } else {
        return NaN;
      }
    }
  }

  arc(cx: number, cy: number, r: number, a0: number, a1: number, ccw: boolean = false): void {
    this.dealias();
    let da = a1 - a0;
    if (ccw === true && da > 0) {
      da -= 2 * Math.PI;
    } else if (ccw === false && da < 0) {
      da += 2 * Math.PI;
    }
    const curve = new EllipticCurveR2(cx, cy, r, r, 0, a0, da);
    this._curves.push(curve);
    const {x, y} = curve.interpolate(1);
    this._x = x;
    this._y = y;
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, phi: number, a0: number, a1: number, ccw?: boolean): void {
    this.dealias();
    let da = a1 - a0;
    if (ccw === true && da > 0) {
      da -= 2 * Math.PI;
    } else if (ccw === false && da < 0) {
      da += 2 * Math.PI;
    }
    const curve = new EllipticCurveR2(cx, cy, rx, ry, phi, a0, da);
    this._curves.push(curve);
    const {x, y} = curve.interpolate(1);
    this._x = x;
    this._y = y;
  }

  rect(x: number, y: number, w: number, h: number): void {
    this.dealias();
    this._curves.push(new LinearCurveR2(x, y, x + w, y),
                      new LinearCurveR2(x + w, y, x + w, y + h),
                      new LinearCurveR2(x + w, y + h, x, y + h),
                      new LinearCurveR2(x, y + h, x, y));
    this._x = x;
    this._y = y;
  }

  bind(): SplineR2 {
    this._aliased = true;
    return new SplineR2(this._curves, this._closed);
  }
}
SplineR2.SplineBuilder = SplineR2Builder;
