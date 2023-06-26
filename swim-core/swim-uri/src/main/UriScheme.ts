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

import {Strings} from "@swim/util";
import type {HashCode} from "@swim/util";
import type {Compare} from "@swim/util";
import {Diagnostic} from "@swim/codec";
import type {Input} from "@swim/codec";
import type {Output} from "@swim/codec";
import {Parser} from "@swim/codec";
import type {Debug} from "@swim/codec";
import type {Display} from "@swim/codec";
import {Unicode} from "@swim/codec";
import {Utf8} from "@swim/codec";
import {Uri} from "./Uri";

/** @public */
export type AnyUriScheme = UriScheme | string;

/** @public */
export class UriScheme implements HashCode, Compare, Debug, Display {
  /** @internal */
  constructor(name: string) {
    this.name = name;
  }

  isDefined(): boolean {
    return this.name.length !== 0;
  }

  readonly name: string;

  toAny(): string | undefined {
    return this.name.length !== 0 ? this.name : void 0;
  }

  compareTo(that: unknown): number {
    if (that instanceof UriScheme) {
      return this.name.localeCompare(that.name);
    }
    return NaN;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof UriScheme) {
      return this.name === that.name;
    }
    return false;
  }

  hashCode(): number {
    return Strings.hash(this.name);
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("UriScheme").write(46/*'.'*/);
    if (this.isDefined()) {
      output = output.write("parse").write(40/*'('*/).write(34/*'"'*/)
                     .display(this).write(34/*'"'*/).write(41/*')'*/);
    } else {
      output = output.write("undefined").write(40/*'('*/).write(41/*')'*/);
    }
    return output;
  }

  display<T>(output: Output<T>): Output<T> {
    output = Uri.writeScheme(output, this.name);
    return output;
  }

  toString(): string {
    return this.name;
  }

  /** @internal */
  static readonly Undefined: UriScheme = new this("");

  static undefined(): UriScheme {
    return this.Undefined;
  }

  static create(schemeName: string): UriScheme {
    return new UriScheme(schemeName);
  }

  static fromAny(value: AnyUriScheme): UriScheme;
  static fromAny(value: AnyUriScheme | null | undefined): UriScheme | null | undefined;
  static fromAny(value: AnyUriScheme | null | undefined): UriScheme | null | undefined {
    if (value === void 0 || value === null || value instanceof UriScheme) {
      return value;
    } else if (typeof value === "string") {
      return UriScheme.parse(value);
    }
    throw new TypeError("" + value);
  }

  static parse(input: Input): Parser<UriScheme>;
  static parse(string: string): UriScheme;
  static parse(string: Input | string): Parser<UriScheme> | UriScheme {
    const input = typeof string === "string" ? Unicode.stringInput(string) : string;
    let parser = UriSchemeParser.parse(input);
    if (typeof string === "string" && input.isCont() && !parser.isError()) {
      parser = Parser.error(Diagnostic.unexpected(input));
    }
    return typeof string === "string" ? parser.bind() : parser;
  }
}

/** @internal */
export class UriSchemeParser extends Parser<UriScheme> {
  private readonly output: Output<string> | undefined;
  private readonly step: number | undefined;

  constructor(output?: Output<string>, step?: number) {
    super();
    this.output = output;
    this.step = step;
  }

  override feed(input: Input): Parser<UriScheme> {
    return UriSchemeParser.parse(input, this.output, this.step);
  }

  static parse(input: Input, output?: Output<string>, step: number = 1): Parser<UriScheme> {
    let c = 0;
    if (step === 1) {
      if (input.isCont() && (c = input.head(), Uri.isAlpha(c))) {
        input = input.step();
        output = output || Utf8.decodedString();
        output = output.write(Uri.toLowerCase(c));
        step = 2;
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected("scheme", input));
      }
    }
    if (step === 2) {
      while (input.isCont() && (c = input.head(), Uri.isSchemeChar(c))) {
        input = input.step();
        output!.write(Uri.toLowerCase(c));
      }
      if (!input.isEmpty()) {
        return Parser.done(UriScheme.create(output!.bind()));
      }
    }
    return new UriSchemeParser(output, step);
  }
}
