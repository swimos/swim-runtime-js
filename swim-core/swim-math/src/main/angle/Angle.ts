// Copyright 2015-2023 Swim.inc
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

import {Lazy} from "@swim/util";
import type {HashCode} from "@swim/util";
import type {Equivalent} from "@swim/util";
import type {Compare} from "@swim/util";
import type {Interpolate} from "@swim/util";
import type {Interpolator} from "@swim/util";
import {Diagnostic} from "@swim/codec";
import type {Output} from "@swim/codec";
import {Parser} from "@swim/codec";
import type {Debug} from "@swim/codec";
import {Unicode} from "@swim/codec";
import {Attr} from "@swim/structure";
import {Value} from "@swim/structure";
import {Text} from "@swim/structure";
import type {Form} from "@swim/structure";
import {DegAngle} from "../"; // forward import
import {RadAngle} from "../"; // forward import
import {GradAngle} from "../"; // forward import
import {TurnAngle} from "../"; // forward import
import {AngleInterpolator} from "../"; // forward import
import {AngleForm} from "../"; // forward import
import {AngleParser} from "../"; // forward import

/** @public */
export type AngleUnits = "deg" | "rad" | "grad" | "turn";

/** @public */
export type AnyAngle = Angle | string | number;

/** @public */
export abstract class Angle implements Interpolate<Angle>, HashCode, Equivalent, Compare, Debug {
  isDefined(): boolean {
    return isFinite(this.value);
  }

  abstract readonly value: number;

  abstract readonly units: AngleUnits;

  plus(that: AnyAngle, units: AngleUnits = this.units): Angle {
    that = Angle.fromAny(that);
    return Angle.of(this.toValue(units) + that.toValue(units), units);
  }

  negative(units: AngleUnits = this.units): Angle {
    return Angle.of(-this.toValue(units), units);
  }

  minus(that: AnyAngle, units: AngleUnits = this.units): Angle {
    that = Angle.fromAny(that);
    return Angle.of(this.toValue(units) - that.toValue(units), units);
  }

  times(scalar: number, units: AngleUnits = this.units): Angle {
    return Angle.of(this.toValue(units) * scalar, units);
  }

  divide(scalar: number, units: AngleUnits = this.units): Angle {
    return Angle.of(this.toValue(units) / scalar, units);
  }

  combine(that: AnyAngle, scalar: number = 1, units: AngleUnits = this.units): Angle {
    that = Angle.fromAny(that);
    return Angle.of(this.toValue(units) + that.toValue(units) * scalar, units);
  }

  norm(total: AnyAngle, units: AngleUnits = this.units): Angle {
    total = Angle.fromAny(total);
    return Angle.of(this.toValue(units) / total.toValue(units), units);
  }

  abstract degValue(): number;

  abstract gradValue(): number;

  abstract radValue(): number;

  abstract turnValue(): number;

  deg(): DegAngle {
    return DegAngle.of(this.degValue());
  }

  rad(): RadAngle {
    return RadAngle.of(this.radValue());
  }

  grad(): GradAngle {
    return GradAngle.of(this.gradValue());
  }

  turn(): TurnAngle {
    return TurnAngle.of(this.turnValue());
  }

  toValue(): Value;
  toValue(units: AngleUnits): number;
  toValue(units?: AngleUnits): Value | number {
    if (units === void 0) {
      return Text.from(this.toString());
    }
    switch (units) {
      case "deg": return this.degValue();
      case "rad": return this.radValue();
      case "grad": return this.gradValue();
      case "turn": return this.turnValue();
      default: throw new Error("unknown angle units: " + units);
    }
  }

  to(units: AngleUnits): Angle {
    switch (units) {
      case "deg": return this.deg();
      case "rad": return this.rad();
      case "grad": return this.grad();
      case "turn": return this.turn();
      default: throw new Error("unknown angle units: " + units);
    }
  }

  abstract toCssValue(): CSSUnitValue | null;

  interpolateTo(that: Angle): Interpolator<Angle>;
  interpolateTo(that: unknown): Interpolator<Angle> | null;
  interpolateTo(that: unknown): Interpolator<Angle> | null {
    if (that instanceof Angle) {
      return AngleInterpolator(this, that);
    } else {
      return null;
    }
  }

  abstract compareTo(that: unknown): number;

  abstract equivalentTo(that: unknown, epsilon?: number): boolean;

  abstract equals(that: unknown): boolean;

  abstract hashCode(): number;

  abstract debug<T>(output: Output<T>): Output<T>;

  abstract toString(): string;

  static zero(units?: AngleUnits): Angle {
    switch (units) {
      case "deg": return DegAngle.zero();
      case void 0:
      case "rad": return RadAngle.zero();
      case "grad": return GradAngle.zero();
      case "turn": return TurnAngle.zero();
      default: throw new Error("unknown angle units: " + units);
    }
  }

  static deg(value: number): DegAngle {
    return DegAngle.of(value);
  }

  static rad(value: number): RadAngle {
    return RadAngle.of(value);
  }

  static grad(value: number): GradAngle {
    return GradAngle.of(value);
  }

  static turn(value: number): TurnAngle {
    return TurnAngle.of(value);
  }

  static of(value: number, units?: AngleUnits): Angle {
    switch (units) {
      case "deg": return DegAngle.of(value);
      case void 0:
      case "rad": return RadAngle.of(value);
      case "grad": return GradAngle.of(value);
      case "turn": return TurnAngle.of(value);
      default: throw new Error("unknown angle units: " + units);
    }
  }

  static fromCssValue(value: CSSStyleValue): Angle {
    if (value instanceof CSSUnitValue) {
      return Angle.of(value.value, value.unit as AngleUnits);
    } else {
      throw new TypeError("" + value);
    }
  }

  static fromAny(value: AnyAngle, defaultUnits?: AngleUnits): Angle {
    if (value === void 0 || value === null || value instanceof Angle) {
      return value;
    } else if (typeof value === "number") {
      return Angle.of(value, defaultUnits);
    } else if (typeof value === "string") {
      return Angle.parse(value, defaultUnits);
    }
    throw new TypeError("" + value);
  }

  static fromValue(value: Value): Angle | null {
    if (value.length === 2) {
      const num = value.getItem(0).numberValue();
      const units = value.getItem(1);
      if (num !== void 0 && isFinite(num) && units instanceof Attr && units.toValue() === Value.extant()) {
        switch (units.key.value) {
          case "deg": return DegAngle.of(num);
          case "rad": return RadAngle.of(num);
          case "grad": return GradAngle.of(num);
          case "turn": return TurnAngle.of(num);
          default:
        }
      }
    }
    return null;
  }

  static parse(string: string, defaultUnits?: AngleUnits): Angle {
    let input = Unicode.stringInput(string);
    while (input.isCont() && Unicode.isWhitespace(input.head())) {
      input = input.step();
    }
    let parser = AngleParser.parse(input, defaultUnits);
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

  @Lazy
  static form(): Form<Angle, AnyAngle> {
    return new AngleForm(void 0, Angle.zero());
  }

  /** @internal */
  static isAny(value: unknown): value is AnyAngle {
    return value instanceof Angle
        || typeof value === "number"
        || typeof value === "string";
  }
}
