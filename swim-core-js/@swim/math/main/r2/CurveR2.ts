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

import type {Equivalent, Equals} from "@swim/util";
import {AnyOutputSettings, Output, Parser, Diagnostic, Unicode} from "@swim/codec";
import type {R2Function} from "./R2Function";
import {ShapeR2} from "./ShapeR2";
import type {PointR2} from "./PointR2";
import type {CurveR2Context} from "./CurveR2Context";
import type {BezierCurveR2} from "./BezierCurveR2";
import type {SegmentR2} from "./SegmentR2";
import type {QuadraticCurveR2} from "./QuadraticCurveR2";
import type {CubicCurveR2} from "./CubicCurveR2";
import type {EllipticCurveR2} from "./EllipticCurveR2";
import type {CurveR2Parser} from "./CurveR2Parser";

export abstract class CurveR2 extends ShapeR2 implements Equals, Equivalent {
  abstract interpolateX(u: number): number;

  abstract interpolateY(u: number): number;

  abstract interpolate(u: number): PointR2;

  abstract split(u: number): [CurveR2, CurveR2];

  abstract transform(f: R2Function): CurveR2;

  abstract drawMove(context: CurveR2Context): void;

  abstract drawRest(context: CurveR2Context): void;

  draw(context: CurveR2Context): void {
    this.drawMove(context);
    this.drawRest(context);
  }

  abstract transformDrawMove(context: CurveR2Context, f: R2Function): void;

  abstract transformDrawRest(context: CurveR2Context, f: R2Function): void;

  transformDraw(context: CurveR2Context, f: R2Function): void {
    this.transformDrawMove(context, f);
    this.transformDrawRest(context, f);
  }

  abstract writeMove(output: Output): void;

  abstract writeRest(output: Output): void;

  writePath(output: Output): void {
    this.writeMove(output);
    this.writeRest(output);
  }

  toPathString(outputSettings?: AnyOutputSettings): string {
    const output = Unicode.stringOutput(outputSettings);
    this.writePath(output);
    return output.toString();
  }

  abstract equivalentTo(that: unknown, epsilon?: number): boolean;

  abstract equals(that: unknown): boolean;

  static linear(x0: number, y0: number, x1: number, y1: number): CurveR2 {
    return new CurveR2.Linear(x0, y0, x1, y1);
  }

  static quadratic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): CurveR2 {
    return new CurveR2.Quadratic(x0, y0, x1, y1, x2, y2);
  }

  static cubic(x0: number, y0: number, x1: number, y1: number,
               x2: number, y2: number, x3: number, y3: number): CurveR2 {
    return new CurveR2.Cubic(x0, y0, x1, y1, x2, y2, x3, y3);
  }

  static elliptic(cx: number, cy: number, rx: number, ry: number,
                  phi: number, a0: number, da: number): CurveR2 {
    return new CurveR2.Elliptic(cx, cy, rx, ry, phi, a0, da);
  }

  static parse(string: string): CurveR2 {
    let input = Unicode.stringInput(string);
    while (input.isCont() && Unicode.isWhitespace(input.head())) {
      input = input.step();
    }
    let parser = CurveR2.CurveParser.parse(input);
    if (parser.isDone()) {
      while (input.isCont() && Unicode.isWhitespace(input.head())) {
        input = input.step();
      }
    }
    if (input.isCont() && !parser.isError()) {
      parser = Parser.error(Diagnostic.unexpected(input));
    }
    return parser.bind();
  }

  // Forward type declarations
  /** @hidden */
  static Bezier: typeof BezierCurveR2; // defined by BezierCurveR2
  /** @hidden */
  static Linear: typeof SegmentR2; // defined by SegmentR2
  /** @hidden */
  static Quadratic: typeof QuadraticCurveR2; // defined by QuadraticCurveR2
  /** @hidden */
  static Cubic: typeof CubicCurveR2; // defined by CubicCurveR2
  /** @hidden */
  static Elliptic: typeof EllipticCurveR2; // defined by EllipticCurveR2
  /** @hidden */
  static CurveParser: typeof CurveR2Parser; // defined by CurveR2Parser
}
