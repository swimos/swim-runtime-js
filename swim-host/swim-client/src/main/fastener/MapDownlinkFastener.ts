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
import type {MapDownlinkObserver, MapDownlink} from "../downlink/MapDownlink";
import type {WarpRef} from "../ref/WarpRef";
import {
  DownlinkFastenerRefinement,
  DownlinkFastenerTemplate,
  DownlinkFastenerClass,
  DownlinkFastener,
} from "./DownlinkFastener";

/** @public */
export interface MapDownlinkFastenerRefinement extends DownlinkFastenerRefinement {
  key?: unknown;
  keyInit?: unknown;
  value?: unknown;
  valueInit?: unknown;
}

/** @public */
export type MapDownlinkFastenerKey<R extends MapDownlinkFastenerRefinement | MapDownlinkFastener<any, any, any, any, any>, D = Value> =
  R extends {key: infer K} ? K :
  R extends {extends: infer E} ? MapDownlinkFastenerKey<E, D> :
  R extends MapDownlinkFastener<any, infer K, any, any, any> ? K :
  D;

/** @public */
export type MapDownlinkFastenerValue<R extends MapDownlinkFastenerRefinement | MapDownlinkFastener<any, any, any, any, any>, D = Value> =
  R extends {value: infer V} ? V :
  R extends {extends: infer E} ? MapDownlinkFastenerValue<E, D> :
  R extends MapDownlinkFastener<any, any, infer V, any, any> ? V :
  D;

/** @public */
export type MapDownlinkFastenerKeyInit<R extends MapDownlinkFastenerRefinement | MapDownlinkFastener<any, any, any, any, any>, D = MapDownlinkFastenerKey<R, AnyValue>> =
  R extends {keyInit: infer KU} ? KU :
  R extends {extends: infer E} ? MapDownlinkFastenerKeyInit<E, D> :
  R extends MapDownlinkFastener<any, any, any, infer KU, any> ? KU :
  D;

/** @public */
export type MapDownlinkFastenerValueInit<R extends MapDownlinkFastenerRefinement | MapDownlinkFastener<any, any, any, any, any>, D = MapDownlinkFastenerValue<R, AnyValue>> =
  R extends {valueInit: infer VU} ? VU :
  R extends {extends: infer E} ? MapDownlinkFastenerValueInit<E, D> :
  R extends MapDownlinkFastener<any, any, any, any, infer VU> ? VU :
  D;

/** @public */
export interface MapDownlinkFastenerTemplate<K = unknown, V = unknown, KU = K, VU = V> extends DownlinkFastenerTemplate {
  extends?: Proto<MapDownlinkFastener<any, any, any, any, any>> | string | boolean | null;
  keyForm?: Form<K, KU>;
  valueForm?: Form<V, VU>;
}

/** @public */
export interface MapDownlinkFastenerClass<F extends MapDownlinkFastener<any, any, any> = MapDownlinkFastener<any, any, any>> extends DownlinkFastenerClass<F> {
  /** @override */
  specialize(className: string, template: MapDownlinkFastenerTemplate): MapDownlinkFastenerClass;

  /** @override */
  refine(fastenerClass: MapDownlinkFastenerClass): void;

  /** @override */
  extend(className: string, template: MapDownlinkFastenerTemplate): MapDownlinkFastenerClass<F>;

  /** @override */
  specify<O, K = Value, V = Value, KU = K extends Value ? AnyValue : K, VU = V extends Value ? AnyValue : V>(className: string, template: ThisType<MapDownlinkFastener<O, K, V, KU, VU>> & MapDownlinkFastenerTemplate<K, V, KU, VU> & Partial<Omit<MapDownlinkFastener<O, K, V, KU, VU>, keyof MapDownlinkFastenerTemplate>>): MapDownlinkFastenerClass<F>;

  /** @override */
  <O, K = Value, V = Value, KU = K extends Value ? AnyValue : K, VU = V extends Value ? AnyValue : V>(template: ThisType<MapDownlinkFastener<O, K, V, KU, VU>> & MapDownlinkFastenerTemplate<K, V, KU, VU> & Partial<Omit<MapDownlinkFastener<O, K, V, KU, VU>, keyof MapDownlinkFastenerTemplate>>): PropertyDecorator;
}

/** @public */
export type MapDownlinkFastenerDef<O, R extends MapDownlinkFastenerRefinement> =
  MapDownlinkFastener<O, MapDownlinkFastenerKey<R>, MapDownlinkFastenerValue<R>, MapDownlinkFastenerKeyInit<R>, MapDownlinkFastenerValueInit<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function MapDownlinkFastenerDef<F extends MapDownlinkFastener<any, any, any>>(
  template: F extends MapDownlinkFastenerDef<infer O, infer R>
          ? ThisType<MapDownlinkFastenerDef<O, R>>
          & MapDownlinkFastenerTemplate<MapDownlinkFastenerKey<R>, MapDownlinkFastenerValue<R>, MapDownlinkFastenerKeyInit<R>, MapDownlinkFastenerValueInit<R>>
          & Partial<Omit<MapDownlinkFastener<O, MapDownlinkFastenerKey<R>, MapDownlinkFastenerValue<R>, MapDownlinkFastenerKeyInit<R>, MapDownlinkFastenerValueInit<R>>, keyof MapDownlinkFastenerTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof MapDownlinkFastenerTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return MapDownlinkFastener(template);
}

