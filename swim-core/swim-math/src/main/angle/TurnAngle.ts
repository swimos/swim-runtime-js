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

import {Murmur3} from "@swim/util";
import {Numbers} from "@swim/util";
import {Constructors} from "@swim/util";
import type {Output} from "@swim/codec";
import {Angle} from "./Angle";

/** @public */
export class TurnAngle extends Angle {
  constructor(value: number) {
    super();
    this.value = value;
  }

  readonly value: number;

  override get units(): "turn" {
    return "turn";
  }

  override degValue(): number {
    return this.value * 360;
  }

  override gradValue(): number {
    return this.value * 400;
  }

  override radValue(): number {
    return this.value * (2 * Math.PI);
  }

  override turnValue(): number {
    return this.value;
  }

  override turn(): TurnAngle {
    return this;
  }

  override toCssValue(): CSSUnitValue | null {
    if (typeof CSSUnitValue !== "undefined") {
      return new CSSUnitValue(this.value, "turn");
    }
    return null;
  }

  override compareTo(that: unknown): number {
    if (that instanceof Angle) {
      const x = this.value;
      const y = that.turnValue();
      return x < y ? -1 : x > y ? 1 : isNaN(y) ? (isNaN(x) ? 0 : -1) : isNaN(x) ? 1 : 0;
    }
    return NaN;
  }

  override equivalentTo(that: unknown, epsilon?: number): boolean {
    if (that instanceof Angle) {
      return Numbers.equivalent(this.value, that.turnValue());
    }
    return false;
  }

  override equals(that: unknown): boolean {
    if (that instanceof TurnAngle) {
      return this.value === that.value;
    }
    return false;
  }

  override hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Constructors.hash(TurnAngle), Numbers.hash(this.value)));
  }

  override debug<T>(output: Output<T>): Output<T> {
    output = output.write("Angle").write(46/*'.'*/).write("turn")
                   .write(40/*'('*/).debug(this.value).write(41/*')'*/);
    return output;
  }

  override toString(): string {
    return this.value + "turn";
  }

  /** @internal */
  static readonly Zero: TurnAngle = new TurnAngle(0);

  static override zero(): TurnAngle {
    return this.Zero;
  }

  static override of(value: number): TurnAngle {
    if (value === 0) {
      return this.Zero;
    }
    return new TurnAngle(value);
  }
}
