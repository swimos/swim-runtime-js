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
import type {Mutable} from "@swim/util";
import {Numbers} from "@swim/util";
import {Constructors} from "@swim/util";
import type {Equivalent} from "@swim/util";
import type {HashCode} from "@swim/util";
import type {Interpolate} from "@swim/util";
import {Interpolator} from "@swim/util";
import type {Output} from "@swim/codec";
import type {Debug} from "@swim/codec";
import {Format} from "@swim/codec";

/** @public */
export type AnyR2Vector = R2Vector | R2VectorInit;

/** @public */
export interface R2VectorInit {
  x: number;
  y: number;
}

/** @public */
export class R2Vector implements Interpolate<R2Vector>, HashCode, Equivalent, Debug {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isDefined(): boolean {
    return isFinite(this.x) && isFinite(this.y);
  }

  readonly x: number;

  readonly y: number;

  plus(that: AnyR2Vector): R2Vector {
    return new R2Vector(this.x + that.x, this.y + that.y);
  }

  negative(): R2Vector {
    return new R2Vector(-this.x, -this.y);
  }

  minus(that: AnyR2Vector): R2Vector {
    return new R2Vector(this.x - that.x, this.y - that.y);
  }

  times(scalar: number): R2Vector {
    return new R2Vector(this.x * scalar, this.y * scalar);
  }

  toAny(): R2VectorInit {
    return {
      x: this.x,
      y: this.y,
    };
  }

  interpolateTo(that: R2Vector): Interpolator<R2Vector>;
  interpolateTo(that: unknown): Interpolator<R2Vector> | null;
  interpolateTo(that: unknown): Interpolator<R2Vector> | null {
    if (that instanceof R2Vector) {
      return R2VectorInterpolator(this, that);
    }
    return null;
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof R2Vector) {
      return Numbers.equivalent(this.x, that.x, epsilon)
          && Numbers.equivalent(this.y, that.y, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof R2Vector) {
      return this.x === that.x && this.y === that.y;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(R2Vector),
        Numbers.hash(this.x)), Numbers.hash(this.y)));
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("R2Vector").write(46/*'.'*/).write("of").write(40/*'('*/)
                   .debug(this.x).write(", ").debug(this.y).write(41/*')'*/);
    return output;
  }

  toString(): string {
    return Format.debug(this);
  }

  /** @internal */
  static readonly Zero: R2Vector = new this(0, 0);

  static zero(): R2Vector {
    return this.Zero;
  }

  static of(x: number, y: number): R2Vector {
    return new R2Vector(x, y);
  }

  static fromInit(init: R2VectorInit): R2Vector {
    return new R2Vector(init.x, init.y);
  }

  static fromAny(value: AnyR2Vector): R2Vector {
    if (value === void 0 || value === null || value instanceof R2Vector) {
      return value;
    } else if (R2Vector.isInit(value)) {
      return R2Vector.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  /** @internal */
  static isInit(value: unknown): value is R2VectorInit {
    if (typeof value === "object" && value !== null) {
      const init = value as R2VectorInit;
      return typeof init.x === "number"
          && typeof init.y === "number";
    }
    return false;
  }

  /** @internal */
  static isAny(value: unknown): value is AnyR2Vector {
    return value instanceof R2Vector
        || R2Vector.isInit(value);
  }
}

/** @internal */
export const R2VectorInterpolator = (function (_super: typeof Interpolator) {
  const R2VectorInterpolator = function (v0: R2Vector, v1: R2Vector): Interpolator<R2Vector> {
    const interpolator = function (u: number): R2Vector {
      const v0 = interpolator[0];
      const v1 = interpolator[1];
      const x = v0.x + u * (v1.x - v0.x);
      const y = v0.y + u * (v1.y - v0.y);
      return new R2Vector(x, y);
    } as Interpolator<R2Vector>;
    Object.setPrototypeOf(interpolator, R2VectorInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = v0;
    (interpolator as Mutable<typeof interpolator>)[1] = v1;
    return interpolator;
  } as {
    (v0: R2Vector, v1: R2Vector): Interpolator<R2Vector>;

    /** @internal */
    prototype: Interpolator<R2Vector>;
  };

  R2VectorInterpolator.prototype = Object.create(_super.prototype);
  R2VectorInterpolator.prototype.constructor = R2VectorInterpolator;

  return R2VectorInterpolator;
})(Interpolator);
