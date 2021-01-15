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

import {InterpreterException} from "./InterpreterException";
import {InterpreterSettings} from "./InterpreterSettings";
import {AnyItem, Item} from "./Item";
import type {Selector} from "./Selector";
import type {Operator} from "./Operator";

export type AnyInterpreter = Interpreter | AnyItem;

export class Interpreter {
  /** @hidden */
  _settings: InterpreterSettings;
  /** @hidden */
  _scopeStack: Item[] | null;
  /** @hidden */
  _scopeDepth: number;

  constructor(settings: InterpreterSettings = InterpreterSettings.standard(),
              scopeStack: Item[] | null = null, scopeDepth: number = 0) {
    this._settings = settings;
    this._scopeStack = scopeStack;
    this._scopeDepth = scopeDepth;
  }

  settings(): InterpreterSettings;

  settings(settings: InterpreterSettings): this;

  settings(settings?: InterpreterSettings): InterpreterSettings | this {
    if (settings === void 0) {
      return this._settings;
    } else {
      this._settings = settings;
      return this;
    }
  }

  scopeDepth(): number {
    return this._scopeDepth;
  }

  peekScope(): Item {
    const scopeDepth = this._scopeDepth;
    if (scopeDepth <= 0) {
      throw new InterpreterException("scope stack empty");
    }
    return this._scopeStack![scopeDepth - 1]!;
  }

  getScope(index: number): Item {
    if (index < 0 || index >= this._scopeDepth) {
      throw new RangeError("" + index);
    }
    return this._scopeStack![index]!;
  }

  pushScope(scope: Item): void {
    const scopeDepth = this._scopeDepth;
    if (scopeDepth >= this._settings._maxScopeDepth) {
      throw new InterpreterException("scope stack overflow");
    }
    const oldScopeStack = this._scopeStack;
    let newScopeStack;
    if (oldScopeStack === null || scopeDepth + 1 > oldScopeStack.length) {
      newScopeStack = new Array<Item>(Interpreter.expand(scopeDepth + 1));
      if (oldScopeStack !== null) {
        for (let i = 0; i < scopeDepth; i += 1) {
          newScopeStack[i] = oldScopeStack[i]!;
        }
      }
      this._scopeStack = newScopeStack;
    } else {
      newScopeStack = oldScopeStack;
    }
    newScopeStack[scopeDepth] = scope;
    this._scopeDepth = scopeDepth + 1;
  }

  popScope(): Item {
    const scopeDepth = this._scopeDepth;
    if (scopeDepth <= 0) {
      throw new InterpreterException("scope stack empty");
    }
    const scopeStack = this._scopeStack!;
    const scope = scopeStack[scopeDepth - 1]!;
    scopeStack[scopeDepth - 1] = void 0 as any;
    this._scopeDepth = scopeDepth - 1;
    return scope;
  }

  swapScope(newScope: Item): Item {
    const scopeDepth = this._scopeDepth;
    if (scopeDepth <= 0) {
      throw new InterpreterException("scope stack empty");
    }
    const scopeStack = this._scopeStack!;
    const oldScope = scopeStack[scopeDepth - 1]!;
    scopeStack[scopeDepth - 1] = newScope;
    return oldScope;
  }

  willOperate(operator: Operator): void {
    // stub
  }

  didOperate(operator: Operator, result: Item): void {
    // stub
  }

  willSelect(selector: Selector): void {
    // stub
  }

  didSelect(selector: Selector, result: unknown): void {
    // stub
  }

  willTransform(selector: Selector): void {
    // stub
  }

  didTransform(selector: Selector, result: Item): void {
    // stub
  }

  static of(...objects: AnyItem[]): Interpreter {
    const n = arguments.length;
    const scopes = new Array(Interpreter.expand(n));
    for (let i = 0; i < n; i += 1) {
      const scope = Item.fromAny(arguments[i]);
      scopes[i] = scope;
    }
    return new Interpreter(InterpreterSettings.standard(), scopes, n);
  }

  static fromAny(interpreter: AnyInterpreter, globalScope: Item = Item.globalScope()): Interpreter {
    if (!(interpreter instanceof Interpreter)) {
      const scope = interpreter;
      interpreter = new Interpreter();
      if (globalScope !== void 0) {
        interpreter.pushScope(globalScope);
      }
      if (scope !== void 0) {
        interpreter.pushScope(Item.fromAny(scope));
      }
    }
    return interpreter;
  }

  private static expand(n: number): number {
    n = Math.max(32, n) - 1;
    n |= n >> 1; n |= n >> 2; n |= n >> 4; n |= n >> 8; n |= n >> 16;
    return n + 1;
  }
}
