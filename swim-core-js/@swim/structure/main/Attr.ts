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
import type {Interpolator} from "@swim/mapping";
import {AnyItem, Item} from "./Item";
import {AnyField, Field} from "./Field";
import {AttrInterpolator} from "./"; // forward import
import {Slot} from "./"; // forward import
import {AnyValue, Value} from "./"; // forward import
import {AnyText, Text} from "./"; // forward import
import {Extant} from "./" // forward import
import {Expression} from "./"; // forward import
import {BitwiseOrOperator} from "./"; // forward import
import {BitwiseXorOperator} from "./"; // forward import
import {BitwiseAndOperator} from "./"; // forward import
import {PlusOperator} from "./"; // forward import
import {MinusOperator} from "./"; // forward import
import {TimesOperator} from "./"; // forward import
import {DivideOperator} from "./"; // forward import
import {ModuloOperator} from "./"; // forward import
import {AnyInterpreter, Interpreter} from "./"; // forward import

export class Attr extends Field {
  /** @hidden */
  readonly _key: Text;
  /** @hidden */
  _value: Value;
  /** @hidden */
  _flags: number;

  constructor(key: Text, value: Value = Value.extant(), flags: number = 0) {
    super();
    this._key = key;
    this._value = value;
    this._flags = flags;
  }

  isConstant(): boolean {
    return this._key.isConstant() && this._value.isConstant();
  }

  get name(): string {
    return this._key.value;
  }

  get key(): Text {
    return this._key;
  }

  get value(): Value {
    return this._value;
  }

  setValue(newValue: Value): Value {
    if ((this._flags & Field.IMMUTABLE) !== 0) {
      throw new Error("immutable");
    }
    const oldValue = this._value;
    this._value = newValue;
    return oldValue;
  }

  updatedValue(value: Value): Attr {
    return new Attr(this._key, value);
  }

  bitwiseOr(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new BitwiseOrOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.bitwiseOr(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.bitwiseOr(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  bitwiseXor(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new BitwiseXorOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.bitwiseXor(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.bitwiseXor(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  bitwiseAnd(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new BitwiseAndOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.bitwiseAnd(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.bitwiseAnd(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  plus(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new PlusOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.plus(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.plus(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  minus(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new MinusOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.minus(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.minus(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  times(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new TimesOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.times(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.times(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  divide(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new DivideOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.divide(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.divide(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  modulo(that: AnyItem): Item {
    that = Item.fromAny(that);
    if (that instanceof Expression) {
      return new ModuloOperator(this, that);
    }
    let newValue;
    if (that instanceof Attr && this._key.equals(that._key)) {
      newValue = this._value.modulo(that._value);
    } else if (that instanceof Value) {
      newValue = this._value.modulo(that);
    } else {
      newValue = Value.absent();
    }
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  not(): Item {
    const newValue = this._value.not();
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  bitwiseNot(): Item {
    const newValue = this._value.bitwiseNot();
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  negative(): Item {
    const newValue = this._value.negative();
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  positive(): Item {
    const newValue = this._value.positive();
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  inverse(): Item {
    const newValue = this._value.inverse();
    if (newValue.isDefined()) {
      return new Attr(this._key, newValue);
    }
    return Item.absent();
  }

  evaluate(interpreter: AnyInterpreter): Item {
    interpreter = Interpreter.fromAny(interpreter);
    const key = this._key.evaluate(interpreter).toValue();
    const value = this._value.evaluate(interpreter).toValue();
    if (key === this._key && value === this._value) {
      return this;
    } else if (key.isDefined() && value.isDefined()) {
      if (key instanceof Text) {
        return new Attr(key, value);
      } else {
        return new Slot(key, value);
      }
    }
    return Item.absent();
  }

  substitute(interpreter: AnyInterpreter): Item {
    interpreter = Interpreter.fromAny(interpreter);
    const key = this._key.substitute(interpreter).toValue();
    const value = this._value.substitute(interpreter).toValue();
    if (key === this._key && value === this._value) {
      return this;
    } else if (key.isDefined() && value.isDefined()) {
      if (key instanceof Text) {
        return new Attr(key, value);
      } else {
        return new Slot(key, value);
      }
    }
    return Item.absent();
  }

  toAny(): AnyField {
    const field = {} as {[key: string]: AnyValue};
    field["@" + this._key.value] = this._value.toAny();
    return field;
  }

  isAliased(): boolean {
    return false;
  }

  isMutable(): boolean {
    return (this._flags & Field.IMMUTABLE) === 0;
  }

  alias(): void {
    this._flags |= Field.IMMUTABLE;
  }

  branch(): Attr {
    if ((this._flags & Field.IMMUTABLE) !== 0) {
      return new Attr(this._key, this._value, this._flags & ~Field.IMMUTABLE);
    } else {
      return this;
    }
  }

  clone(): Attr {
    return new Attr(this._key.clone(), this._value.clone());
  }

  commit(): this {
    if ((this._flags & Field.IMMUTABLE) === 0) {
      this._flags |= Field.IMMUTABLE;
      this._value.commit();
    }
    return this;
  }

  interpolateTo(that: Attr): Interpolator<Attr>;
  interpolateTo(that: Item): Interpolator<Item>;
  interpolateTo(that: unknown): Interpolator<Item> | null;
  interpolateTo(that: unknown): Interpolator<Item> | null {
    if (that instanceof Attr) {
      return AttrInterpolator(this, that);
    } else {
      return super.interpolateTo(that);
    }
  }

  get typeOrder(): number {
    return 1;
  }

  compareTo(that: Item): number {
    if (that instanceof Attr) {
      let order = this._key.compareTo(that._key);
      if (order === 0) {
        order = this._value.compareTo(that._value);
      }
      return order;
    } else if (that instanceof Item) {
      return Numbers.compare(this.typeOrder, that.typeOrder);
    }
    return NaN;
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Attr) {
      return this._key.equals(that._key) && this._value.equivalentTo(that._value, epsilon);
    }
    return false;
  }

  keyEquals(key: unknown): boolean {
    if (typeof key === "string") {
      return this._key.value === key;
    } else if (key instanceof Field) {
      return this._key.equals(key.key);
    } else {
      return this._key.equals(key);
    }
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Attr) {
      return this._key.equals(that._key) && this._value.equals(that._value);
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(Attr),
        this._key.hashCode()), this._value.hashCode()));
  }

  debug(output: Output): void {
    output = output.write("Attr").write(46/*'.'*/).write("of").write(40/*'('*/).display(this.key);
    if (!(this.value instanceof Extant)) {
      output = output.write(44/*','*/).write(32/*' '*/).display(this.value);
    }
    output = output.write(41/*')'*/);
  }

  display(output: Output): void {
    this.debug(output);
  }

  static of(key: AnyText, value?: AnyValue): Attr {
    key = Text.fromAny(key);
    value = (arguments.length >= 2 ? Value.fromAny(value) : Value.extant());
    return new Attr(key, value);
  }
}
