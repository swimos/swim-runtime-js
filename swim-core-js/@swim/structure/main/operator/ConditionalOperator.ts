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

import {Murmur3, Numbers, Constructors} from "@swim/util";
import type {Output} from "@swim/codec";
import {Item} from "../Item";
import {Operator} from "../Operator";
import {AnyInterpreter, Interpreter} from "../Interpreter";

export class ConditionalOperator extends Operator {
  /** @hidden */
  readonly _ifTerm: Item;
  /** @hidden */
  readonly _thenTerm: Item;
  /** @hidden */
  readonly _elseTerm: Item;

  constructor(ifTerm: Item, thenTerm: Item, elseTerm: Item) {
    super();
    this._ifTerm = ifTerm.commit();
    this._thenTerm = thenTerm.commit();
    this._elseTerm = elseTerm.commit();
  }

  ifTerm(): Item {
    return this._ifTerm;
  }

  thenTerm(): Item {
    return this._thenTerm;
  }

  elseTerm(): Item {
    return this._elseTerm;
  }

  isConstant(): boolean {
    return this._ifTerm.isConstant() && this._thenTerm.isConstant()
        && this._elseTerm.isConstant();
  }

  precedence(): number {
    return 2;
  }

  evaluate(interpreter: AnyInterpreter): Item {
    interpreter = Interpreter.fromAny(interpreter);
    interpreter.willOperate(this);
    let result;
    const ifTerm = this._ifTerm.evaluate(interpreter);
    if (ifTerm.booleanValue(false)) {
      const theTerm = this._thenTerm.evaluate(interpreter);
      result = theTerm;
    } else {
      const elseTerm = this._elseTerm.evaluate(interpreter);
      result = elseTerm;
    }
    interpreter.didOperate(this, result);
    return result;
  }

  substitute(interpreter: AnyInterpreter): Item {
    interpreter = Interpreter.fromAny(interpreter);
    const ifTerm = this._ifTerm.substitute(interpreter);
    const thenTerm = this._thenTerm.substitute(interpreter);
    const elseTerm = this._elseTerm.substitute(interpreter);
    return new ConditionalOperator(ifTerm, thenTerm, elseTerm);
  }

  typeOrder() {
    return 20;
  }

  compareTo(that: unknown): number {
    if (that instanceof ConditionalOperator) {
      let order = this._ifTerm.compareTo(that._ifTerm);
      if (order === 0) {
        order = this._thenTerm.compareTo(that._thenTerm);
        if (order === 0) {
          order = this._elseTerm.compareTo(that._elseTerm);
        }
      }
      return order;
    } else if (that instanceof Item) {
      return Numbers.compare(this.typeOrder(), that.typeOrder());
    }
    return NaN;
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof ConditionalOperator) {
      return this._ifTerm.equivalentTo(that._ifTerm, epsilon)
          && this._thenTerm.equivalentTo(that._thenTerm, epsilon)
          && this._elseTerm.equivalentTo(that._elseTerm, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof ConditionalOperator) {
      return this._ifTerm.equals(that._ifTerm) && this._thenTerm.equals(that._thenTerm)
          && this._elseTerm.equals(that._elseTerm);
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Murmur3.mix(Constructors.hash(ConditionalOperator),
        this._ifTerm.hashCode()), this._thenTerm.hashCode()), this._elseTerm.hashCode()));
  }

  debug(output: Output): void {
    output.debug(this._ifTerm).write(46/*'.'*/).write("conditional").write(40/*'('*/)
        .debug(this._thenTerm).write(44/*','*/).write(32/*' '*/)
        .debug(this._elseTerm).write(41/*')'*/);
  }

  clone(): ConditionalOperator {
    return new ConditionalOperator(this._ifTerm.clone(), this._thenTerm.clone(), this._elseTerm.clone());
  }
}
Item.ConditionalOperator = ConditionalOperator;
