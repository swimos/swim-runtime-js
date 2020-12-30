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

import {Equivalent, Murmur3} from "@swim/util";
import {Output} from "@swim/codec";
import {AngleUnits, AnyAngle, Angle} from "./Angle";

export class GradAngle extends Angle {
  /** @hidden */
  readonly _value: number;

  constructor(value: number) {
    super();
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  get units(): AngleUnits {
    return "grad";
  }

  degValue(): number {
    return this._value * 0.9;
  }

  gradValue(): number {
    return this._value;
  }

  radValue(): number {
    return this._value * Angle.PI / 200;
  }

  turnValue(): number {
    return this._value / 400;
  }

  grad(): GradAngle {
    return this;
  }

  compareTo(that: AnyAngle): number {
    const x = this._value;
    const y = Angle.fromAny(that).gradValue();
    return x < y ? -1 : x > y ? 1 : isNaN(y) ? (isNaN(x) ? 0 : -1) : isNaN(x) ? 1 : 0;
  }

  equivalentTo(that: AnyAngle, epsilon: number = Equivalent.Epsilon): boolean {
    const x = this._value;
    const y = Angle.fromAny(that).gradValue();
    return x === y || isNaN(x) && isNaN(y) || Math.abs(y - x) < epsilon;
  }

  equals(that: unknown): boolean {
    if (that instanceof GradAngle) {
      return this._value === that._value;
    }
    return false;
  }

  hashCode(): number {
    if (GradAngle._hashSeed === void 0) {
      GradAngle._hashSeed = Murmur3.seed(GradAngle);
    }
    return Murmur3.mash(Murmur3.mix(GradAngle._hashSeed, Murmur3.hash(this._value)));
  }

  debug(output: Output): void {
    output = output.write("Angle").write(46/*'.'*/).write("grad").write(40/*'('*/)
        .debug(this._value).write(41/*')'*/);
  }

  toString(): string {
    return this._value + "grad";
  }

  private static _hashSeed?: number;

  private static _zero?: GradAngle;
  static zero(units?: "grad"): GradAngle {
    if (GradAngle._zero === void 0) {
      GradAngle._zero = new GradAngle(0);
    }
    return GradAngle._zero;
  }
}
if (typeof CSSUnitValue !== "undefined") { // CSS Typed OM support
  GradAngle.prototype.toCssValue = function (this: GradAngle): CSSUnitValue | undefined {
    return new CSSUnitValue(this._value, "grad");
  };
}
Angle.Grad = GradAngle;