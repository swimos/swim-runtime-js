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
import {Interpolator} from "@swim/mapping";
import {Slot} from "./Slot";
import type {Value} from "./Value";

/** @hidden */
export declare abstract class SlotInterpolator {
  /** @hidden */
  declare readonly keyInterpolator: Interpolator<Value>;
  /** @hidden */
  declare readonly valueInterpolator: Interpolator<Value>;

  get 0(): Slot;

  get 1(): Slot;

  equals(that: unknown): boolean;
}

export interface SlotInterpolator extends Interpolator<Slot> {
}

/** @hidden */
export function SlotInterpolator(y0: Slot, y1: Slot): SlotInterpolator {
  const interpolator = function (u: number): Slot {
    const key = interpolator.keyInterpolator(u);
    const value = interpolator.valueInterpolator(u);
    return Slot.of(key, value);
  } as SlotInterpolator;
  Object.setPrototypeOf(interpolator, SlotInterpolator.prototype);
  Object.defineProperty(interpolator, "keyInterpolator", {
    value: y0.key.interpolateTo(y1.key),
    enumerable: true,
  });
  Object.defineProperty(interpolator, "valueInterpolator", {
    value: y0.value.interpolateTo(y1.value),
    enumerable: true,
  });
  return interpolator;
}
__extends(SlotInterpolator, Interpolator);

Object.defineProperty(SlotInterpolator.prototype, 0, {
  get(this: SlotInterpolator): Slot {
    return Slot.of(this.keyInterpolator[0], this.valueInterpolator[0]);
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(SlotInterpolator.prototype, 1, {
  get(this: SlotInterpolator): Slot {
    return Slot.of(this.keyInterpolator[1], this.valueInterpolator[1]);
  },
  enumerable: true,
  configurable: true,
});

SlotInterpolator.prototype.equals = function (that: unknown): boolean {
  if (this === that) {
    return true;
  } else if (that instanceof SlotInterpolator) {
    return this.keyInterpolator.equals(that.keyInterpolator)
        && this.valueInterpolator.equals(that.valueInterpolator);
  }
  return false;
};
