// Copyright 2015-2022 Swim.inc
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

import {Mutable, Proto, Cursor} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import type {AnyValue, Value, Form} from "@swim/structure";
import type {ListDownlinkObserver, ListDownlink} from "../downlink/ListDownlink";
import type {WarpRef} from "../ref/WarpRef";
import {
  DownlinkFastenerRefinement,
  DownlinkFastenerTemplate,
  DownlinkFastenerClass,
  DownlinkFastener,
} from "./DownlinkFastener";

/** @public */
export interface ListDownlinkFastenerRefinement extends DownlinkFastenerRefinement {
  value?: unknown;
  valueInit?: unknown;
}

/** @public */
export type ListDownlinkFastenerValue<R extends ListDownlinkFastenerRefinement | ListDownlinkFastener<any, any, any>, D = Value> =
  R extends {value: infer V} ? V :
  R extends {extends: infer E} ? ListDownlinkFastenerValue<E, D> :
  R extends ListDownlinkFastener<any, infer V, any> ? V :
  D;

/** @public */
export type ListDownlinkFastenerValueInit<R extends ListDownlinkFastenerRefinement | ListDownlinkFastener<any, any, any>, D = ListDownlinkFastenerValue<R, AnyValue>> =
  R extends {valueInit: infer VU} ? VU :
  R extends {extends: infer E} ? ListDownlinkFastenerValueInit<E, D> :
  R extends ListDownlinkFastener<any, any, infer VU> ? VU :
  D;

/** @public */
export interface ListDownlinkFastenerTemplate<V = unknown, VU = V> extends DownlinkFastenerTemplate {
  extends?: Proto<ListDownlinkFastener<any, any, any>> | string | boolean | null;
  valueForm?: Form<V, VU>;
}

/** @public */
export interface ListDownlinkFastenerClass<F extends ListDownlinkFastener<any, any> = ListDownlinkFastener<any, any>> extends DownlinkFastenerClass<F> {
  /** @override */
  specialize(className: string, template: ListDownlinkFastenerTemplate): ListDownlinkFastenerClass;

  /** @override */
  refine(fastenerClass: ListDownlinkFastenerClass): void;

  /** @override */
  extend(className: string, template: ListDownlinkFastenerTemplate): ListDownlinkFastenerClass<F>;

  /** @override */
  specify<O, V = Value, VU = V extends Value ? AnyValue : V>(className: string, template: ThisType<ListDownlinkFastener<O, V, VU>> & ListDownlinkFastenerTemplate<V, VU> & Partial<Omit<ListDownlinkFastener<O, V, VU>, keyof ListDownlinkFastenerTemplate>>): ListDownlinkFastenerClass<F>;

  /** @override */
  <O, V = Value, VU = V extends Value ? AnyValue : V>(template: ThisType<ListDownlinkFastener<O, V, VU>> & ListDownlinkFastenerTemplate<V, VU> & Partial<Omit<ListDownlinkFastener<O, V, VU>, keyof ListDownlinkFastenerTemplate>>): PropertyDecorator;
}

/** @public */
export type ListDownlinkFastenerDef<O, R extends ListDownlinkFastenerRefinement> =
  ListDownlinkFastener<O, ListDownlinkFastenerValue<R>,
                          ListDownlinkFastenerValueInit<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function ListDownlinkFastenerDef<F extends ListDownlinkFastener<any, any, any>>(
  template: F extends ListDownlinkFastenerDef<infer O, infer R>
          ? ThisType<ListDownlinkFastenerDef<O, R>>
          & ListDownlinkFastenerTemplate<ListDownlinkFastenerValue<R>, ListDownlinkFastenerValueInit<R>>
          & Partial<Omit<ListDownlinkFastener<O, ListDownlinkFastenerValue<R>, ListDownlinkFastenerValueInit<R>>, keyof ListDownlinkFastenerTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ListDownlinkFastenerTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return ListDownlinkFastener(template);
}

/** @public */
export interface ListDownlinkFastener<O = unknown, V = unknown, VU = V> extends DownlinkFastener<O>, ListDownlinkObserver<V, VU> {
  (index: number): V | undefined;
  (index: number, newObject: V | VU): O;

  /** @protected */
  initValueForm(): Form<V, VU> | null;

  readonly valueForm: Form<V, VU> | null;

  setValueForm(valueForm: Form<V, VU> | null): void;

  get length(): number;

  isEmpty(): boolean;

  get(index: number, id?: Value): V | undefined;

  getEntry(index: number, id?: Value): [V, Value] | undefined;

  set(index: number, newObject: V | VU, id?: Value): this;

  insert(index: number, newObject: V | VU, id?: Value): this;

  remove(index: number, id?: Value): this;

  push(...newObjects: (V | VU)[]): number;

  pop(): V | undefined;

  unshift(...newObjects: (V | VU)[]): number;

  shift(): V | undefined;

  move(fromIndex: number, toIndex: number, id?: Value): this;

  splice(start: number, deleteCount?: number, ...newObjects: (V | VU)[]): V[];

  clear(): void;

  forEach<T>(callback: (value: V, index: number, id: Value) => T | void): T | undefined;
  forEach<T, S>(callback: (this: S, value: V, index: number, id: Value) => T | void, thisArg: S): T | undefined;

  values(): Cursor<V>;

  keys(): Cursor<Value>;

  entries(): Cursor<[Value, V]>;

  /** @override */
  readonly downlink: ListDownlink<V, VU> | null;

  /** @internal @override */
  createDownlink(warp: WarpRef): ListDownlink<V, VU>;

  /** @override */
  initDownlink?(downlink: ListDownlink<V, VU>): ListDownlink<V, VU>;

