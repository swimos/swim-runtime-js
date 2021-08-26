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

import {AnyOutputSettings, OutputSettings, Output} from "@swim/codec";
import {Text} from "./Text";

/** @hidden */
export class TextOutput extends Output<Text> {
  /** @hidden */
  readonly string!: string;

  constructor(string: string, settings: OutputSettings) {
    super();
    Object.defineProperty(this, "string", {
      value: string,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "settings", {
      value: settings,
      enumerable: true,
      configurable: true,
    });
  }

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
    Object.defineProperty(this, "string", {
      value: this.string + token,
      enumerable: true,
      configurable: true,
    });
    return this;
  }

  override readonly settings!: OutputSettings;

  override withSettings(settings: AnyOutputSettings): Output<Text> {
    settings = OutputSettings.fromAny(settings);
    Object.defineProperty(this, "settings", {
      value: settings,
      enumerable: true,
      configurable: true,
    });
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
