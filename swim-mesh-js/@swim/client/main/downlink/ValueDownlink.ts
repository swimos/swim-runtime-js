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

import {Arrays, Cursor} from "@swim/util";
import {Value, Form} from "@swim/structure";
import {Inlet, Outlet, OutletCombinators} from "@swim/streamlet";
import type {Uri} from "@swim/uri";
import type {DownlinkContext} from "./DownlinkContext";
import type {DownlinkOwner} from "./DownlinkOwner";
import {DownlinkType, DownlinkObserver, DownlinkInit, DownlinkFlags, Downlink} from "./Downlink";
import {ValueDownlinkModel} from "./ValueDownlinkModel";

export type ValueDownlinkWillSet<V, VU = never> = (newValue: V, downlink: ValueDownlink<V, VU>) => V | void;
export type VaueDownlinkDidSet<V, VU = never> = (newValue: V, oldValue: V, downlink: ValueDownlink<V, VU>) => void;

export interface ValueDownlinkObserver<V, VU = never> extends DownlinkObserver {
  willSet?: ValueDownlinkWillSet<V, VU>;
  didSet?: VaueDownlinkDidSet<V, VU>;
}

export interface ValueDownlinkInit<V, VU = never> extends ValueDownlinkObserver<V, VU>, DownlinkInit {
  valueForm?: Form<V, VU>;
}

export class ValueDownlink<V, VU = never> extends Downlink implements Inlet<V>, Outlet<V> {
  /** @hidden */
  declare _observers: ReadonlyArray<ValueDownlinkObserver<V, VU>> | null;
  /** @hidden */
  declare _model: ValueDownlinkModel | null;
  /** @hidden */
  _valueForm: Form<V, VU>;
  /** @hidden */
  _state0: Value;

