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

import type {Interpolator} from "@swim/mapping";
import type {Item} from "../Item";
import {Operator} from "./Operator";
import {BinaryOperatorInterpolator} from "../"; // forward import

export abstract class BinaryOperator extends Operator {
  /** @hidden */
  readonly _operand1: Item;
  /** @hidden */
  readonly _operand2: Item;

  constructor(operand1: Item, operand2: Item) {
    super();
    this._operand1 = operand1;
    this._operand2 = operand2;
  }

  get operand1(): Item {
    return this._operand1;
  }

  abstract readonly operator: string;

  get operand2(): Item {
    return this._operand2;
  }

  isConstant(): boolean {
    return this._operand1.isConstant() && this._operand2.isConstant();
  }

  interpolateTo(that: BinaryOperator): Interpolator<BinaryOperator>;
  interpolateTo(that: Item): Interpolator<Item>;
  interpolateTo(that: unknown): Interpolator<Item> | null;
  interpolateTo(that: unknown): Interpolator<Item> | null {
    if (that instanceof BinaryOperator && this.operator === that.operator) {
      return BinaryOperatorInterpolator(this, that);
    } else {
      return super.interpolateTo(that);
    }
  }
}
