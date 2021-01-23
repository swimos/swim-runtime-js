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

import {__extends} from "tslib";
import type {Equals} from "@swim/util";
import type {Domain} from "./Domain";
import type {Range} from "./Range";

export declare abstract class Mapping<X, Y> {
  abstract readonly domain: Domain<X>;

  abstract readonly range: Range<Y>;

  canEqual(that: unknown): boolean;

  equals(that: unknown): boolean;

  toString(): string;
}

export interface Mapping<X, Y> extends Equals {
  (x: X): Y;
}

export function Mapping<X, Y>(domain: Domain<X>, range: Range<Y>): Mapping<X, Y> {
  const mapping = function (x: X): Y {
    return mapping.range(mapping.domain(x));
  } as Mapping<X, Y>;
  Object.setPrototypeOf(mapping, Mapping.prototype);
  Object.defineProperty(mapping, "domain", {
    value: domain,
    enumerable: true,
  });
  Object.defineProperty(mapping, "range", {
    value: range,
    enumerable: true,
  });
  return mapping;
}
__extends(Mapping, Object);

Mapping.prototype.canEqual = function (that: unknown): boolean {
  return that instanceof Mapping;
};

Mapping.prototype.equals = function (that: unknown): boolean {
  if (this === that) {
    return true;
  } else if (that instanceof Mapping) {
    return that.canEqual(this)
        && this.domain.equals(that.domain)
        && this.range.equals(that.range);
  }
  return false;
};

Mapping.prototype.toString = function (): string {
  return "Mapping(" + this.domain + ", " + this.range + ")";
};
