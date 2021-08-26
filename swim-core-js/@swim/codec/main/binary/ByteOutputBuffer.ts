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

import {OutputException} from "../output/OutputException";
import {AnyOutputSettings, OutputSettings} from "../output/OutputSettings";
import {OutputBuffer} from "../output/OutputBuffer";
import {OutputBufferError} from "../output/OutputBufferError";

/** @hidden */
export class ByteOutputBuffer extends OutputBuffer<Uint8Array> {
  /** @hidden */
  readonly array!: Uint8Array;
  /** @hidden */
  readonly part!: boolean;

  constructor(array: Uint8Array, index: number, limit: number,
              part: boolean, settings: OutputSettings) {
    super();
    Object.defineProperty(this, "array", {
      value: array,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "index", {
      value: index,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "limit", {
      value: limit,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "part", {
      value: part,
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
    return this.index < this.limit;
  }

  override isFull(): boolean {
    return this.part && this.index >= this.limit;
  }

  override isDone(): boolean {
    return !this.part && this.index >= this.limit;
  }

  override isError(): boolean {
    return false;
  }

  override isPart(): boolean {
    return this.part;
  }

  override asPart(part: boolean): OutputBuffer<Uint8Array> {
    Object.defineProperty(this, "part", {
      value: part,
      enumerable: true,
      configurable: true,
    });
    return this;
  }

  readonly index!: number;

  override withIndex(index: number): OutputBuffer<Uint8Array> {
    if (0 <= index && index <= this.limit) {
      Object.defineProperty(this, "index", {
        value: index,
        enumerable: true,
        configurable: true,
      });
      return this;
    } else {
      return new OutputBufferError(new OutputException("invalid index"), this.settings);
    }
  }

  readonly limit!: number;

  override withLimit(limit: number): OutputBuffer<Uint8Array> {
    if (0 <= limit && limit <= this.array.length) {
      Object.defineProperty(this, "limit", {
        value: limit,
        enumerable: true,
        configurable: true,
      });
      return this;
    } else {
      return new OutputBufferError(new OutputException("invalid limit"), this.settings);
    }
  }

  override get capacity(): number {
    return this.array.length;
  }

  override get remaining(): number {
    return this.limit - this.index;
  }

  override has(index: number): boolean {
    return 0 <= index && index < this.limit;
  }

  override get(index: number): number {
    if (0 <= index && index < this.limit) {
      return this.array[index]!;
    } else {
      throw new OutputException();
    }
  }

  override set(index: number, token: number): void {
    if (0 <= index && index < this.limit) {
      this.array[index] = token;
    } else {
      throw new OutputException();
    }
  }

  override write(token: number | string): OutputBuffer<Uint8Array> {
    if (typeof token === "number") {
      const index = this.index;
      if (index < this.limit) {
        this.array[index] = token;
        Object.defineProperty(this, "index", {
          value: index + 1,
          enumerable: true,
          configurable: true,
        });
        return this;
      } else {
        return new OutputBufferError(new OutputException("full"), this.settings);
      }
    } else {
      return new OutputBufferError(new OutputException("binary output"), this.settings);
    }
  }

  override writeln(string?: string): OutputBuffer<Uint8Array> {
    return new OutputBufferError(new OutputException("binary output"), this.settings);
  }

  override step(offset: number): OutputBuffer<Uint8Array> {
    const index = this.index + offset;
    if (0 <= index && index <= this.limit) {
      Object.defineProperty(this, "index", {
        value: index,
        enumerable: true,
        configurable: true,
      });
      return this;
    } else {
      return new OutputBufferError(new OutputException("invalid step"), this.settings);
    }
  }

  override bind(): Uint8Array {
    return new Uint8Array(this.array.buffer, 0, this.index);
  }

  override readonly settings!: OutputSettings;

  override withSettings(settings: AnyOutputSettings): OutputBuffer<Uint8Array> {
    settings = OutputSettings.fromAny(settings);
    Object.defineProperty(this, "settings", {
      value: settings,
      enumerable: true,
      configurable: true,
    });
    return this;
  }

  override clone(): OutputBuffer<Uint8Array> {
    return new ByteOutputBuffer(this.array, this.index, this.limit, this.part, this.settings);
  }

  static create(array: Uint8Array, offset?: number, length?: number): OutputBuffer<Uint8Array> {
    if (offset === void 0) {
      offset = 0;
    }
    if (length === void 0) {
      length = array.length;
    }
    return new ByteOutputBuffer(array, offset, offset + length, false, OutputSettings.standard());
  }
}
