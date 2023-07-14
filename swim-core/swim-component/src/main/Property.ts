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
import type {Proto} from "@swim/util";
import {Equals} from "@swim/util";
import {Objects} from "@swim/util";
import type {LikeType} from "@swim/util";
import {FromLike} from "@swim/util";
import {Affinity} from "./Affinity";
import {FastenerContext} from "./FastenerContext";
import type {FastenerDescriptor} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";

/** @public */
export interface PropertyDescriptor<R, T> extends FastenerDescriptor<R> {
  extends?: Proto<Property<any, any, any>> | boolean | null;
  valueType?: unknown;
  value?: T | LikeType<T>;
  updateFlags?: number;
}

/** @public */
export interface PropertyClass<P extends Property<any, any, any> = Property<any, any, any>> extends FastenerClass<P> {
  tryValue<R, K extends keyof R, F extends R[K] = R[K]>(owner: R, fastenerName: K): F extends {readonly value: infer T} ? T : undefined;

  tryValueOr<R, K extends keyof R, E, F extends R[K] = R[K]>(owner: R, fastenerName: K, elseValue: E): F extends {readonly value: infer T} ? NonNullable<T> | E : E;
}

/** @public */
export interface Property<R = any, T = any, I extends any[] = [T]> extends Fastener<R, T, I> {
  (): T;
  (value: T | LikeType<T>, affinity?: Affinity): R;

  /** @override */
  get descriptorType(): Proto<PropertyDescriptor<R, T>>;

  /** @override */
  get fastenerType(): Proto<Property<any, any, any>>;

  /** @override */
  get parent(): Property<any, I[0], any> | null;

  get inletValue(): I[0] | undefined;

  getInletValue(): NonNullable<I[0]>;

  getInletValueOr<E>(elseValue: E): NonNullable<I[0]> | E;

  /** @internal */
  readonly outlets: ReadonlySet<Fastener<any, any, any>> | null;

  /** @internal @override */
  attachOutlet(outlet: Fastener<any, any, any>): void;

  /** @internal @override */
  detachOutlet(outlet: Fastener<any, any, any>): void;

  /** @internal @protected */
  decohereOutlets(): void;

  getOutletValue(outlet: Fastener<any, any, any>): T;

  deriveValue(...inletValues: I): T;

  get valueType(): unknown | undefined;

  initValue(): T;

  readonly value: T;

  getValue(): NonNullable<T>;

  getValueOr<E>(elseValue: E): NonNullable<T> | E;

  transformValue(value: T): T;

  setValue(newValue: T | LikeType<T>, affinity?: Affinity): void;

  /** @protected */
  willSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  onSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  didSetValue(newValue: T, oldValue: T): void;

  get updateFlags(): number | undefined;

  /** @override */
  recohere(t: number): void;

  definedValue(value: T): boolean;

  equalValues(newValue: T, oldValue: T | undefined): boolean;

  fromLike(value: T | LikeType<T>): T;
}