/** @public */
export interface MapDownlinkFastener<O = unknown, K = unknown, V = unknown, KU = K, VU = V> extends DownlinkFastener<O>, MapDownlinkObserver<K, V, KU, VU> {
  (key: K | KU): V | undefined;
  (key: K | KU, value: V | VU): O;

  /** @protected */
  initKeyForm(): Form<K, KU> | null;

  keyForm: Form<K, KU> | null;

  setKeyForm(keyForm: Form<K, KU> | null): void;

  /** @protected */
  initValueForm(): Form<V, VU> | null;

  readonly valueForm: Form<V, VU> | null;

  setValueForm(valueForm: Form<V, VU> | null): void;

  get size(): number;

  isEmpty(): boolean;

  has(key: K | KU): boolean;

  get(key: K | KU): V | undefined;

  getEntry(index: number): [K, V] | undefined;

  firstKey(): K | undefined;

  firstValue(): V | undefined;

  firstEntry(): [K, V] | undefined;

  lastKey(): K | undefined;

  lastValue(): V | undefined;

  lastEntry(): [K, V] | undefined;

  nextKey(keyObject: K): K | undefined;

  nextValue(keyObject: K): V | undefined;

  nextEntry(keyObject: K): [K, V] | undefined;

  previousKey(keyObject: K): K | undefined;

  previousValue(keyObject: K): V | undefined;

  previousEntry(keyObject: K): [K, V] | undefined;

  set(key: K | KU, newValue: V | VU): this;

  delete(key: K | KU): boolean;

  drop(lower: number): this;

  take(upper: number): this;

  clear(): void;

  forEach<T>(callback: (key: K, value: V) => T | void): T | undefined;
  forEach<T, S>(callback: (this: S, key: K, value: V) => T | void, thisArg: S): T | undefined;

  keys(): Cursor<K>;

  values(): Cursor<V>;

  entries(): Cursor<[K, V]>;

  /** @override */
  readonly downlink: MapDownlink<K, V, KU, VU> | null;

  /** @internal @override */
  createDownlink(warp: WarpRef): MapDownlink<K, V, KU, VU>;

  /** @override */
  initDownlink?(downlink: MapDownlink<K, V, KU, VU>): MapDownlink<K, V, KU, VU>;

  /** @internal @override */
  bindDownlink(downlink: MapDownlink<K, V, KU, VU>): MapDownlink<K, V, KU, VU>;
}