  /** @internal @override */
  bindDownlink(downlink: ListDownlink<V, VU>): ListDownlink<V, VU>;
}

/** @public */
export const ListDownlinkFastener = (function (_super: typeof DownlinkFastener) {
  const ListDownlinkFastener = _super.extend("ListDownlinkFastener", {}) as ListDownlinkFastenerClass;

  ListDownlinkFastener.prototype.initValueForm = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>): Form<V, VU> | null {
    let valueForm = (Object.getPrototypeOf(this) as ListDownlinkFastener<unknown, V, VU>).valueForm as Form<V, VU> | null | undefined;
    if (valueForm === void 0) {
      valueForm = null;
    }
    return valueForm;
  };

  ListDownlinkFastener.prototype.setValueForm = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, valueForm: Form<V, VU> | null): void {
    if (this.valueForm !== valueForm) {
      (this as Mutable<typeof this>).valueForm = valueForm;
      this.relink();
    }
  };

  Object.defineProperty(ListDownlinkFastener.prototype, "length", {
    get: function (this: ListDownlinkFastener<unknown>): number {
      const downlink = this.downlink;
      return downlink !== null ? downlink.length : 0;
    },
    configurable: true,
  });

  ListDownlinkFastener.prototype.isEmpty = function (this: ListDownlinkFastener<unknown>): boolean {
    const downlink = this.downlink;
    return downlink !== null ? downlink.isEmpty() : true;
  };

  ListDownlinkFastener.prototype.get = function <V>(this: ListDownlinkFastener<unknown, V>, index: number, id?: Value): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.get(index, id) : void 0;
  };

  ListDownlinkFastener.prototype.getEntry = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, index: number, id?: Value): [V, Value] | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.getEntry(index, id) : void 0;
  };

  ListDownlinkFastener.prototype.set = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, index: number, newObject: V | VU, id?: Value): ListDownlinkFastener<unknown, V, VU> {
    const downlink = this.downlink;
    if (downlink != null) {
      downlink.set(index, newObject, id);
    }
    return this;
  };

  ListDownlinkFastener.prototype.insert = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, index: number, newObject: V | VU, id?: Value): ListDownlinkFastener<unknown, V, VU> {
    const downlink = this.downlink;
    if (downlink != null) {
      downlink.insert(index, newObject, id);
    }
    return this;
  };

  ListDownlinkFastener.prototype.remove = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, index: number, id?: Value): ListDownlinkFastener<unknown, V, VU> {
    const downlink = this.downlink;
    if (downlink != null) {
      downlink.remove(index, id);
    }
    return this;
  };

  ListDownlinkFastener.prototype.push = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, ...newObjects: (V | VU)[]): number {
    const downlink = this.downlink;
    return downlink !== null ? downlink.push(...newObjects) : 0;
  };

  ListDownlinkFastener.prototype.pop = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.pop() : void 0;
  };

  ListDownlinkFastener.prototype.unshift = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, ...newObjects: (V | VU)[]): number {
    const downlink = this.downlink;
    return downlink !== null ? downlink.unshift(...newObjects) : 0;
  };

  ListDownlinkFastener.prototype.shift = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.shift() : void 0;
  };

  ListDownlinkFastener.prototype.move = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, fromIndex: number, toIndex: number, id?: Value): ListDownlinkFastener<unknown, V, VU> {
    const downlink = this.downlink;
    if (downlink != null) {
      downlink.move(fromIndex, toIndex, id);
    }
    return this;
  };

  ListDownlinkFastener.prototype.splice = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, start: number, deleteCount?: number, ...newObjects: (V | VU)[]): V[] {
    const downlink = this.downlink;
    return downlink !== null ? downlink.splice(start, deleteCount, ...newObjects) : [];
  };

  ListDownlinkFastener.prototype.clear = function (this: ListDownlinkFastener<unknown>): void {
    const downlink = this.downlink;
    if (downlink != null) {
      downlink.clear();
    }
  };

  ListDownlinkFastener.prototype.forEach = function <V, VU, T, S>(this: ListDownlinkFastener<unknown, V, VU>, callback: (this: S | undefined, value: V, index: number, id: Value) => T | void, thisArg?: S): T | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.forEach(callback, thisArg) : void 0;
  };

  ListDownlinkFastener.prototype.values = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>): Cursor<V> {
    const downlink = this.downlink;
    return downlink !== null ? downlink.values() : Cursor.empty();
  };

  ListDownlinkFastener.prototype.keys = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>): Cursor<Value> {
    const downlink = this.downlink;
    return downlink !== null ? downlink.keys() : Cursor.empty();
  };

  ListDownlinkFastener.prototype.entries = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>): Cursor<[Value, V]> {
    const downlink = this.downlink;
    return downlink !== null ? downlink.entries() : Cursor.empty();
  };

  ListDownlinkFastener.prototype.createDownlink = function <V, VU>(this: ListDownlinkFastener<unknown, V, VU>, warp: WarpRef): ListDownlink<V, VU> {
    let downlink = warp.downlinkList() as unknown as ListDownlink<V, VU>;
    if (this.valueForm !== null) {
      downlink = downlink.valueForm(this.valueForm);
    }
    return downlink;
  };

  ListDownlinkFastener.construct = function <F extends ListDownlinkFastener<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (index: number, value?: ListDownlinkFastenerValue<F> | ListDownlinkFastenerValueInit<F>): ListDownlinkFastenerValue<F> | undefined | FastenerOwner<F> {
        if (arguments.length === 0) {
          return fastener!.get(index);
        } else {
          fastener!.set(index, value!);
          return fastener!.owner;
        }
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).valueForm = fastener.initValueForm();
    return fastener;
  };

  return ListDownlinkFastener;
})(DownlinkFastener);
