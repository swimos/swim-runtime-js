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

import {Arrays, Cursor, Map, OrderedMap} from "@swim/util";
import {BTree} from "@swim/collections";
import {Value, Form, ValueCursor, ValueEntryCursor} from "@swim/structure";
import {Inlet, Outlet, KeyEffect, MapInlet, MapOutlet, MapOutletCombinators, KeyOutlet} from "@swim/streamlet";
import type {Uri} from "@swim/uri";
import type {DownlinkContext} from "./DownlinkContext";
import type {DownlinkOwner} from "./DownlinkOwner";
import {DownlinkType, DownlinkObserver, DownlinkInit, DownlinkFlags, Downlink} from "./Downlink";
import {MapDownlinkModel} from "./MapDownlinkModel";

export type MapDownlinkWillUpdate<K, V, KU = never, VU = never> = (key: K, newValue: V, downlink: MapDownlink<K, V, KU, VU>) => V | void;
export type MapDownlinkDidUpdate<K, V, KU = never, VU = never> = (key: K, newValue: V, oldValue: V, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkWillRemove<K, V, KU = never, VU = never> = (key: K, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkDidRemove<K, V, KU = never, VU = never> = (key: K, oldValue: V, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkWillDrop<K, V, KU = never, VU = never> = (lower: number, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkDidDrop<K, V, KU = never, VU = never> = (lower: number, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkWillTake<K, V, KU = never, VU = never> = (upper: number, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkDidTake<K, V, KU = never, VU = never> = (upper: number, downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkWillClear<K, V, KU = never, VU = never> = (downlink: MapDownlink<K, V, KU, VU>) => void;
export type MapDownlinkDidClear<K, V, KU = never, VU = never> = (downlink: MapDownlink<K, V, KU, VU>) => void;

export interface MapDownlinkObserver<K, V, KU = never, VU = never> extends DownlinkObserver {
  willUpdate?: MapDownlinkWillUpdate<K, V, KU, VU>;
  didUpdate?: MapDownlinkDidUpdate<K, V, KU, VU>;
  willRemove?: MapDownlinkWillRemove<K, V, KU, VU>;
  didRemove?: MapDownlinkDidRemove<K, V, KU, VU>;
  willDrop?: MapDownlinkWillDrop<K, V, KU, VU>;
  didDrop?: MapDownlinkDidDrop<K, V, KU, VU>;
  willTake?: MapDownlinkWillTake<K, V, KU, VU>;
  didTake?: MapDownlinkDidTake<K, V, KU, VU>;
  willClear?: MapDownlinkWillClear<K, V, KU, VU>;
  didClear?: MapDownlinkDidClear<K, V, KU, VU>;
}

export interface MapDownlinkInit<K, V, KU = never, VU = never> extends MapDownlinkObserver<K, V, KU, VU>, DownlinkInit {
  keyForm?: Form<K, KU>;
  valueForm?: Form<V, VU>;
}

export class MapDownlink<K, V, KU = never, VU = never> extends Downlink implements OrderedMap<K, V>, MapInlet<K, V, Map<K, V>>, MapOutlet<K, V, MapDownlink<K, V, KU, VU>> {
  /** @hidden */
  declare _observers: ReadonlyArray<MapDownlinkObserver<K, V, KU, VU>> | null;
  /** @hidden */
  declare _model: MapDownlinkModel | null;
  /** @hidden */
  _keyForm: Form<K, KU>;
  /** @hidden */
  _valueForm: Form<V, VU>;
  /** @hidden */
  _state0: BTree<Value, Value> | undefined;

  /** @hidden */
  constructor(context: DownlinkContext, owner?: DownlinkOwner, init?: MapDownlinkInit<K, V, KU, VU>,
              hostUri?: Uri, nodeUri?: Uri, laneUri?: Uri, prio?: number, rate?: number,
              body?: Value, flags: number = DownlinkFlags.KeepLinkedSynced,
              observers?: ReadonlyArray<MapDownlinkObserver<K, V, KU, VU>> | MapDownlinkObserver<K, V, KU, VU> | null,
              keyForm?: Form<K, KU>, valueForm?: Form<V, VU>, state0?: BTree<Value, Value>) {
    super(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers);
    if (init !== void 0) {
      const observer = this._observers![this._observers!.length - 1]!;
      observer.willUpdate = init.willUpdate || observer.willUpdate;
      observer.didUpdate = init.didUpdate || observer.didUpdate;
      observer.willRemove = init.willRemove || observer.willRemove;
      observer.didRemove = init.didRemove || observer.didRemove;
      observer.willDrop = init.willDrop || observer.willDrop;
      observer.didDrop = init.didDrop || observer.didDrop;
      observer.willTake = init.willTake || observer.willTake;
      observer.didTake = init.didTake || observer.didTake;
      observer.willClear = init.willClear || observer.willClear;
      observer.didClear = init.didClear || observer.didClear;
      keyForm = init.keyForm !== void 0 ? init.keyForm : keyForm;
      valueForm = init.valueForm !== void 0 ? init.valueForm : valueForm;
    }
    this._keyForm = keyForm !== void 0 ? keyForm : Form.forValue() as any;
    this._valueForm = valueForm !== void 0 ? valueForm : Form.forValue() as any;
    this._state0 = state0;
    Object.defineProperty(this, "input", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "effects", {
      value: new BTree(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "outlets", {
      value: new BTree(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "outputs", {
      value: Arrays.empty,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "version", {
      value: -1,
      enumerable: true,
      configurable: true,
    });
  }

  protected copy(context: DownlinkContext, owner: DownlinkOwner | undefined,
                 hostUri: Uri, nodeUri: Uri, laneUri: Uri, prio: number, rate: number,
                 body: Value, flags: number, observers: ReadonlyArray<MapDownlinkObserver<K, V, KU, VU>> | null,
                 keyForm?: Form<K, KU>, valueForm?: Form<V, VU>, state0?: BTree<Value, Value>): this {
    if (arguments.length === 10) {
      state0 = this._state0;
      keyForm = this._keyForm;
      valueForm = this._valueForm;
    }
    return new MapDownlink(context, owner, void 0, hostUri, nodeUri, laneUri,
                           prio, rate, body, flags, observers, keyForm, valueForm,
                           state0) as this;
  }

  type(): DownlinkType {
    return "map";
  }

  keyForm(): Form<K, KU>;
  keyForm<K2, K2U = never>(keyForm: Form<K2, K2U>): MapDownlink<K2, V, K2U, VU>;
  keyForm<K2, K2U = never>(keyForm?: Form<K2, K2U>): Form<K, KU> | MapDownlink<K2, V, K2U, VU> {
    if (keyForm === void 0) {
      return this._keyForm;
    } else {
      return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri,
                       this._prio, this._rate, this._body, this._flags, this._observers,
                       keyForm as any, this._valueForm, this._state0) as any;
    }
  }

  valueForm(): Form<V, VU>;
  valueForm<V2, V2U = never>(valueForm: Form<V2, V2U>): MapDownlink<K, V2, KU, V2U>;
  valueForm<V2, V2U = never>(valueForm?: Form<V2, V2U>): Form<V, VU> | MapDownlink<K, V2, KU, V2U> {
    if (valueForm === void 0) {
      return this._valueForm;
    } else {
      return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri,
                       this._prio, this._rate, this._body, this._flags, this._observers,
                       this._keyForm, valueForm as any, this._state0) as any;
    }
  }

  get size(): number {
    return this._model!.size;
  }

  isEmpty(): boolean {
    return this._model!.isEmpty();
  }

  has(key: K | KU): boolean {
    const keyObject = this._keyForm.mold(key);
    return this._model!.has(keyObject);
  }

  get(): MapDownlink<K, V, KU, VU>;
  get(key: K | KU): V;
  get(key?: K | KU): MapDownlink<K, V, KU, VU> | V {
    if (key === void 0) {
      return this;
    } else {
      const keyObject = this._keyForm.mold(key);
      const value = this._model!.get(keyObject);
      return value.coerce(this._valueForm);
    }
  }

  getEntry(index: number): [K, V] | undefined {
    const entry = this._model!.getEntry(index);
    if (entry !== void 0) {
      return [entry[0].coerce(this._keyForm), entry[1].coerce(this._valueForm)];
    }
    return void 0;
  }

  firstKey(): K | undefined {
    const key = this._model!._state.firstKey();
    if (key !== void 0) {
      const keyObject = this._keyForm.cast(key);
      if (keyObject !== void 0) {
        return keyObject;
      }
    }
    return this._keyForm.unit;
  }

  firstValue(): V | undefined {
    const value = this._model!._state.firstValue();
    if (value !== void 0) {
      const object = this._valueForm.cast(value);
      if (object !== void 0) {
        return object;
      }
    }
    return this._valueForm.unit;
  }

  firstEntry(): [K, V] | undefined {
    const entry = this._model!._state.firstEntry();
    if (entry !== void 0) {
      const keyObject: K = this._keyForm.cast(entry[0])!;
      const object: V = this._valueForm.cast(entry[1])!;
      return [keyObject, object];
    }
    return void 0;
  }

  lastKey(): K | undefined {
    const key = this._model!._state.lastKey();
    if (key !== void 0) {
      const keyObject = this._keyForm.cast(key);
      if (keyObject !== void 0) {
        return keyObject;
      }
    }
    return this._keyForm.unit;
  }

  lastValue(): V | undefined {
    const value = this._model!._state.lastValue();
    if (value !== void 0) {
      const object = this._valueForm.cast(value);
      if (object !== void 0) {
        return object;
      }
    }
    return this._valueForm.unit;
  }

  lastEntry(): [K, V] | undefined {
    const entry = this._model!._state.lastEntry();
    if (entry !== void 0) {
      const keyObject: K = this._keyForm.cast(entry[0])!;
      const object: V = this._valueForm.cast(entry[1])!;
      return [keyObject, object];
    }
    return void 0;
  }

  nextKey(keyObject: K): K | undefined {
    const key = this._keyForm.mold(keyObject);
    const nextKey = this._model!._state.nextKey(key);
    if (nextKey !== void 0) {
      const nextKeyObject = this._keyForm.cast(nextKey);
      if (nextKeyObject !== void 0) {
        return nextKeyObject;
      }
    }
    return this._keyForm.unit;
  }

  nextValue(keyObject: K): V | undefined {
    const key = this._keyForm.mold(keyObject);
    const nextValue = this._model!._state.nextValue(key);
    if (nextValue !== void 0) {
      const nextObject = this._valueForm.cast(nextValue);
      if (nextObject !== void 0) {
        return nextObject;
      }
    }
    return this._valueForm.unit;
  }

  nextEntry(keyObject: K): [K, V] | undefined {
    const key = this._keyForm.mold(keyObject);
    const entry = this._model!._state.nextEntry(key);
    if (entry !== void 0) {
      const keyObject: K = this._keyForm.cast(entry[0])!;
      const object: V = this._valueForm.cast(entry[1])!;
      return [keyObject, object];
    }
    return void 0;
  }

  previousKey(keyObject: K): K | undefined {
    const key = this._keyForm.mold(keyObject);
    const previousKey = this._model!._state.previousKey(key);
    if (previousKey !== void 0) {
      const previousKeyObject = this._keyForm.cast(previousKey);
      if (previousKeyObject !== void 0) {
        return previousKeyObject;
      }
    }
    return this._keyForm.unit;
  }

  previousValue(keyObject: K): V | undefined {
    const key = this._keyForm.mold(keyObject);
    const previousValue = this._model!._state.previousValue(key);
    if (previousValue !== void 0) {
      const previousObject = this._valueForm.cast(previousValue);
      if (previousObject !== void 0) {
        return previousObject;
      }
    }
    return this._valueForm.unit;
  }

  previousEntry(keyObject: K): [K, V] | undefined {
    const key = this._keyForm.mold(keyObject);
    const entry = this._model!._state.previousEntry(key);
    if (entry !== void 0) {
      const keyObject: K = this._keyForm.cast(entry[0])!;
      const object: V = this._valueForm.cast(entry[1])!;
      return [keyObject, object];
    }
    return void 0;
  }

  set(key: K | KU, newValue: V | VU): this {
    const keyObject = this._keyForm.mold(key);
    const newObject = this._valueForm.mold(newValue);
    this._model!.set(keyObject, newObject);
    return this;
  }

  delete(key: K | KU): boolean {
    const keyObject = this._keyForm.mold(key);
    return this._model!.delete(keyObject);
  }

  drop(lower: number): this {
    this._model!.drop(lower);
    return this;
  }

  take(upper: number): this {
    this._model!.take(upper);
    return this;
  }

  clear(): void {
    this._model!.clear();
  }

  forEach<T>(callback: (key: K, value: V) => T | void): T | undefined;
  forEach<T, S>(callback: (this: S, key: K, value: V) => T | void,
                thisArg: S): T | undefined;
  forEach<T, S>(callback: (this: S | undefined, key: K, value: V) => T | void,
                thisArg?: S): T | undefined {
    if (this._keyForm as any === Form.forValue() && this._valueForm as any === Form.forValue()) {
      return this._model!._state.forEach(callback as any, thisArg);
    } else {
      return this._model!._state.forEach(function (key: Value, value: Value): T | void {
        const keyObject = key.coerce(this._keyForm);
        const object = value.coerce(this._valueForm);
        return callback.call(thisArg, keyObject, object);
      }, this);
    }
  }

  keys(): Cursor<K> {
    const cursor = this._model!.keys();
    if (this._keyForm as any === Form.forValue()) {
      return cursor as any;
    } else {
      return new ValueCursor(cursor, this._keyForm);
    }
  }

  values(): Cursor<V> {
    const cursor = this._model!.values();
    if (this._valueForm as any === Form.forValue()) {
      return cursor as any;
    } else {
      return new ValueCursor(cursor, this._valueForm);
    }
  }

  entries(): Cursor<[K, V]> {
    const cursor = this._model!.entries();
    if (this._keyForm as any === Form.forValue() && this._valueForm as any === Form.forValue()) {
      return cursor as any;
    } else {
      return new ValueEntryCursor(cursor, this._keyForm, this._valueForm);
    }
  }

  snapshot(): BTree<Value, Value> {
    return this._model!.snapshot();
  }

  setState(state: BTree<Value, Value>): void {
    this._model!.setState(state);
  }

  observe(observer: MapDownlinkObserver<K, V, KU, VU>): this {
    return super.observe(observer);
  }

  willUpdate(willUpdate: MapDownlinkWillUpdate<K, V, KU, VU>): this {
    return this.observe({willUpdate});
  }

  didUpdate(didUpdate: MapDownlinkDidUpdate<K, V, KU, VU>): this {
    return this.observe({didUpdate});
  }

  willRemove(willRemove: MapDownlinkWillRemove<K, V, KU, VU>): this {
    return this.observe({willRemove});
  }

  didRemove(didRemove: MapDownlinkDidRemove<K, V, KU, VU>): this {
    return this.observe({didRemove});
  }

  willDrop(willDrop: MapDownlinkWillDrop<K, V, KU, VU>): this {
    return this.observe({willDrop});
  }

  didDrop(didDrop: MapDownlinkDidDrop<K, V, KU, VU>): this {
    return this.observe({didDrop});
  }

  willTake(willTake: MapDownlinkWillTake<K, V, KU, VU>): this {
    return this.observe({willTake});
  }

  didTake(didTake: MapDownlinkDidTake<K, V, KU, VU>): this {
    return this.observe({didTake});
  }

  willClear(willClear: MapDownlinkWillClear<K, V, KU, VU>): this {
    return this.observe({willClear});
  }

  didClear(didClear: MapDownlinkDidClear<K, V, KU, VU>): this {
    return this.observe({didClear});
  }

  /** @hidden */
  mapWillUpdate(key: Value, newValue: Value): Value {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    let keyObject: K | undefined;
    let newObject: V | undefined;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.willUpdate !== void 0) {
        if (keyObject === void 0) {
          keyObject = key.coerce(this._keyForm);
        }
        if (newObject === void 0) {
          newObject = newValue.coerce(this._valueForm);
        }
        const newResult = observer.willUpdate(keyObject, newObject, this);
        if (newResult !== void 0) {
          newObject = newResult;
          newValue = this._valueForm.mold(newObject);
        }
      }
    }
    return newValue;
  }

  /** @hidden */
  mapDidUpdate(key: Value, newValue: Value, oldValue: Value): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    const keyObject = key.coerce(this._keyForm);
    let newObject: V | undefined;
    let oldObject: V | undefined;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.didUpdate !== void 0) {
        if (newObject === void 0) {
          newObject = newValue.coerce(this._valueForm);
        }
        if (oldObject === void 0) {
          oldObject = oldValue.coerce(this._valueForm);
        }
        observer.didUpdate(keyObject, newObject, oldObject, this);
      }
    }
    this.decohereInputKey(keyObject, KeyEffect.Update);
    this.recohereInput(0); // TODO: debounce and track version
  }

  /** @hidden */
  mapWillRemove(key: Value): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    let keyObject: K | undefined;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.willRemove !== void 0) {
        if (keyObject === void 0) {
          keyObject = key.coerce(this._keyForm);
        }
        observer.willRemove(keyObject, this);
      }
    }
  }

  /** @hidden */
  mapDidRemove(key: Value, oldValue: Value): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    const keyObject = key.coerce(this._keyForm);
    let oldObject: V | undefined;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.didRemove !== void 0) {
        if (oldObject === void 0) {
          oldObject = oldValue.coerce(this._valueForm);
        }
        observer.didRemove(keyObject, oldObject, this);
      }
    }
    this.decohereInputKey(keyObject, KeyEffect.Remove);
    this.recohereInput(0); // TODO: debounce and track version
  }

  /** @hidden */
  mapWillDrop(lower: number): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.willDrop !== void 0) {
        observer.willDrop(lower, this);
      }
    }
  }

  /** @hidden */
  mapDidDrop(lower: number): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.didDrop !== void 0) {
        observer.didDrop(lower, this);
      }
    }
  }

  /** @hidden */
  mapWillTake(upper: number): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.willTake !== void 0) {
        observer.willTake(upper, this);
      }
    }
  }

  /** @hidden */
  mapDidTake(upper: number): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.didTake !== void 0) {
        observer.didTake(upper, this);
      }
    }
  }

  /** @hidden */
  mapWillClear(): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.willClear !== void 0) {
        observer.willClear(this);
      }
    }
  }

  /** @hidden */
  mapDidClear(): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.didClear !== void 0) {
        observer.didClear(this);
      }
    }
  }

  initialState(): BTree<Value, Value> | null;
  initialState(state0: BTree<Value, Value> | null): this;
  initialState(state0?: BTree<Value, Value> | null): BTree | null | this {
    if (state0 === void 0) {
      return this._state0 || null;
    } else {
      return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri,
                       this._prio, this._rate, this._body, this._flags, this._observers,
                       this._keyForm, this._valueForm, state0 || void 0);
    }
  }

  /** @hidden */
  protected didAliasModel(): void {
    this.onLinkedResponse();
    this._model!._state.forEach(function (key: Value, value: Value): void {
      this.mapDidUpdate(key, value, Value.absent());
    }, this);
    this.onSyncedResponse();
  }

  open(): this {
    const laneUri = this._laneUri;
    if (laneUri.isEmpty()) {
      throw new Error("no lane");
    }
    let nodeUri = this._nodeUri;
    if (nodeUri.isEmpty()) {
      throw new Error("no node");
    }
    let hostUri = this._hostUri;
    if (hostUri.isEmpty()) {
      hostUri = nodeUri.endpoint();
      nodeUri = hostUri.unresolve(nodeUri);
    }
    let model = this._context.getDownlink(hostUri, nodeUri, laneUri);
    if (model !== void 0) {
      if (!(model instanceof MapDownlinkModel)) {
        throw new Error("downlink type mismatch");
      }
      model.addDownlink(this);
      this._model = model as MapDownlinkModel;
      setTimeout(this.didAliasModel.bind(this));
    } else {
      model = new MapDownlinkModel(this._context, hostUri, nodeUri, laneUri, this._prio,
                                   this._rate, this._body, this._state0);
      model.addDownlink(this);
      this._context.openDownlink(model);
      this._model = model as MapDownlinkModel;
    }
    if (this._owner !== void 0) {
      this._owner.addDownlink(this);
    }
    return this;
  }

  keyIterator(): Cursor<K> {
    return this.keys();
  }

  declare readonly input: MapOutlet<K, V, Map<K, V>> | null;

  /** @hidden */
  declare readonly effects: BTree<K, KeyEffect>;

  /** @hidden */
  declare readonly outlets: BTree<K, KeyOutlet<K, V>>;

  /** @hidden */
  declare readonly outputs: ReadonlyArray<Inlet<MapDownlink<K, V, KU, VU>>>;

  /** @hidden */
  declare readonly version: number;

  bindInput(newInput: MapOutlet<K, V, Map<K, V>>): void {
    if (!MapOutlet.is(newInput)) {
      throw new TypeError("" + newInput);
    }
    const oldInput = this.input;
    if (oldInput !== newInput) {
      if (oldInput !== null) {
        oldInput.unbindOutput(this);
      }
      Object.defineProperty(this, "input", {
        value: newInput,
        enumerable: true,
        configurable: true,
      });
      if (newInput !== null) {
        newInput.bindOutput(this);
      }
    }
  }

  unbindInput(): void {
    const oldInput = this.input;
    if (oldInput !== null) {
      oldInput.unbindOutput(this);
      Object.defineProperty(this, "input", {
        value: null,
        enumerable: true,
        configurable: true,
      });
    }
  }

  disconnectInputs(): void {
    const oldInput = this.input;
    if (oldInput !== null) {
      oldInput.unbindOutput(this);
      Object.defineProperty(this, "input", {
        value: null,
        enumerable: true,
        configurable: true,
      });
      oldInput.disconnectInputs();
    }
  }

  outlet(key: K): Outlet<V> {
    const oldOutlets = this.outlets;
    let outlet = oldOutlets.get(key);
    if (outlet === void 0) {
      outlet = new KeyOutlet<K, V>(this, key);
      Object.defineProperty(this, "outlets", {
        value: oldOutlets.updated(key, outlet),
        enumerable: true,
        configurable: true,
      });
    }
    return outlet;
  }

  outputIterator(): Cursor<Inlet<MapDownlink<K, V, KU, VU>>> {
    return Cursor.array(this.outputs);
  }

  bindOutput(output: Inlet<MapDownlink<K, V, KU, VU>>): void {
    Object.defineProperty(this, "outputs", {
      value: Arrays.inserted(output, this.outputs),
      enumerable: true,
      configurable: true,
    });
  }

  unbindOutput(output: Inlet<MapDownlink<K, V, KU, VU>>): void {
    Object.defineProperty(this, "outputs", {
      value: Arrays.removed(output, this.outputs),
      enumerable: true,
      configurable: true,
    });
  }

  unbindOutputs(): void {
    const oldOutlets = this.outlets;
    if (oldOutlets.isEmpty()) {
      Object.defineProperty(this, "outlets", {
        value: new BTree(),
        enumerable: true,
        configurable: true,
      });
      oldOutlets.forEach(function (key: K, keyOutlet: KeyOutlet<K, V>) {
        keyOutlet.unbindOutputs();
      }, this);
    }
    const oldOutputs = this.outputs;
    Object.defineProperty(this, "outputs", {
      value: Arrays.empty,
      enumerable: true,
      configurable: true,
    });
    for (let i = 0, n = oldOutputs.length; i < n; i += 1) {
      const output = oldOutputs[i]!;
      output.unbindInput();
    }
  }

  disconnectOutputs(): void {
    const oldOutlets = this.outlets;
    if (oldOutlets.isEmpty()) {
      Object.defineProperty(this, "outlets", {
        value: new BTree(),
        enumerable: true,
        configurable: true,
      });
      oldOutlets.forEach(function (key: K, keyOutlet: KeyOutlet<K, V>) {
        keyOutlet.disconnectOutputs();
      }, this);
    }
    const oldOutputs = this.outputs;
    Object.defineProperty(this, "outputs", {
      value: Arrays.empty,
      enumerable: true,
      configurable: true,
    });
    for (let i = 0, n = oldOutputs.length; i < n; i += 1) {
      const output = oldOutputs[i]!;
      output.unbindInput();
      output.disconnectOutputs();
    }
  }

  decohereOutputKey(key: K, effect: KeyEffect): void {
    this.decohereKey(key, effect);
  }

  decohereInputKey(key: K, effect: KeyEffect): void {
    this.decohereKey(key, effect);
  }

  decohereKey(key: K, effect: KeyEffect): void {
    const oldEffects = this.effects;
    if (oldEffects.get(key) !== effect) {
      this.willDecohereKey(key, effect);
      Object.defineProperty(this, "effects", {
        value: oldEffects.updated(key, effect),
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(this, "version", {
        value: -1,
        enumerable: true,
        configurable: true,
      });
      this.onDecohereKey(key, effect);
      const outputs = this.outputs;
      for (let i = 0, n = outputs.length; i < n; i += 1) {
        const output = outputs[i]!;
        if (MapInlet.is(output)) {
          output.decohereOutputKey(key, effect);
        } else {
          output.decohereOutput();
        }
      }
      const outlet = this.outlets.get(key);
      if (outlet !== void 0) {
        outlet.decohereInput();
      }
      this.didDecohereKey(key, effect);
    }
  }

  decohereOutput(): void {
    this.decohere();
  }

  decohereInput(): void {
    this.decohere();
  }

  decohere(): void {
    if (this.version >= 0) {
      this.willDecohere();
      Object.defineProperty(this, "version", {
        value: -1,
        enumerable: true,
        configurable: true,
      });
      this.onDecohere();
      const outputs = this.outputs;
      for (let i = 0, n = outputs.length; i < n; i += 1) {
        const output = outputs[i]!;
        output.decohereOutput();
      }
      this.outlets.forEach(function (key: K, outlet: KeyOutlet<K, V>): void {
        outlet.decohereInput();
      }, this);
      this.didDecohere();
    }
  }

  recohereOutputKey(key: K, version: number): void {
    this.recohereKey(key, version);
  }

  recohereInputKey(key: K, version: number): void {
    this.recohereKey(key, version);
  }

  recohereKey(key: K, version: number): void {
    if (this.version < 0) {
      const oldEffects = this.effects;
      const effect = oldEffects.get(key);
      if (effect !== void 0) {
        this.willRecohereKey(key, effect, version);
        Object.defineProperty(this, "effects", {
          value: oldEffects.removed(key),
          enumerable: true,
          configurable: true,
        });
        if (this.input !== null) {
          this.input.recohereInputKey(key, version);
        }
        this.onRecohereKey(key, effect, version);
        const outputs = this.outputs;
        for (let i = 0, n = outputs.length; i < n; i += 1) {
          const output = outputs[i];
          if (MapInlet.is(output)) {
            output.recohereOutputKey(key, version);
          }
        }
        const outlet = this.outlets.get(key);
        if (outlet !== void 0) {
          outlet.recohereInput(version);
        }
        this.didRecohereKey(key, effect, version);
      }
    }
  }

  recohereOutput(version: number): void {
    this.recohere(version);
  }

  recohereInput(version: number): void {
    this.recohere(version);
  }

  recohere(version: number): void {
    if (this.version < 0) {
      this.willRecohere(version);
      this.effects.forEach(function (key: K): void {
        this.recohereKey(key, version);
      }, this);
      Object.defineProperty(this, "version", {
        value: version,
        enumerable: true,
        configurable: true,
      });
      this.onRecohere(version);
      const outputs = this.outputs;
      for (let i = 0, n = outputs.length; i < n; i += 1) {
        const output = outputs[i]!;
        output.recohereOutput(version);
      }
      this.didRecohere(version);
    }
  }

  protected willDecohereKey(key: K, effect: KeyEffect): void {
    // hook
  }

  protected onDecohereKey(key: K, effect: KeyEffect): void {
    // hook
  }

  protected didDecohereKey(key: K, effect: KeyEffect): void {
    // hook
  }

  protected willDecohere(): void {
    // hook
  }

  protected onDecohere(): void {
    // hook
  }

  protected didDecohere(): void {
    // hook
  }

  protected willRecohereKey(key: K, effect: KeyEffect, version: number): void {
    // hook
  }

  protected onRecohereKey(key: K, effect: KeyEffect, version: number): void {
    if (effect === KeyEffect.Update) {
      const input = this.input;
      if (input !== null) {
        const value = input.get(key);
        if (value !== void 0) {
          this.set(key, value);
        } else {
          this.delete(key);
        }
      }
    } else if (effect === KeyEffect.Remove) {
      this.delete(key);
    }
  }

  protected didRecohereKey(key: K, effect: KeyEffect, version: number): void {
    // hook
  }

  protected willRecohere(version: number): void {
    // hook
  }

  protected onRecohere(version: number): void {
    // hook
  }

  protected didRecohere(version: number): void {
    // hook
  }
}
export interface MapDownlink<K, V, KU, VU> extends MapOutletCombinators<K, V, MapDownlink<K, V, KU, VU>> {
}
MapOutletCombinators.define(MapDownlink.prototype);
