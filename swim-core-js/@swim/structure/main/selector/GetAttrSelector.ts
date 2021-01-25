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
import {Field} from "../Field";
import {Attr} from "../Attr";
import {Record} from "../Record";
import type {Text} from "../Text";
import {Selector} from "./Selector";
import {AnyInterpreter, Interpreter} from "../"; // forward import

export class GetAttrSelector extends Selector {
  constructor(key: Text, then: Selector) {
    super();
    Object.defineProperty(this, "accessor", {
      value: key,
      enumerable: true,
    });
    Object.defineProperty(this, "then", {
      value: then,
      enumerable: true,
    });
  }

  declare readonly accessor: Text;

  declare readonly then: Selector;

  forSelected<T>(interpreter: Interpreter,
                 callback: (interpreter: Interpreter) => T | undefined): T | undefined;
  forSelected<T, S>(interpreter: Interpreter,
                    callback: (this: S, interpreter: Interpreter) => T | undefined,
                    thisArg: S): T | undefined;
  forSelected<T, S>(interpreter: Interpreter,
                    callback: (this: S | undefined, interpreter: Interpreter) => T | undefined,
                    thisArg?: S): T | undefined {
    interpreter.willSelect(this);
    const key = this.accessor;
    const selected = GetAttrSelector.forSelected(key, this.then, interpreter, callback);
    interpreter.didSelect(this, selected);
    return selected;
  }

  private static forSelected<T, S>(key: Text, then: Selector, interpreter: Interpreter,
                                   callback: (this: S | undefined, interpreter: Interpreter) => T | undefined,
                                   thisArg?: S): T | undefined {
    let selected: T | undefined;
    if (interpreter.scopeDepth !== 0) {
      // Pop the next selection off of the stack to take it out of scope.
      const scope = interpreter.popScope().toValue();
      let field: Field | undefined;
      // Only records can have members.
      if (scope instanceof Record) {
        field = scope.getField(key);
        if (field instanceof Attr) {
          // Push the field value onto the scope stack.
          interpreter.pushScope(field.toValue());
          // Subselect the field value.
          selected = then.forSelected(interpreter, callback, thisArg);
          // Pop the field value off of the scope stack.
          interpreter.popScope();
        }
      }
      if (field === void 0 && selected === void 0) {
        GetAttrSelector.forSelected(key, then, interpreter, callback, thisArg);
      }
      // Push the current selection back onto the stack.
      interpreter.pushScope(scope);
    }
    return selected;
  }

  mapSelected(interpreter: Interpreter,
              transform: (interpreter: Interpreter) => Item): Item;
  mapSelected<S>(interpreter: Interpreter,
                 transform: (this: S, interpreter: Interpreter) => Item,
                 thisArg: S): Item;
  mapSelected<S>(interpreter: Interpreter,
                 transform: (this: S | undefined, interpreter: Interpreter) => Item,
                 thisArg?: S): Item {
    let result: Item;
    interpreter.willTransform(this);
    const key = this.accessor;
    if (interpreter.scopeDepth !== 0) {
      // Pop the current selection off of the stack to take it out of scope.
      const scope = interpreter.popScope().toValue();
      // Only records can have members.
      if (scope instanceof Record) {
        const oldField = scope.getField(key);
        if (oldField instanceof Attr) {
          // Push the field value onto the scope stack.
          interpreter.pushScope(oldField.toValue());
          // Transform the field value.
          const newItem = this.then.mapSelected(interpreter, transform, thisArg);
          // Pop the field value off the scope stack.
          interpreter.popScope();
          if (newItem instanceof Field) {
            // Replace the original field with the transformed field.
            if (key.equals(newItem.key)) {
              scope.setAttr(key, newItem.toValue());
            } else {
              scope.delete(key);
              scope.push(newItem);
            }
          } else if (newItem.isDefined()) {
            // Update the field with the transformed value.
            scope.setAttr(key, newItem.toValue());
          } else {
            // Remove the field.
            scope.delete(key);
          }
        }
      }
      // Push the transformed selection back onto the stack.
      interpreter.pushScope(scope);
      result = scope;
    } else {
      result = Item.absent();
    }
    interpreter.didTransform(this, result);
    return result;
  }

  substitute(interpreter: AnyInterpreter): Item {
    interpreter = Interpreter.fromAny(interpreter);
    const key = this.accessor;
    const value = GetAttrSelector.substitute(key, this.then, interpreter);
    if (value !== void 0) {
      return value;
    }
    let then = this.then.substitute(interpreter);
    if (!(then instanceof Selector)) {
      then = this.then;
    }
    return new GetAttrSelector(this.accessor, then as Selector);
  }

  private static substitute(key: Text, then: Selector, interpreter: Interpreter): Item | undefined {
    let selected: Item | undefined;
    if (interpreter.scopeDepth !== 0) {
      // Pop the next selection off of the stack to take it out of scope.
      const scope = interpreter.popScope().toValue();
      let field: Field | undefined;
      // Only records can have members.
      if (scope instanceof Record) {
        field = scope.getField(key);
        if (field instanceof Attr) {
          // Substitute the field value.
          selected = field.toValue().substitute(interpreter);
        }
      }
      if (field === void 0 && selected === void 0) {
        GetAttrSelector.substitute(key, then, interpreter);
      }
      // Push the current selection back onto the stack.
      interpreter.pushScope(scope);
    }
    return selected;
  }

  andThen(then: Selector): Selector {
    return new GetAttrSelector(this.accessor, this.then.andThen(then));
  }

  get typeOrder(): number {
    return 13;
  }

  compareTo(that: unknown): number {
    if (that instanceof GetAttrSelector) {
      let order = this.accessor.compareTo(that.accessor);
      if (order === 0) {
        order = this.then.compareTo(that.then);
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
    } else if (that instanceof GetAttrSelector) {
      return this.accessor.equals(that.accessor) && this.then.equivalentTo(that.then, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GetAttrSelector) {
      return this.accessor.equals(that.accessor) && this.then.equals(that.then);
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(GetAttrSelector),
        this.accessor.hashCode()), this.then.hashCode()));
  }

  debugThen(output: Output): void {
    output = output.write(46/*'.'*/).write("getAttr").write(40/*'('*/)
        .debug(this.accessor).write(41/*')'*/);
    this.then.debugThen(output);
  }

  clone(): Selector {
    return new GetAttrSelector(this.accessor.clone(), this.then.clone());
  }
}
