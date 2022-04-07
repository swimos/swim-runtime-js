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

import type {Mutable, Proto} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import type {AnyValue, Value, Form} from "@swim/structure";
import type {ValueDownlinkObserver, ValueDownlink} from "../downlink/ValueDownlink";
import type {WarpRef} from "../ref/WarpRef";
import {
  DownlinkFastenerRefinement,
  DownlinkFastenerTemplate,
  DownlinkFastenerClass,
  DownlinkFastener,
} from "./DownlinkFastener";

/** @public */
export interface ValueDownlinkFastenerRefinement extends DownlinkFastenerRefinement {
  value?: unknown;
  valueInit?: unknown;
}

/** @public */
export type ValueDownlinkFastenerValue<R extends ValueDownlinkFastenerRefinement | ValueDownlinkFastener<any, any, any>, D = Value> =
  R extends {value: infer V} ? V :
  R extends {extends: infer E} ? ValueDownlinkFastenerValue<E, D> :
  R extends ValueDownlinkFastener<any, infer V, any> ? V :
  D;

/** @public */
export type ValueDownlinkFastenerValueInit<R extends ValueDownlinkFastenerRefinement | ValueDownlinkFastener<any, any, any>, D = ValueDownlinkFastenerValue<R, AnyValue>> =
  R extends {valueInit: infer VU} ? VU :
  R extends {extends: infer E} ? ValueDownlinkFastenerValueInit<E, D> :
  R extends ValueDownlinkFastener<any, any, infer VU> ? VU :
  D;

/** @public */
export interface ValueDownlinkFastenerTemplate<V = unknown, VU = V> extends DownlinkFastenerTemplate {
  extends?: Proto<ValueDownlinkFastener<any, any, any>> | string | boolean | null;
  valueForm?: Form<V, VU>;
}

/** @public */
export interface ValueDownlinkFastenerClass<F extends ValueDownlinkFastener<any, any> = ValueDownlinkFastener<any, any>> extends DownlinkFastenerClass<F> {
  /** @override */
  specialize(className: string, template: ValueDownlinkFastenerTemplate): ValueDownlinkFastenerClass;

  /** @override */
  refine(fastenerClass: ValueDownlinkFastenerClass): void;

  /** @override */
  extend(className: string, template: ValueDownlinkFastenerTemplate): ValueDownlinkFastenerClass<F>;

  /** @override */
  specify<O, V = Value, VU = V extends Value ? AnyValue : V>(className: string, template: ThisType<ValueDownlinkFastener<O, V, VU>> & ValueDownlinkFastenerTemplate<V, VU> & Partial<Omit<ValueDownlinkFastener<O, V, VU>, keyof ValueDownlinkFastenerTemplate>>): ValueDownlinkFastenerClass<F>;

  /** @override */
  <O, V = Value, VU = V extends Value ? AnyValue : V>(template: ThisType<ValueDownlinkFastener<O, V, VU>> & ValueDownlinkFastenerTemplate<V, VU> & Partial<Omit<ValueDownlinkFastener<O, V, VU>, keyof ValueDownlinkFastenerTemplate>>): PropertyDecorator;
}

/** @public */
export type ValueDownlinkFastenerDef<O, R extends ValueDownlinkFastenerRefinement> =
  ValueDownlinkFastener<O, ValueDownlinkFastenerValue<R>,
                           ValueDownlinkFastenerValueInit<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function ValueDownlinkFastenerDef<F extends ValueDownlinkFastener<any, any, any>>(
  template: F extends ValueDownlinkFastenerDef<infer O, infer R>
          ? ThisType<ValueDownlinkFastenerDef<O, R>>
          & ValueDownlinkFastenerTemplate<ValueDownlinkFastenerValue<R>, ValueDownlinkFastenerValueInit<R>>
          & Partial<Omit<ValueDownlinkFastener<O, ValueDownlinkFastenerValue<R>, ValueDownlinkFastenerValueInit<R>>, keyof ValueDownlinkFastenerTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ValueDownlinkFastenerTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return ValueDownlinkFastener(template);
}

/** @public */
export interface ValueDownlinkFastener<O = unknown, V = unknown, VU = V> extends DownlinkFastener<O>, ValueDownlinkObserver<V, VU> {
  (): V | undefined;
  (value: V | VU): O;

  /** @protected */
  initValueForm(): Form<V, VU> | null;

  readonly valueForm: Form<V, VU> | null;

  setValueForm(valueForm: Form<V, VU> | null): void;

  get(): V | undefined;

  set(value: V | VU): void;

  /** @override */
  readonly downlink: ValueDownlink<V, VU> | null;

  /** @internal @override */
  createDownlink(warp: WarpRef): ValueDownlink<V, VU>;

  /** @override */
  initDownlink?(downlink: ValueDownlink<V, VU>): ValueDownlink<V, VU>;

  /** @internal @override */
  bindDownlink(downlink: ValueDownlink<V, VU>): ValueDownlink<V, VU>;
}

/** @public */
export const ValueDownlinkFastener = (function (_super: typeof DownlinkFastener) {
  const ValueDownlinkFastener = _super.extend("ValueDownlinkFastener", {}) as ValueDownlinkFastenerClass;

  ValueDownlinkFastener.prototype.initValueForm = function <V, VU>(this: ValueDownlinkFastener<unknown, V, VU>): Form<V, VU> | null {
    let valueForm = (Object.getPrototypeOf(this) as ValueDownlinkFastener<unknown, V, VU>).valueForm as Form<V, VU> | null | undefined;
    if (valueForm === void 0) {
      valueForm = null;
    }
    return valueForm;
  };

  ValueDownlinkFastener.prototype.setValueForm = function <V, VU>(this: ValueDownlinkFastener<unknown, V, VU>, valueForm: Form<V, VU> | null): void {
    if (this.valueForm !== valueForm) {
      (this as Mutable<typeof this>).valueForm = valueForm;
      this.relink();
    }
  };

  ValueDownlinkFastener.prototype.get = function <V>(this: ValueDownlinkFastener<unknown, V>): V | undefined {
    const downlink = this.downlink;
    return downlink !== null ? downlink.get() : void 0;
  };

  ValueDownlinkFastener.prototype.set = function <V, VU>(this: ValueDownlinkFastener<unknown, V, VU>, value: V | VU): void {
    const downlink = this.downlink;
    if (downlink !== null) {
      downlink.set(value);
    }
  };

  ValueDownlinkFastener.prototype.createDownlink = function <V, VU>(this: ValueDownlinkFastener<unknown, V, VU>, warp: WarpRef): ValueDownlink<V, VU> {
    let downlink = warp.downlinkValue() as unknown as ValueDownlink<V, VU>;
    if (this.valueForm !== null) {
      downlink = downlink.valueForm(this.valueForm);
    }
    return downlink;
  };

  ValueDownlinkFastener.construct = function <F extends ValueDownlinkFastener<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (value?: ValueDownlinkFastenerValue<F> | ValueDownlinkFastenerValueInit<F>): ValueDownlinkFastenerValue<F> | undefined | FastenerOwner<F> {
        if (arguments.length === 0) {
          return fastener!.get();
        } else {
          fastener!.set(value!);
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

  return ValueDownlinkFastener;
})(DownlinkFastener);
