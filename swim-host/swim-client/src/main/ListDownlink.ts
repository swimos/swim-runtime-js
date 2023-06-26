// Copyright 2015-2023 Swim.inc
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

import type {Mutable} from "@swim/util";
import type {Class} from "@swim/util";
import type {Proto} from "@swim/util";
import type {Cursor} from "@swim/util";
import type {FastenerClass} from "@swim/component";
import type {STree} from "@swim/collections";
import type {AnyValue} from "@swim/structure";
import {Value} from "@swim/structure";
import {Form} from "@swim/structure";
import {ValueCursor} from "@swim/structure";
import {ValueEntryCursor} from "@swim/structure";
import {WarpDownlinkContext} from "./WarpDownlinkContext";
import type {WarpDownlinkDescriptor} from "./WarpDownlink";
import type {WarpDownlinkObserver} from "./WarpDownlink";
import {WarpDownlink} from "./WarpDownlink";
import {ListDownlinkModel} from "./ListDownlinkModel";

/** @public */
export interface ListDownlinkDescriptor<V = unknown, VU = V> extends WarpDownlinkDescriptor {
  extends?: Proto<ListDownlink<any, any, any>> | boolean | null;
  valueForm?: Form<V, VU>;
  /** @internal */
  stateInit?: STree<Value, Value> | null;
}

/** @public */
export interface ListDownlinkObserver<V = unknown, F extends ListDownlink<any, V, any> = ListDownlink<unknown, V>> extends WarpDownlinkObserver<F> {
  willUpdate?(index: number, newValue: V, downlink: F): V | void;

  didUpdate?(index: number, newValue: V, oldValue: V, downlink: F): void;

  willMove?(fromIndex: number, toIndex: number, value: V, downlink: F): void;

  didMove?(fromIndex: number, toIndex: number, value: V, downlink: F): void;

  willRemove?(index: number, downlink: F): void;

  didRemove?(index: number, oldValue: V, downlink: F): void;

  willDrop?(lower: number, downlink: F): void;

  didDrop?(lower: number, downlink: F): void;

  willTake?(upper: number, downlink: F): void;

  didTake?(upper: number, downlink: F): void;

  willClear?(downlink: F): void;

  didClear?(downlink: F): void;
}

/** @public */
export interface ListDownlink<O = unknown, V = Value, VU = V extends Value ? AnyValue & V : V> extends WarpDownlink<O> {
  (index: number): V | undefined;
  (index: number, newObject: V | VU): O;

  /** @override */
  get descriptorType(): Proto<ListDownlinkDescriptor<V, VU>>;

  /** @override */
  readonly observerType?: Class<ListDownlinkObserver<V>>;

  /** @internal @override */
  readonly model: ListDownlinkModel | null;

  /** @protected */
  initValueForm(): Form<V, VU>;

  readonly valueForm: Form<V, VU>;

  setValueForm(valueForm: Form<V, VU>): this;

  /** @internal */
  readonly stateInit?: STree<Value, Value> | null; // optional prototype property

  /** @internal */
  initState(): STree<Value, Value> | null;

  /** @internal */
  setState(state: STree<Value, Value>): void;

  get size(): number;

  isEmpty(): boolean;

  get(index: number, id?: Value): V;

  getEntry(index: number, id?: Value): [V, Value] | undefined;

  set(index: number, newObject: V | VU, id?: Value): this;

  insert(index: number, newObject: V | VU, id?: Value): this;

  remove(index: number, id?: Value): this;

  push(...newObjects: (V | VU)[]): number;

  pop(): V;

  unshift(...newObjects: (V | VU)[]): number;

  shift(): V;

  move(fromIndex: number, toIndex: number, id?: Value): this;

  splice(start: number, deleteCount?: number, ...newObjects: (V | VU)[]): V[];

  clear(): void;

  forEach<T, S>(callback: (value: V, index: number, id: Value) => T | void): T | undefined;
  forEach<T, S>(callback: (this: S, value: V, index: number, id: Value) => T | void,
                thisArg: S): T | undefined;

  values(): Cursor<V>;

  keys(): Cursor<Value>;

  entries(): Cursor<[Value, V]>;

  snapshot(): STree<Value, Value>;

