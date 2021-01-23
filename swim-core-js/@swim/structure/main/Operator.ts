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

import {Item} from "./Item";
import {Expression} from "./Expression";
import type {BinaryOperator} from "./operator/BinaryOperator";
import type {UnaryOperator} from "./operator/UnaryOperator";

export abstract class Operator extends Expression {
  /** @hidden */
  constructor() {
    super();
  }

  static binary(operand1: Item, operator: string, operand2: Item): BinaryOperator {
    switch (operator) {
      case "||": return new Item.OrOperator(operand1, operand2);
      case "&&": return new Item.AndOperator(operand1, operand2);
      case "|": return new Item.BitwiseOrOperator(operand1, operand2);
      case "^": return new Item.BitwiseXorOperator(operand1, operand2);
      case "&": return new Item.BitwiseAndOperator(operand1, operand2);
      case "<": return new Item.LtOperator(operand1, operand2);
      case "<=": return new Item.LeOperator(operand1, operand2);
      case "==": return new Item.EqOperator(operand1, operand2);
      case "!=": return new Item.NeOperator(operand1, operand2);
      case ">=": return new Item.GeOperator(operand1, operand2);
      case ">": return new Item.GtOperator(operand1, operand2);
      case "+": return new Item.PlusOperator(operand1, operand2);
      case "-": return new Item.MinusOperator(operand1, operand2);
      case "*": return new Item.TimesOperator(operand1, operand2);
      case "/": return new Item.DivideOperator(operand1, operand2);
      case "%": return new Item.ModuloOperator(operand1, operand2);
      default: throw new Error(operator);
    }
  }

  static unary(operator: string, operand: Item): UnaryOperator {
    switch (operator) {
      case "!": return new Item.NotOperator(operand);
      case "~": return new Item.BitwiseNotOperator(operand);
      case "-": return new Item.NegativeOperator(operand);
      case "+": return new Item.PositiveOperator(operand);
      default: throw new Error(operator);
    }
  }
}
Item.Operator = Operator;
