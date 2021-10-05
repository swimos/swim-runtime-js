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

declare global {
  interface String {
    codePointAt(index: number): number | undefined;
    offsetByCodePoints(index: number, count: number): number;
  }
}

export * from "./runtime";

export * from "./types";

export * from "./values";

export * from "./compare";

export * from "./convert";

export * from "./mapping";

export * from "./interpolate";

export * from "./transition";

export * from "./scale";

export * from "./creatable";

export * from "./initable";

export * from "./observable";

export * from "./consumable";

export * from "./service";

export * from "./collections";

export * from "./cache";

export * from "./assert";