  /** @protected */
  willUpdate?(index: number, newValue: V): V | void;

  /** @protected */
  didUpdate?(index: number, newValue: V, oldValue: V): void;

  /** @protected */
  willMove?(fromIndex: number, toIndex: number, value: V): void;

  /** @protected */
  didMove?(fromIndex: number, toIndex: number, value: V): void;

  /** @protected */
  willRemove?(index: number): void;

  /** @protected */
  didRemove?(index: number, oldValue: V): void;

  /** @protected */
  willDrop?(lower: number): void;

  /** @protected */
  didDrop?(lower: number): void;

  /** @protected */
  willTake?(upper: number): void;

  /** @protected */
  didTake?(upper: number): void;

  /** @protected */
  willClear?(): void;

  /** @protected */
  didClear?(): void;

  /** @internal */
  listWillUpdate(index: number, newValue: Value): Value;

  /** @internal */
  listDidUpdate(index: number, newValue: Value, oldValue: Value): void;

  /** @internal */
  listWillMove(fromIndex: number, toIndex: number, value: Value): void;

  /** @internal */
  listDidMove(fromIndex: number, toIndex: number, value: Value): void;

  /** @internal */
  listWillRemove(index: number): void;

  /** @internal */
  listDidRemove(index: number, oldValue: Value): void;

  /** @internal */
  listWillDrop(lower: number): void;

  /** @internal */
  listDidDrop(lower: number): void;

  /** @internal */
  listWillTake(upper: number): void;

  /** @internal */
  listDidTake(upper: number): void;

  /** @internal */
  listWillClear(): void;

  /** @internal */
  listDidClear(): void;

  /** @internal */
  didAliasModel(): void;

  /** @override */
  open(): this;
}

