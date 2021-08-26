// Copyright 2015-2021 Swim Inc.
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

import {HashCode, Lazy, Murmur3, Numbers, Constructors} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import type {Value, Form} from "@swim/structure";
import {TimeZoneForm} from "./"; // forward import

export type AnyTimeZone = TimeZone | string | number;

export class TimeZone implements HashCode, Debug {
  /** @hidden */
  private constructor(name: string | undefined, offset: number) {
    Object.defineProperty(this, "name", {
      value: name,
      enumerable: true,
    });
    Object.defineProperty(this, "offset", {
      value: offset,
      enumerable: true,
    });
  }

  readonly name!: string | undefined;

  readonly offset!: number;

  isUTC(): boolean {
    return this.offset === 0;
  }

  isLocal(): boolean {
    return this.offset === -new Date().getTimezoneOffset();
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof TimeZone) {
      return this.offset === that.offset;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Constructors.hash(TimeZone), Numbers.hash(this.offset)));
  }

  debug(output: Output): void {
    output = output.write("TimeZone").write(46/*'.'*/);
    if (this.name === "UTC" && this.offset === 0) {
      output = output.write("utc").write(40/*'('*/).write(41/*')'*/);
    } else if (this.name === void 0) {
      output = output.write("forOffset").write(40/*'('*/)
          .debug(this.offset).write(41/*')'*/);
    } else {
      output = output.write("from").write(40/*'('*/)
          .debug(this.name).write(", ").debug(this.offset).write(41/*')'*/);
    }
  }

  toString(): string {
    return Format.debug(this);
  }

  @Lazy
  static get utc(): TimeZone {
    return new TimeZone("UTC", 0);
  }

  @Lazy
  static get local(): TimeZone {
    return TimeZone.forOffset(-new Date().getTimezoneOffset());
  }

  static forName(name: string): TimeZone | null {
    switch (name) {
      case "UTC": return TimeZone.utc;
      default: return null;
    }
  }

  static forOffset(offset: number): TimeZone {
    switch (offset) {
      case 0: return TimeZone.utc;
      default: return new TimeZone(void 0, offset);
    }
  }

  static fromAny(value: AnyTimeZone): TimeZone {
    if (value === void 0 || value === null || value instanceof TimeZone) {
      return value;
    } else if (typeof value === "string") {
      const zone = TimeZone.forName(value);
      if (zone !== null) {
        return zone;
      }
    } else if (typeof value === "number") {
      return TimeZone.forOffset(value);
    }
    throw new TypeError("" + value);
  }

  static fromValue(value: Value): TimeZone | null {
    const name = value.stringValue(void 0);
    if (name !== void 0) {
      return TimeZone.forName(name);
    }
    const offset = value.numberValue(void 0);
    if (offset !== void 0) {
      return TimeZone.forOffset(offset);
    }
    return null;
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyTimeZone {
    return value instanceof TimeZone
        || typeof value === "string"
        || typeof value === "number";
  }

  @Lazy
  static form(): Form<TimeZone, AnyTimeZone> {
    return new TimeZoneForm(TimeZone.utc);
  }
}
