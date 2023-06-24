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
import type {Mutable} from "@swim/util";
import {Numbers} from "@swim/util";
import {Strings} from "@swim/util";
import type {Interpolator} from "@swim/util";
import {HashGenCacheSet} from "@swim/util";
import type {AnyOutputSettings} from "@swim/codec";
import {OutputSettings} from "@swim/codec";
import {Output} from "@swim/codec";
import {Format} from "@swim/codec";
import type {AnyItem} from "./Item";
import {Item} from "./Item";
import type {AnyValue} from "./Value";
import {Value} from "./Value";
import {Num} from "./"; // forward import

/** @public */
export type AnyText = Text | string;

/** @public */
export class Text extends Value {
  private constructor(value: string) {
    super();
    this.value = value;
    this.hashValue = void 0;
  }

  override isConstant(): boolean {
    return true;
  }

  readonly value: string;

  get size(): number {
    return this.value.length;
  }

  override stringValue(): string;
  override stringValue<T>(orElse: T): string;
  override stringValue<T>(orElse?: T): string {
    return this.value;
  }

  override numberValue(): number | undefined;
  override numberValue<T>(orElse: T): number | T;
  override numberValue<T>(orElse?: T): number | T | undefined {
    try {
      return Num.parse(this.value).numberValue();
    } catch (error) {
      return orElse;
    }
  }

  override booleanValue(): boolean | undefined;
  override booleanValue<T>(orElse: T): boolean | T;
  override booleanValue<T>(orElse?: T): boolean | T | undefined {
    if (this.value === "true") {
      return true;
    } else if (this.value === "false") {
      return false;
    } else {
      return orElse;
    }
  }

  override toAny(): AnyText {
    return this.value;
  }

  override valueOf(): string {
    return this.value;
  }

  override plus(that: AnyValue): Value;
  override plus(that: AnyItem): Item;
  override plus(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Text) {
      return Text.from(this.value + that.value);
    }
    return super.plus(that);
  }

  override branch(): Text {
    return this;
  }

  override clone(): Text {
    return this;
  }

  override commit(): this {
    return this;
  }

  override interpolateTo(that: Text): Interpolator<Text>;
  override interpolateTo(that: Item): Interpolator<Item>;
  override interpolateTo(that: unknown): Interpolator<Item> | null;
  override interpolateTo(that: unknown): Interpolator<Item> | null {
    return super.interpolateTo(that);
  }

  override get typeOrder(): number {
    return 5;
  }

  override compareTo(that: unknown): number {
    if (that instanceof Text) {
      return this.value.localeCompare(that.value);
    } else if (that instanceof Item) {
      return Numbers.compare(this.typeOrder, that.typeOrder);
    }
    return NaN;
  }

  override equivalentTo(that: unknown): boolean {
    return this.equals(that);
  }

  override equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Text) {
      return this.value === that.value;
    }
    return false;
  }

  /** @internal */
  readonly hashValue: number | undefined;

  override hashCode(): number {
    let hashValue = this.hashValue;
    if (hashValue === void 0) {
      hashValue = Strings.hash(this.value);
      (this as Mutable<this>).hashValue = hashValue;
    }
    return hashValue;
  }

  override debug<T>(output: Output<T>): Output<T> {
    output = output.write("Text").write(46/*'.'*/);
    if (this.value.length === 0) {
      output = output.write("empty").write(40/*'('*/).write(41/*')'*/);
    } else {
      output = output.write("from").write(40/*'('*/).debug(this.value).write(41/*')'*/);
    }
    return output;
  }

  override display<T>(output: Output<T>): Output<T> {
    return Format.debugAny(output, this.value);
  }

  override toString(): string {
    return this.value;
  }

  /** @internal */
  static readonly Empty: Text = new this("");

  static override empty(): Text {
    return this.Empty;
  }

  static from(value: string): Text {
    const n = value.length;
    if (n === 0) {
      return Text.empty();
    }
    let text = new Text(value);
    if (n <= 64) {
      text = Text.cache.put(text);
    }
    return text;
  }

  static override fromAny(value: AnyText): Text {
    if (value instanceof Text) {
      return value;
    } else if (typeof value === "string") {
      return Text.from(value);
    }
    throw new TypeError("" + value);
  }

  static output(settings?: OutputSettings): Output<Text> {
    if (settings === void 0) {
      settings = OutputSettings.standard();
    }
    return new TextOutput("", settings);
  }

  /** @internal */
  @Lazy
  static get cache(): HashGenCacheSet<Text> {
    const cacheSize = 128;
    return new HashGenCacheSet<Text>(cacheSize);
  }
}

/** @internal */
export class TextOutput extends Output<Text> {
  constructor(string: string, settings: OutputSettings) {
    super();
    this.string = string;
    this.settings = settings;
  }

  /** @internal */
  readonly string: string;

  override isCont(): boolean {
    return true;
  }

  override isFull(): boolean {
    return false;
  }

  override isDone(): boolean {
    return false;
  }

  override isError(): boolean {
    return false;
  }

  override isPart(): boolean {
    return false;
  }

  override asPart(part: boolean): Output<Text> {
    return this;
  }

  override write(token: number | string): Output<Text> {
    if (typeof token === "number") {
      if ((token >= 0x0000 && token <= 0xd7ff)
          || (token >= 0xe000 && token <= 0xffff)) { // U+0000..U+D7FF | U+E000..U+FFFF
        token = String.fromCharCode(token);
      } else if (token >= 0x10000 && token <= 0x10ffff) { // U+10000..U+10FFFF
        const u = token - 0x10000;
        token = String.fromCharCode(0xd800 | (u >>> 10), 0xdc00 | (u & 0x3ff));
      } else { // invalid code point
        token = "\ufffd";
      }
    }
    (this as Mutable<this>).string += token;
    return this;
  }

  override readonly settings!: OutputSettings;

  override withSettings(settings: AnyOutputSettings): Output<Text> {
    settings = OutputSettings.fromAny(settings);
    (this as Mutable<this>).settings = settings;
    return this;
  }

  override bind(): Text {
    return Text.from(this.string);
  }

  override clone(): Output<Text> {
    return new TextOutput(this.string, this.settings);
  }

  override toString(): string {
    return this.string;
  }
}