/** @public */
export const ListDownlink = (function (_super: typeof WarpDownlink) {
  const ListDownlink = _super.extend("ListDownlink", {
    relinks: true,
    syncs: true,
  }) as FastenerClass<ListDownlink<any, any, any>>;

  ListDownlink.prototype.initValueForm = function <V, VU>(this: ListDownlink<unknown, V, VU>): Form<V, VU> {
    let valueForm = (Object.getPrototypeOf(this) as ListDownlink<unknown, V, VU>).valueForm as Form<V, VU> | undefined;
    if (valueForm === void 0) {
      valueForm = Form.forValue() as unknown as Form<V, VU>;
    }
    return valueForm;
  };

  ListDownlink.prototype.setValueForm = function <V, VU>(this: ListDownlink<unknown, V, VU>, valueForm: Form<V, VU>): ListDownlink<unknown, V, VU> {
    if (this.valueForm !== valueForm) {
      (this as Mutable<typeof this>).valueForm = valueForm;
      this.relink();
    }
    return this;
  };

  ListDownlink.prototype.initState = function (this: ListDownlink): STree<Value, Value> | null {
    let state = this.stateInit;
    if (state === void 0) {
      state = null;
    }
    return state;
  };

  ListDownlink.prototype.setState = function (this: ListDownlink, state: STree<Value, Value>): void {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    model.setState(state);
  };

  Object.defineProperty(ListDownlink.prototype, "size", {
    get(this: ListDownlink): number {
      const model = this.model;
      return model !== null ? model.size : 0;
    },
    configurable: true,
  });

  ListDownlink.prototype.isEmpty = function (this: ListDownlink): boolean {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    return model.isEmpty();
  };

  ListDownlink.prototype.get = function <V>(this: ListDownlink<unknown, V>, index: number, id?: Value): V {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const value = model.get(index, id);
    return value.coerce(this.valueForm);
  };

  ListDownlink.prototype.getEntry = function <V>(this: ListDownlink<unknown, V>, index: number, id?: Value): [V, Value] | undefined {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const entry = model.getEntry(index, id);
    if (entry === void 0) {
      return void 0;
    }
    return [entry[0].coerce(this.valueForm), entry[1]];
  };

  ListDownlink.prototype.set = function <V, VU>(this: ListDownlink<unknown, V, VU>, index: number, newObject: V | VU, id?: Value): ListDownlink<unknown, V, VU> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const newValue = this.valueForm.mold(newObject);
    model.set(index, newValue, id);
    return this;
  };

  ListDownlink.prototype.insert = function <V, VU>(this: ListDownlink<unknown, V, VU>, index: number, newObject: V | VU, id?: Value): ListDownlink<unknown, V, VU> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const newValue = this.valueForm.mold(newObject);
    model.insert(index, newValue, id);
    return this;
  };

  ListDownlink.prototype.remove = function <V>(this: ListDownlink<unknown, V>, index: number, id?: Value): ListDownlink<unknown, V> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    model.remove(index, id);
    return this;
  };

  ListDownlink.prototype.push = function <V, VU>(this: ListDownlink<unknown, V, VU>, ...newObjects: (V | VU)[]): number {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const valueForm = this.valueForm;
    const newValues = new Array(newObjects.length);
    for (let i = 0; i < newObjects.length; i += 1) {
      newValues[i] = valueForm.mold(newObjects[i]!);
    }
    return model.push(...newValues);
  };

  ListDownlink.prototype.pop = function <V>(this: ListDownlink<unknown, V>): V {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const value = model.pop();
    return value.coerce(this.valueForm);
  };

  ListDownlink.prototype.unshift = function <V, VU>(this: ListDownlink<unknown, V, VU>, ...newObjects: (V | VU)[]): number {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const valueForm = this.valueForm;
    const newValues = new Array(newObjects.length);
    for (let i = 0; i < newObjects.length; i += 1) {
      newValues[i] = valueForm.mold(newObjects[i]!);
    }
    return model.unshift(...newValues);
  };

  ListDownlink.prototype.shift = function <V>(this: ListDownlink<unknown, V>): V {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const value = model.shift();
    return value.coerce(this.valueForm);
  };

  ListDownlink.prototype.move = function <V>(this: ListDownlink<unknown, V>, fromIndex: number, toIndex: number, id?: Value): ListDownlink<unknown, V> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    model.move(fromIndex, toIndex, id);
    return this;
  };

  ListDownlink.prototype.splice = function <V, VU>(this: ListDownlink<unknown, V, VU>, start: number, deleteCount?: number, ...newObjects: (V | VU)[]): V[] {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const valueForm = this.valueForm;
    const newValues = new Array(newObjects.length);
    for (let i = 0; i < newObjects.length; i += 1) {
      newValues[i] = valueForm.mold(newObjects[i]!);
    }
    const oldValues = this.model!.splice(start, deleteCount, ...newValues);
    const oldObjects = new Array(oldValues.length);
    for (let i = 0; i < oldValues.length; i += 1) {
      oldObjects[i] = oldValues[i]!.coerce(valueForm);
    }
    return oldObjects;
  };

  ListDownlink.prototype.clear = function (this: ListDownlink): void {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    model.clear();
  };

  ListDownlink.prototype.forEach = function <V, T, S>(this: ListDownlink<unknown, V>,
                                                      callback: (this: S | undefined, value: V, index: number, id: Value) => T | void,
                                                      thisArg?: S): T | undefined {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const valueForm = this.valueForm;
    if (valueForm as unknown === Form.forValue()) {
      return model.state.forEach(callback as any, thisArg);
    }
    return model.state.forEach(function (value: Value, index: number, id: Value): T | void {
      const object = value.coerce(valueForm);
      return callback.call(thisArg, object, index, id);
    }, this);
  };

  ListDownlink.prototype.values = function <V>(this: ListDownlink<unknown, V>): Cursor<V> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const cursor = model.values();
    const valueForm = this.valueForm;
    if (valueForm as unknown === Form.forValue()) {
      return cursor as unknown as Cursor<V>;
    }
    return new ValueCursor(cursor, valueForm);
  };

  ListDownlink.prototype.keys = function <V>(this: ListDownlink<unknown, V>): Cursor<Value> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    return model.keys();
  };

  ListDownlink.prototype.entries = function <V>(this: ListDownlink<unknown, V>): Cursor<[Value, V]> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    const cursor = model.entries();
    if (this.valueForm as unknown === Form.forValue()) {
      return cursor as unknown as Cursor<[Value, V]>;
    }
    return new ValueEntryCursor(cursor, Form.forValue(), this.valueForm);
  };

  ListDownlink.prototype.snapshot = function <V>(this: ListDownlink<unknown, V>): STree<Value, Value> {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    return model.snapshot();
  };

  ListDownlink.prototype.listWillUpdate = function <V>(this: ListDownlink<unknown, V>, index: number, newValue: Value): Value {
    let newObject: V | undefined;
    const valueForm = this.valueForm;

    if (this.willUpdate !== void 0) {
      newObject = newValue.coerce(valueForm);
      const newResult = this.willUpdate(index, newObject);
      if (newResult !== void 0) {
        newObject = newResult;
        newValue = valueForm.mold(newObject);
      }
    }

    const observers = this.observers;
    if (observers !== null && observers.size !== 0) {
      if (newObject === void 0) {
        newObject = newValue.coerce(valueForm);
      }
      for (const observer of observers) {
        if (observer.willUpdate === void 0) {
          continue;
        }
        const newResult = observer.willUpdate(index, newObject, this);
        if (newResult !== void 0) {
          newObject = newResult;
          newValue = valueForm.mold(newObject);
        }
      }
    }

    return newValue;
  };

  ListDownlink.prototype.listDidUpdate = function <V>(this: ListDownlink<unknown, V>, index: number, newValue: Value, oldValue: Value): void {
    let newObject: V | undefined;
    let oldObject: V | undefined;
    const valueForm = this.valueForm;

    if (this.didUpdate !== void 0) {
      newObject = newValue.coerce(valueForm);
      oldObject = oldValue.coerce(valueForm);
      this.didUpdate(index, newObject, oldObject);
    }

    const observers = this.observers;
    if (observers !== null && observers.size !== 0) {
      if (newObject === void 0) {
        newObject = newValue.coerce(valueForm);
      }
      if (oldObject === void 0) {
        oldObject = oldValue.coerce(valueForm);
      }
      for (const observer of observers) {
        if (observer.didUpdate === void 0) {
          continue;
        }
        observer.didUpdate(index, newObject, oldObject, this);
      }
    }
  };

  ListDownlink.prototype.listWillMove = function <V>(this: ListDownlink<unknown, V>, fromIndex: number, toIndex: number, value: Value): void {
    let object: V | undefined;
    const valueForm = this.valueForm;

    if (this.willMove !== void 0) {
      object = value.coerce(valueForm);
      this.willMove(fromIndex, toIndex, object);
    }

    const observers = this.observers;
    if (observers !== null && observers.size !== 0) {
      if (object === void 0) {
        object = value.coerce(valueForm);
      }
      for (const observer of observers) {
        if (observer.willMove === void 0) {
          continue;
        }
        observer.willMove(fromIndex, toIndex, object, this);
      }
    }
  };

  ListDownlink.prototype.listDidMove = function <V>(this: ListDownlink<unknown, V>, fromIndex: number, toIndex: number, value: Value): void {
    let object: V | undefined;
    const valueForm = this.valueForm;

    if (this.didMove !== void 0) {
      object = value.coerce(valueForm);
      this.didMove(fromIndex, toIndex, object);
    }

    const observers = this.observers;
    if (observers !== null && observers.size !== 0) {
      if (object === void 0) {
        object = value.coerce(valueForm);
      }
      for (const observer of observers) {
        if (observer.didMove === void 0) {
          continue;
        }
        observer.didMove(fromIndex, toIndex, object, this);
      }
    }
  };

  ListDownlink.prototype.listWillRemove = function <V>(this: ListDownlink<unknown, V>, index: number): void {
    if (this.willRemove !== void 0) {
      this.willRemove(index);
    }
    this.callObservers("willRemove", index, this);
  };

  ListDownlink.prototype.listDidRemove = function <V>(this: ListDownlink<unknown, V>, index: number, oldValue: Value): void {
    let oldObject: V | undefined;
    const valueForm = this.valueForm;

    if (this.didRemove !== void 0) {
      oldObject = oldValue.coerce(valueForm);
      this.didRemove(index, oldObject);
    }

    const observers = this.observers;
    if (observers !== null && observers.size !== 0) {
      if (oldObject === void 0) {
        oldObject = oldValue.coerce(valueForm);
      }
      for (const observer of observers) {
        if (observer.didRemove === void 0) {
          continue;
        }
        observer.didRemove(index, oldObject, this);
      }
    }
  };

  ListDownlink.prototype.listWillDrop = function (this: ListDownlink, lower: number): void {
    if (this.willDrop !== void 0) {
      this.willDrop(lower);
    }
    this.callObservers("willDrop", lower, this);
  };

  ListDownlink.prototype.listDidDrop = function (this: ListDownlink, lower: number): void {
    if (this.didDrop !== void 0) {
      this.didDrop(lower);
    }
    this.callObservers("didDrop", lower, this);
  };

  ListDownlink.prototype.listWillTake = function (this: ListDownlink, upper: number): void {
    if (this.willTake !== void 0) {
      this.willTake(upper);
    }
    this.callObservers("willTake", upper, this);
  };

  ListDownlink.prototype.listDidTake = function (this: ListDownlink, upper: number): void {
    if (this.didTake !== void 0) {
      this.didTake(upper);
    }
    this.callObservers("didTake", upper, this);
  };

  ListDownlink.prototype.listWillClear = function (this: ListDownlink): void {
    if (this.willClear !== void 0) {
      this.willClear();
    }
    this.callObservers("willClear", this);
  };

  ListDownlink.prototype.listDidClear = function (this: ListDownlink): void {
    if (this.didClear !== void 0) {
      this.didClear();
    }
    this.callObservers("didClear", this);
  };

  ListDownlink.prototype.didAliasModel = function (this: ListDownlink): void {
    const model = this.model;
    if (model === null || !model.linked) {
      return;
    }
    this.onLinkedResponse();
    model.state.forEach(function (value: Value, index: number) {
      this.listDidUpdate(index, value, Value.absent());
    }, this);
    if (model.synced) {
      this.onSyncedResponse();
    }
  };

  ListDownlink.prototype.open = function (this: ListDownlink): ListDownlink {
    if (this.model !== null) {
      return this;
    }
    const laneUri = this.getLaneUri();
    if (laneUri === null) {
      throw new Error("no laneUri");
    }
    let nodeUri = this.getNodeUri();
    if (nodeUri === null) {
      throw new Error("no nodeUri");
    }
    let hostUri = this.getHostUri();
    if (hostUri === null) {
      hostUri = nodeUri.endpoint();
      nodeUri = hostUri.unresolve(nodeUri);
    }
    let prio = this.getPrio();
    if (prio === void 0) {
      prio = 0;
    }
    let rate = this.getRate();
    if (rate === void 0) {
      rate = 0;
    }
    let body = this.getBody();
    if (body === null) {
      body = Value.absent();
    }
    const owner = this.owner;
    if (!WarpDownlinkContext.is(owner)) {
      throw new Error("no downlink context");
    }
    let model = owner.getDownlink(hostUri, nodeUri, laneUri);
    if (model !== null) {
      if (!(model instanceof ListDownlinkModel)) {
        throw new Error("downlink type mismatch");
      }
      model.addDownlink(this);
      (this as Mutable<typeof this>).model = model as ListDownlinkModel;
      setTimeout(this.didAliasModel.bind(this));
    } else {
      const state = this.initState();
      model = new ListDownlinkModel(hostUri, nodeUri, laneUri, prio, rate, body, state);
      model.addDownlink(this);
      owner.openDownlink(model);
      (this as Mutable<typeof this>).model = model as ListDownlinkModel;
    }
    return this;
  };

  ListDownlink.construct = function <F extends ListDownlink<any, any, any>>(downlink: F | null, owner: F extends ListDownlink<infer O, any, any> ? O : never): F {
    if (downlink === null) {
      downlink = function (index: number, value?: F extends ListDownlink<any, infer V, infer U> ? V | U : never): F extends ListDownlink<infer O, infer V, any> ? V | O | undefined : never {
        if (arguments.length === 0) {
          return downlink!.get(index);
        } else {
          downlink!.set(index, value!);
          return downlink!.owner;
        }
      } as F;
      delete (downlink as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(downlink, this.prototype);
    }
    downlink = _super.construct.call(this, downlink, owner) as F;
    (downlink as Mutable<typeof downlink>).valueForm = downlink.initValueForm();
    return downlink;
  };

  return ListDownlink;
})(WarpDownlink);