/** @public */
export const Property = (<R, T, I extends any[], P extends Property<any, any, any>>() => Fastener.extend<Property<R, T, I>, PropertyClass<P>>("Property", {
  get fastenerType(): Proto<Property<any, any, any>> {
    return Property;
  },

  get inletValue(): I[0] | undefined {
    const inlet = this.inlet;
    return inlet instanceof Property ? inlet.getOutletValue(this) : void 0;
  },

  getInletValue(): NonNullable<I[0]> {
    const inletValue = this.inletValue;
    if (inletValue === void 0 || inletValue === null) {
      let message = inletValue + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "inlet value";
      throw new TypeError(message);
    }
    return inletValue;
  },

  getInletValueOr<E>(elseValue: E): NonNullable<I[0]> | E {
    const inletValue: I[0] | E | undefined = this.inletValue;
    if (inletValue === void 0 || inletValue === null) {
      return elseValue;
    }
    return inletValue;
  },

  attachOutlet(outlet: Property<any, any, any>): void {
    let outlets = this.outlets as Set<Property<any, any, any>> | null;
    if (outlets === null) {
      outlets = new Set<Property<any, any, any>>();
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.add(outlet);
  },

  detachOutlet(outlet: Property<any, any, any>): void {
    const outlets = this.outlets as Set<Property<any, any, any>> | null;
    if (outlets !== null) {
      outlets.delete(outlet);
    }
  },

  decohereOutlets(): void {
    const outlets = this.outlets;
    if (outlets !== null) {
      for (const outlet of outlets) {
        outlet.decohere(this);
      }
    }
  },

  getOutletValue(outlet: Property<any, any, any>): T {
    return this.value;
  },

  deriveValue(...inletValues: any[]): T {
    return inletValues[0] as T;
  },

  valueType: void 0,

  initValue(): T {
    return (Object.getPrototypeOf(this) as Property<any, T, any>).value;
  },

  getValue(): NonNullable<T> {
    const value = this.value;
    if (value === void 0 || value === null) {
      let message = value + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "value";
      throw new TypeError(message);
    }
    return value;
  },

  getValueOr<E>(elseValue: E): NonNullable<T> | E {
    const value: T | E = this.value;
    if (value === void 0 || value === null) {
      return elseValue;
    }
    return value;
  },

  transformValue(value: T): T {
    return value;
  },

  setValue(newValue: T | LikeType<T>, affinity?: Affinity): void {
    if (affinity === void 0) {
      affinity = Affinity.Extrinsic;
    }
    if (!this.minAffinity(affinity)) {
      return;
    }
    newValue = this.fromLike(newValue);
    newValue = this.transformValue(newValue);
    const oldValue = this.value;
    if (this.equalValues(newValue, oldValue)) {
      this.setCoherent(true);
      return;
    }
    this.willSetValue(newValue, oldValue);
    (this as Mutable<typeof this>).value = newValue;
    this.onSetValue(newValue, oldValue);
    this.didSetValue(newValue, oldValue);
    this.setCoherent(true);
    this.decohereOutlets();
  },

  willSetValue(newValue: T, oldValue: T): void {
    // hook
  },

  onSetValue(newValue: T, oldValue: T): void {
    const updateFlags = this.updateFlags;
    if (updateFlags !== void 0 && Objects.hasAllKeys<FastenerContext>(this.owner, "requireUpdate")) {
      this.owner.requireUpdate!(updateFlags);
    }
  },

  didSetValue(newValue: T, oldValue: T): void {
    // hook
  },

  updateFlags: void 0,

  recohere(t: number): void {
    this.setCoherentTime(t);
    const inlets = this.inlet;
    if (inlets instanceof Property) {
      this.setDerived((this.flags & Affinity.Mask) <= Math.min(inlets.flags & Affinity.Mask, Affinity.Intrinsic));
      if ((this.flags & Fastener.DerivedFlag) !== 0) {
        const derivedValue = (this as unknown as Property<R, T, [unknown]>).deriveValue(inlets.getOutletValue(this));
        this.setValue(derivedValue, Affinity.Reflexive);
      }
    } else if (Array.isArray(inlets)) {
      this.setDerived(true);
      const inletValues = new Array<unknown>(inlets.length);
      for (let i = 0; i < inlets.length; i += 1) {
        const inlet = inlets[i] as Fastener;
        if (inlet instanceof Property) {
          inletValues[i] = inlet.getOutletValue(this);
        } else {
          this.setDerived(false);
          return;
        }
      }
      const derivedValue = this.deriveValue(...(inletValues as I));
      this.setValue(derivedValue, Affinity.Reflexive);
    } else {
      this.setDerived(false);
    }
  },

  definedValue(value: T): boolean {
    return value !== void 0 && value !== null;
  },

  equalValues(newValue: T, oldValue: T | undefined): boolean {
    return Equals(newValue, oldValue);
  },

  fromLike(value: T | LikeType<T>): T {
    return FromLike(this.valueType, value);
  },
},
{
  tryValue<R, K extends keyof R, F extends R[K]>(owner: R, fastenerName: K): F extends {readonly value: infer T} ? T : undefined {
    const property = FastenerContext.tryFastener(owner, fastenerName) as Property<any, any, any> | null;
    if (property !== null) {
      return property.value as any;
    }
    const propertyClass = FastenerContext.getFastenerClass(owner, fastenerName) as PropertyClass | null;
    if (propertyClass !== null) {
      return propertyClass.prototype.value as any;
    }
    return void 0 as any;
  },

  tryValueOr<R, K extends keyof R, E, F extends R[K] = R[K]>(owner: R, fastenerName: K, elseValue: E): F extends {readonly value: infer T} ? NonNullable<T> | E : E {
    let value: (F extends {readonly value: infer T} ? T : undefined) | E = this.tryValue(owner, fastenerName);
    if (value === void 0 || value === null) {
      value = elseValue;
    }
    return value as F extends {readonly value: infer T} ? NonNullable<T> | E : E;
  },

  construct(property: P | null, owner: P extends Fastener<infer R, any, any> ? R : never): P {
    if (property === null) {
      property = function (value?: P extends Property<any, infer T, any> ? T | LikeType<T> : never, affinity?: Affinity): P extends Property<infer R, infer T, any> ? T | R : never {
        if (arguments.length === 0) {
          return property!.value;
        } else {
          property!.setValue(value!, affinity);
          return property!.owner;
        }
      } as P;
      Object.defineProperty(property, "name", {
        value: this.prototype.name,
        enumerable: true,
        configurable: true,
      });
      Object.setPrototypeOf(property, this.prototype);
    }
    property = super.construct(property, owner) as P;
    (property as Mutable<typeof property>).outlets = null;
    (property as Mutable<typeof property>).value = property.initValue();
    return property;
  },

  refine(propertyClass: FastenerClass<Property<any, any, any>>): void {
    super.refine(propertyClass);
    const propertyPrototype = propertyClass.prototype;

    const valueDescriptor = Object.getOwnPropertyDescriptor(propertyPrototype, "value");
    if (valueDescriptor !== void 0 && "value" in valueDescriptor) {
      valueDescriptor.value = propertyPrototype.fromLike(valueDescriptor.value);
      Object.defineProperty(propertyPrototype, "value", valueDescriptor);
    }
  },
}))();