/** @public */
export const MapDownlinkFastener = (function (_super: typeof DownlinkFastener) {
  const MapDownlinkFastener = _super.extend("MapDownlinkFastener", {}) as MapDownlinkFastenerClass;

  MapDownlinkFastener.prototype.initKeyForm = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): Form<K, KU> | null {
    let keyForm = (Object.getPrototypeOf(this) as MapDownlinkFastener<unknown, K,V, KU, VU>).keyForm as Form<K, KU> | null | undefined;
    if (keyForm === void 0) {
      keyForm = null;
    }
    return keyForm;
  };

  MapDownlinkFastener.prototype.setKeyForm = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyForm: Form<K, KU> | null): void {
    if (this.keyForm !== keyForm) {
      (this as Mutable<typeof this>).keyForm = keyForm;
      this.relink();
    }
  };

  MapDownlinkFastener.prototype.initValueForm = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): Form<V, VU> | null {
    let valueForm = (Object.getPrototypeOf(this) as MapDownlinkFastener<unknown, K,V, KU, VU>).valueForm as Form<V, VU> | null | undefined;
    if (valueForm === void 0) {
      valueForm = null;
    }
    return valueForm;
  };

  MapDownlinkFastener.prototype.setValueForm = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, valueForm: Form<V, VU> | null): void {
    if (this.valueForm !== valueForm) {
      (this as Mutable<typeof this>).valueForm = valueForm;
      this.relink();
    }
  };

  Object.defineProperty(MapDownlinkFastener.prototype, "size", {
    get: function (this: MapDownlinkFastener<unknown>): number {
      const downlink = this.downlink;
      return downlink !== null ? downlink.size : 0;
    },
    configurable: true,
  });

  MapDownlinkFastener.prototype.isEmpty = function (this: MapDownlinkFastener<unknown>): boolean {
    const downlink = this.downlink;
    return downlink !== null ? downlink.isEmpty() : true;
  };

  MapDownlinkFastener.prototype.has = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, key: K | KU): boolean {
    const downlink = this.downlink;
    return downlink !== null ? downlink.has(key) : false;
  };

  MapDownlinkFastener.prototype.get = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, key: K | KU): V | undefined {
    const downlink = this.downlink;
    let value: V | undefined;
    if (downlink !== null) {
      value = downlink.get(key);
    }
    if (value === void 0 && this.valueForm !== null) {
      value = this.valueForm.unit;
    }
    return value;
  };

  MapDownlinkFastener.prototype.getEntry = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, index: number): [K, V] | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.getEntry(index) : void 0;
  };

  MapDownlinkFastener.prototype.firstKey = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): K | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.firstKey() : void 0;
  };

  MapDownlinkFastener.prototype.firstValue = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.firstValue() : void 0;
  };

  MapDownlinkFastener.prototype.firstEntry = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): [K, V] | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.firstEntry() : void 0;
  };

  MapDownlinkFastener.prototype.lastKey = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): K | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.lastKey() : void 0;
  };

  MapDownlinkFastener.prototype.lastValue = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.lastValue() : void 0;
  };

  MapDownlinkFastener.prototype.lastEntry = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): [K, V] | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.lastEntry() : void 0;
  };

  MapDownlinkFastener.prototype.nextKey = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyObject: K): K | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.nextKey(keyObject) : void 0;
  };

  MapDownlinkFastener.prototype.nextValue = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyObject: K): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.nextValue(keyObject) : void 0;
  };

  MapDownlinkFastener.prototype.nextEntry = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyObject: K): [K, V] | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.nextEntry(keyObject) : void 0;
  };

  MapDownlinkFastener.prototype.previousKey = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyObject: K): K | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.previousKey(keyObject) : void 0;
  };

  MapDownlinkFastener.prototype.previousValue = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyObject: K): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.previousValue(keyObject) : void 0;
  };

  MapDownlinkFastener.prototype.previousEntry = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, keyObject: K): [K, V] | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.previousEntry(keyObject) : void 0;
  };

  MapDownlinkFastener.prototype.set = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, key: K | KU, newValue: V | VU): typeof this {
    const downlink = this.downlink;
    if (downlink !== null) {
      downlink.set(key, newValue);
    }
    return this;
  };

  MapDownlinkFastener.prototype.delete = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, key: K | KU): boolean {
    const downlink = this.downlink;
    return downlink !== null ? downlink.delete(key) : false;
  };

  MapDownlinkFastener.prototype.drop = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, lower: number): typeof this {
    const downlink = this.downlink;
    if (downlink !== null) {
      downlink.drop(lower);
    }
    return this;
  };

  MapDownlinkFastener.prototype.take = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, upper: number): typeof this {
    const downlink = this.downlink;
    if (downlink !== null) {
      downlink.take(upper);
    }
    return this;
  };

  MapDownlinkFastener.prototype.clear = function (this: MapDownlinkFastener<unknown>): void {
    const downlink = this.downlink;
    if (downlink !== null) {
      downlink.clear();
    }
  };

  MapDownlinkFastener.prototype.forEach = function <K, V, KU, VU, T, S>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, callback: (this: S | undefined, key: K, value: V) => T | void, thisArg?: S): T | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.forEach(callback, thisArg) : void 0;
  };

  MapDownlinkFastener.prototype.keys = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): Cursor<K> {
    const downlink = this.downlink;
    return downlink !== null ? downlink.keys() : Cursor.empty();
  };

  MapDownlinkFastener.prototype.values = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): Cursor<V> {
    const downlink = this.downlink;
    return downlink !== null ? downlink.values() : Cursor.empty();
  };

  MapDownlinkFastener.prototype.entries = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>): Cursor<[K, V]> {
    const downlink = this.downlink;
    return downlink !== null ? downlink.entries() : Cursor.empty();
  };

  MapDownlinkFastener.prototype.createDownlink = function <K, V, KU, VU>(this: MapDownlinkFastener<unknown, K, V, KU, VU>, warp: WarpRef): MapDownlink<K, V, KU, VU> {
    let downlink = warp.downlinkMap() as unknown as MapDownlink<K, V, KU, VU>;
    if (this.keyForm !== null) {
      downlink = downlink.keyForm(this.keyForm);
    }
    if (this.valueForm !== null) {
      downlink = downlink.valueForm(this.valueForm);
    }
    return downlink;
  };

  MapDownlinkFastener.construct = function <F extends MapDownlinkFastener<any, any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (key: MapDownlinkFastenerKey<F> | MapDownlinkFastenerKeyInit<F>, value?: MapDownlinkFastenerValue<F> | MapDownlinkFastenerValueInit<F>): MapDownlinkFastenerValue<F> | undefined | FastenerOwner<F> {
        if (arguments.length === 1) {
          return fastener!.get(key);
        } else {
          fastener!.set(key, value!);
          return fastener!.owner;
        }
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).keyForm = fastener.initKeyForm();
    (fastener as Mutable<typeof fastener>).valueForm = fastener.initValueForm();
    return fastener;
  };

  return MapDownlinkFastener;
})(DownlinkFastener);