  /** @hidden */
  constructor(context: DownlinkContext, owner?: DownlinkOwner, init?: ValueDownlinkInit<V, VU>,
              hostUri?: Uri, nodeUri?: Uri, laneUri?: Uri, prio?: number, rate?: number,
              body?: Value, flags: number = DownlinkFlags.KeepLinkedSynced,
              observers?: ReadonlyArray<ValueDownlinkObserver<V, VU>> | ValueDownlinkObserver<V, VU> | null,
              valueForm?: Form<V, VU>, state0: Value = Value.absent()) {
    super(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers);
    if (init !== void 0) {
      const observer = this._observers![this._observers!.length - 1]!;
      observer.willSet = init.willSet || observer.willSet;
      observer.didSet = init.didSet || observer.didSet;
      valueForm = init.valueForm !== void 0 ? init.valueForm : valueForm;
    }
    this._valueForm = valueForm !== void 0 ? valueForm : Form.forValue() as any;
    this._state0 = state0;
    Object.defineProperty(this, "input", {
      value: null,
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
                 body: Value, flags: number, observers: ReadonlyArray<ValueDownlinkObserver<V, VU>> | null,
                 valueForm?: Form<V, VU>, state0?: Value): this {
    if (arguments.length === 10) {
      state0 = this._state0;
      valueForm = this._valueForm;
    }
    return new ValueDownlink(context, owner, void 0, hostUri, nodeUri, laneUri,
                             prio, rate, body, flags, observers, valueForm, state0) as this;
  }

  type(): DownlinkType {
    return "value";
  }

  valueForm(): Form<V, VU>;
  valueForm<V2, V2U = never>(valueForm: Form<V2, V2U>): ValueDownlink<V2, V2U>;
  valueForm<V2, V2U = never>(valueForm?: Form<V2, V2U>): Form<V, VU> | ValueDownlink<V2, V2U> {
    if (valueForm === void 0) {
      return this._valueForm;
    } else {
      return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri,
                       this._prio, this._rate, this._body, this._flags, this._observers,
                       valueForm as any, this._state0) as any;
    }
  }

  get(): V {
    const value = this._model!.get();
    const object = value.coerce(this._valueForm);
    return object;
  }

  set(newObject: V | VU): void {
    const newValue = this._valueForm.mold(newObject);
    this._model!.set(newValue);
  }

  setState(state: Value): void {
    this._model!.setState(state);
  }

  observe(observer: ValueDownlinkObserver<V, VU>): this {
    return super.observe(observer);
  }

  willSet(willSet: ValueDownlinkWillSet<V, VU>): this {
    return this.observe({willSet});
  }

  didSet(didSet: VaueDownlinkDidSet<V, VU>): this {
    return this.observe({didSet});
  }

  /** @hidden */
  valueWillSet(newValue: Value): Value {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    let newObject: V | undefined;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.willSet !== void 0) {
        if (newObject === void 0) {
          newObject = newValue.coerce(this._valueForm);
        }
        const newResult = observer.willSet(newObject, this);
        if (newResult !== void 0) {
          newObject = newResult;
          newValue = this._valueForm.mold(newObject);
        }
      }
    }
    return newValue;
  }

  /** @hidden */
  valueDidSet(newValue: Value, oldValue: Value): void {
    const observers = this._observers;
    const n = observers !== null ? observers.length : 0;
    let newObject: V | undefined;
    let oldObject: V | undefined;
    for (let i = 0; i < n; i += 1) {
      const observer = observers![i]!;
      if (observer.didSet !== void 0) {
        if (newObject === void 0) {
          newObject = newValue.coerce(this._valueForm);
        }
        if (oldObject === void 0) {
          oldObject = oldValue.coerce(this._valueForm);
        }
        observer.didSet(newObject, oldObject, this);
      }
    }
    this.decohere();
    this.recohere(0); // TODO: debounce update; track version
  }

  initialState(): Value;
  initialState(state0: Value): this;
  initialState(state0?: Value): Value | this {
    if (state0 === void 0) {
      return this._state0;
    } else {
      return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri,
                       this._prio, this._rate, this._body, this._flags, this._observers,
                       this._valueForm, state0);
    }
  }

  /** @hidden */
  protected didAliasModel(): void {
    this.onLinkedResponse();
    this.valueDidSet(this._model!.get(), Value.absent());
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
      if (!(model instanceof ValueDownlinkModel)) {
        throw new Error("downlink type mismatch");
      }
      model.addDownlink(this);
      this._model = model as ValueDownlinkModel;
      setTimeout(this.didAliasModel.bind(this));
    } else {
      model = new ValueDownlinkModel(this._context, hostUri, nodeUri, laneUri, this._prio,
                                     this._rate, this._body, this._state0);
      model.addDownlink(this);
      this._context.openDownlink(model);
      this._model = model as ValueDownlinkModel;
    }
    if (this._owner !== void 0) {
      this._owner.addDownlink(this);
    }
    return this;
  }

  declare readonly input: Outlet<V> | null;

  /** @hidden */
  declare readonly outputs: ReadonlyArray<Inlet<V>>;

  /** @hidden */
  declare readonly version: number;

  bindInput(newInput: Outlet<V> | null): void {
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

  outputIterator(): Cursor<Inlet<V>> {
    return Cursor.array(this.outputs);
  }

  bindOutput(output: Inlet<V>): void {
    Object.defineProperty(this, "outputs", {
      value: Arrays.inserted(output, this.outputs),
      enumerable: true,
      configurable: true,
    });
  }

  unbindOutput(output: Inlet<V>): void {
    Object.defineProperty(this, "outputs", {
      value: Arrays.removed(output, this.outputs),
      enumerable: true,
      configurable: true,
    });
  }

  unbindOutputs(): void {
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
        outputs[i]!.decohereOutput();
      }
      this.didDecohere();
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
      Object.defineProperty(this, "version", {
        value: version,
        enumerable: true,
        configurable: true,
      });
      if (this.input !== null) {
        this.input.recohereInput(version);
      }
      this.onRecohere(version);
      const outputs = this.outputs;
      for (let i = 0, n = outputs.length; i < n; i += 1) {
        outputs[i]!.recohereOutput(version);
      }
      this.didRecohere(version);
    }
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

  protected willRecohere(version: number): void {
    // hook
  }

  protected onRecohere(version: number): void {
    const input = this.input;
    if (input !== null) {
      const value = input.get();
      if (value !== void 0) {
        this.set(value);
      }
    }
  }

  protected didRecohere(version: number): void {
    // hook
  }
}
export interface ValueDownlink<V, VU> extends OutletCombinators<V> {
}
OutletCombinators.define(ValueDownlink.prototype);
