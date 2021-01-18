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

import type {Output} from "../output/Output";
import {Writer} from "./Writer";

/** @hidden */
export class WriterError extends Writer<never, never> {
  /** @hidden */
  declare readonly error: Error;

  constructor(error: Error) {
    super();
    Object.defineProperty(this, "error", {
      value: error,
      enumerable: true,
    });
  }

  isCont(): boolean {
    return false;
  }

  isError(): boolean {
    return true;
  }

  pull(output: Output): Writer<never, never> {
    return this;
  }

  bind(): never {
    throw this.error;
  }

  trap(): Error {
    return this.error;
  }

  asError<I2, O2>(): Writer<I2, O2> {
    return this;
  }

  andThen<O2>(that: Writer<never, O2>): Writer<never, O2> {
    return this;
  }
}
