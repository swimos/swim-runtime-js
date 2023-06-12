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

import type {Input} from "@swim/codec";
import type {Output} from "@swim/codec";
import type {Parser} from "@swim/codec";
import type {DateTimeInit} from "../DateTime";
import type {DateTime} from "../DateTime";
import {DateTimeFormat} from "./DateTimeFormat";
import {YearParser} from "../"; // forward import

/** @internal */
export class YearFormat extends DateTimeFormat {
  override writeDate<T>(output: Output<T>, date: DateTime): Output<T> {
    output = DateTimeFormat.writeDateNumber4(output, date.year);
    return output;
  }

  override parseDateTime(input: Input, date: DateTimeInit): Parser<DateTimeInit> {
    return YearParser.parse(input, date);
  }
}
