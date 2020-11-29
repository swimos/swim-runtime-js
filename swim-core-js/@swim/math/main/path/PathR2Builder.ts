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

import {SplineR2} from "../spline/SplineR2";
import {SplineR2Builder} from "../spline/SplineR2Builder";
import {PathR2Context} from "./PathR2Context";
import {PathR2} from "./PathR2";

export class PathR2Builder implements PathR2Context {
  /** @hidden */
  _splines: SplineR2[];
  /** @hidden */
  _builder: SplineR2Builder | null;

  constructor() {
    this._splines = [];
    this._builder = null;
  }

  moveTo(x: number, y: number): void {
    let builder = this._builder;
    if (builder !== null) {
      const spline = builder.bind();
      if (spline.isDefined()) {
        this._splines.push(spline);
      }
    }
    builder = new SplineR2Builder();
    this._builder = builder;
    builder.moveTo(x, y);
  }

  closePath(): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.closePath();
    } else {
      throw new Error();
    }
  }

  lineTo(x: number, y: number): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.lineTo(x, y);
    } else {
      throw new Error();
    }
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.quadraticCurveTo(x1, y1, x, y);
    } else {
      throw new Error();
    }
  }

  bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.bezierCurveTo(x1, y1, x2, y2, x, y);
    } else {
      throw new Error();
    }
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.arcTo(x1, y1, x2, y2, r);
    } else {
      throw new Error();
    }
  }

  arc(cx: number, cy: number, r: number, a0: number, a1: number, ccw?: boolean): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.arc(cx, cy, r, a0, a1, ccw);
    } else {
      throw new Error();
    }
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, phi: number, a0: number, a1: number, ccw?: boolean): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.ellipse(cx, cy, rx, ry, phi, a0, a1, ccw);
    } else {
      throw new Error();
    }
  }

  rect(x: number, y: number, w: number, h: number): void {
    const builder = this._builder;
    if (builder !== null) {
      builder.rect(x, y, w, h);
    } else {
      throw new Error();
    }
  }

  bind(): PathR2 {
    const splines = this._splines.slice(0);
    const builder = this._builder;
    if (builder !== null) {
      const spline = builder.bind();
      if (spline.isDefined()) {
        splines.push(spline);
      }
    }
    return new PathR2(splines);
  }
}
PathR2.PathBuilder = PathR2Builder;
