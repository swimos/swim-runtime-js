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

import {Constructors} from "@swim/util";
import type {Output} from "@swim/codec";
import {Interpolator, IdentityInterpolator} from "@swim/mapping";
import {Attr, Value, Record} from "@swim/structure";
import {AnyLength, Length} from "../length/Length";
import {Transform} from "./Transform";
import type {AffineTransform} from "./AffineTransform";

export class IdentityTransform extends Transform {
  transform(that: Transform): Transform;
  transform(point: [number, number]): [number, number];
  transform(x: number, y: number): [number, number];
  transform(point: [AnyLength, AnyLength]): [Length, Length];
  transform(x: AnyLength, y: AnyLength): [Length, Length];
  transform(x: Transform | [AnyLength, AnyLength] | AnyLength, y?: AnyLength): Transform | [number, number] | [Length, Length] {
    if (x instanceof Transform) {
      return x;
    } else {
      if (Array.isArray(x)) {
        y = x[1];
        x = x[0];
      }
      if (typeof x === "number" && typeof y === "number") {
        return [x, y];
      } else {
        x = Length.fromAny(x);
        y = Length.fromAny(y!);
        return [x, y];
      }
    }
  }

  transformX(x: number, y: number): number {
    return x;
  }

  transformY(x: number, y: number): number {
    return y;
  }

  inverse(): Transform {
    return this;
  }

  toAffine(): AffineTransform {
    return new Transform.Affine(1, 0, 0, 1, 0, 0);
  }

  toValue(): Value {
    return Record.of(Attr.of("identity"));
  }

  interpolateTo(that: IdentityTransform): Interpolator<IdentityTransform>;
  interpolateTo(that: Transform): Interpolator<Transform>;
  interpolateTo(that: unknown): Interpolator<Transform> | null;
  interpolateTo(that: unknown): Interpolator<Transform> | null {
    if (that instanceof IdentityTransform) {
      return IdentityInterpolator(this);
    } else {
      return super.interpolateTo(that);
    }
  }

  conformsTo(that: Transform): boolean {
    return that instanceof IdentityTransform;
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    return that instanceof IdentityTransform;
  }

  equals(that: unknown): boolean {
    return that instanceof IdentityTransform;
  }

  hashCode(): number {
    return Constructors.hash(IdentityTransform);
  }

  debug(output: Output): void {
    output = output.write("Transform").write(46/*'.'*/).write("identity")
        .write(40/*'('*/).write(41/*')'*/);
  }

  toString(): string {
    return "none";
  }

  static fromValue(value: Value): IdentityTransform | undefined {
    if (value.tag === "identity") {
      return Transform.identity();
    }
    return void 0;
  }
}
if (typeof CSSKeywordValue !== "undefined") { // CSS Typed OM support
  IdentityTransform.prototype.toCssValue = function (this: IdentityTransform): CSSStyleValue | undefined {
    return new CSSKeywordValue("identity");
  };
}
Transform.Identity = IdentityTransform;
