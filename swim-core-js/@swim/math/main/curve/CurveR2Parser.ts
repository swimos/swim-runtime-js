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

import {Input, Parser, Diagnostic, Unicode, Base10} from "@swim/codec";
import {CurveR2} from "./CurveR2";
import {LinearCurveR2Parser} from "./LinearCurveR2Parser";
import {QuadraticCurveR2Parser} from "./QuadraticCurveR2Parser";
import {CubicCurveR2Parser} from "./CubicCurveR2Parser";
import {EllipticCurveR2Parser} from "./EllipticCurveR2Parser";

/** @hidden */
export class CurveR2Parser extends Parser<CurveR2> {
  private readonly x0Parser: Parser<number> | undefined;
  private readonly y0Parser: Parser<number> | undefined;
  private readonly command: number | undefined;
  private readonly step: number | undefined;

  constructor(x0Parser?: Parser<number>, y0Parser?: Parser<number>,
              command?: number, step?: number) {
    super();
    this.x0Parser = x0Parser;
    this.y0Parser = y0Parser;
    this.command = command;
    this.step = step;
  }

  feed(input: Input): Parser<CurveR2> {
    return CurveR2Parser.parse(input, this.x0Parser, this.y0Parser,
                               this.command, this.step);
  }

  static parse(input: Input, x0Parser?: Parser<number>, y0Parser?: Parser<number>,
               command?: number, step: number = 1): Parser<CurveR2> {
    let c = 0;
    if (step === 1) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont()) {
        if (c === 77/*'M'*/ || c === 109/*'m'*/) {
          input = input.step();
          command = c;
          step = 2;
        } else {
          return Parser.error(Diagnostic.expected("moveto", input));
        }
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.unexpected(input));
      }
    }
    if (step === 2) {
      if (x0Parser === void 0) {
        while (input.isCont() && Unicode.isSpace(input.head())) {
          input = input.step();
        }
        if (!input.isEmpty()) {
          x0Parser = Base10.parseDecimal(input);
        }
      } else {
        x0Parser = x0Parser.feed(input);
      }
      if (x0Parser !== void 0) {
        if (x0Parser.isDone()) {
          step = 3;
        } else if (x0Parser.isError()) {
          return x0Parser.asError();
        }
      }
    }
    if (step === 3) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont()) {
        if (c === 44/*','*/) {
          input = input.step();
        }
        step = 4;
      } else if (!input.isEmpty()) {
        step = 4;
      }
    }
    if (step === 4) {
      if (y0Parser === void 0) {
        while (input.isCont() && Unicode.isSpace(input.head())) {
          input = input.step();
        }
        if (!input.isEmpty()) {
          y0Parser = Base10.parseDecimal(input);
        }
      } else {
        y0Parser = y0Parser.feed(input);
      }
      if (y0Parser !== void 0) {
        if (y0Parser.isDone()) {
          step = 5;
        } else if (y0Parser.isError()) {
          return y0Parser.asError();
        }
      }
    }
    if (step === 5) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont()) {
        switch (c) {
          case 76/*'L'*/:
          case 108/*'l'*/:
          case 72/*'H'*/:
          case 104/*'h'*/:
          case 86/*'V'*/:
          case 118/*'v'*/:
            return CurveR2Parser.Linear.parse(input, x0Parser, y0Parser);
          case 81/*'Q'*/:
          case 113/*'q'*/:
            return CurveR2Parser.Quadratic.parse(input, x0Parser, y0Parser);
          case 84/*'T'*/:
            return CurveR2Parser.Quadratic.parse(input, x0Parser, y0Parser,
                                                 x0Parser, y0Parser);
          case 116/*'t'*/:
            return CurveR2Parser.Quadratic.parse(input, x0Parser, y0Parser,
                                                 Parser.done(0), Parser.done(0));
          case 67/*'C'*/:
          case 99/*'c'*/:
            return CurveR2Parser.Cubic.parse(input, x0Parser, y0Parser);
          case 83/*'S'*/:
            return CurveR2Parser.Cubic.parse(input, x0Parser, y0Parser,
                                             x0Parser, y0Parser);
          case 115/*'s'*/:
            return CurveR2Parser.Cubic.parse(input, x0Parser, y0Parser,
                                             Parser.done(0), Parser.done(0));
          case 65/*'A'*/:
          case 97/*'a'*/:
            return CurveR2Parser.Elliptic.parse(input, x0Parser, y0Parser);
          case 44/*','*/:
            input = input.step();
          case 43/*'+'*/:
          case 45/*'-'*/:
          case 46/*'.'*/:
          case 48/*'0'*/:
          case 49/*'1'*/:
          case 50/*'2'*/:
          case 51/*'3'*/:
          case 52/*'4'*/:
          case 53/*'5'*/:
          case 54/*'6'*/:
          case 55/*'7'*/:
          case 56/*'8'*/:
          case 57/*'9'*/:
            switch (command) {
              case 77/*'M'*/:
              case 109/*'m'*/:
                return CurveR2Parser.Linear.parseRest(input, command, x0Parser, y0Parser);
            }
          default:
            return Parser.error(Diagnostic.expected("draw command", input));
        }
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.unexpected(input));
      }
    }
    return new CurveR2Parser(x0Parser, y0Parser, command, step);
  }

  // Forward type declarations
  /** @hidden */
  static Linear: typeof LinearCurveR2Parser; // defined by LinearCurveR2Parser
  /** @hidden */
  static Quadratic: typeof QuadraticCurveR2Parser; // defined by QuadraticCurveR2Parser
  /** @hidden */
  static Cubic: typeof CubicCurveR2Parser; // defined by CubicCurveR2Parser
  /** @hidden */
  static Elliptic: typeof EllipticCurveR2Parser; // defined by EllipticCurveR2Parser
}
CurveR2.CurveParser = CurveR2Parser;
