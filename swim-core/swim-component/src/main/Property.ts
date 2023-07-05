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
import {FromAny} from "@swim/util";
import {Affinity} from "./Affinity";
import {FastenerContext} from "./FastenerContext";
import type {FastenerDescriptor} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";

/** @public */
export interface PropertyDescriptor<T, U> extends FastenerDescriptor {
  extends?: Proto<Property> | boolean | null;
  valueType?: unknown;
  value?: T | U;
  updateFlags?: number;
}

/** @public */
export interface PropertyClass<P extends Property = Property> extends FastenerClass<P> {
  tryValue<O, K extends keyof O, F extends O[K] = O[K]>(owner: O, fastenerName: K): F extends Property<any, infer T, any, any> ? T : undefined;

  tryValueOr<O, K extends keyof O, E, F extends O[K] = O[K]>(owner: O, fastenerName: K, elseValue: E): F extends Property<any, infer T, any, any> ? NonNullable<T> | E : E;
}

/** @public */
export interface Property<O = any, T = any, U = T, I = T> extends Fastener<O> {
  (): T;
  (value: T | U, affinity?: Affinity): O;

  /** @override */
  get descriptorType(): Proto<PropertyDescriptor<T, U>>;

  /** @override */
  get fastenerType(): Proto<Property>;

  /** @internal @override */
  setDerived(derived: boolean, inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  willDerive(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  onDerive(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  didDerive(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  willUnderive(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  onUnderive(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  didUnderive(inlet: Property<any, I, any, any>): void;

  /** @override */
  get parent(): Property<any, I, any, any> | null;

  /** @override */
  readonly inlet: Property<any, I, any, any> | null;

  /** @override */
  bindInlet<I2 extends I>(inlet: Property<any, I2, any, any>): void;

  /** @protected @override */
  willBindInlet(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  onBindInlet(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  didBindInlet(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  willUnbindInlet(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  onUnbindInlet(inlet: Property<any, I, any, any>): void;

  /** @protected @override */
  didUnbindInlet(inlet: Property<any, I, any, any>): void;

  get inletValue(): I | undefined;

  getInletValue(): NonNullable<I>;

  getInletValueOr<E>(elseValue: E): NonNullable<I> | E;

  transformInletValue(inletValue: I): T;

  /** @internal */
  readonly outlets: ReadonlySet<Property<any, any, any, T>> | null;

  /** @internal @override */
  attachOutlet(outlet: Property<any, any, any, T>): void;

  /** @internal @override */
  detachOutlet(outlet: Property<any, any, any, T>): void;

  getOutletValue(outlet: Property<any, any, any, T>): T;

  /** @internal */
  readonly valueType?: unknown; // optional prototype property

  /** @internal */
  readonly valueInit?: U; // for type destructuring

  initValue(): T;

  readonly value: T;

  getValue(): NonNullable<T>;

  getValueOr<E>(elseValue: E): NonNullable<T> | E;

  transformValue(value: T): T;

  setValue(newValue: T | U, affinity?: Affinity): void;

  /** @protected */
  willSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  onSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  didSetValue(newValue: T, oldValue: T): void;

  /** @internal */
  readonly updateFlags?: number; // optional prototype property

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: Property<any, T, any, any>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal */
  definedValue(value: T): boolean;

  /** @internal */
  equalValues(newValue: T, oldValue: T | undefined): boolean;

  /** @internal */
  fromAny(value: T | U): T;
}

/** @public */
export const Property = (<O, T, U, I, P extends Property>() => Fastener.extend<Property<O, T, U, I>, PropertyClass<P>>("Property", {
  get fastenerType(): Proto<Property> {
    return Property;
  },

  onDerive(inlet: Property<any, I, any, any>): void {
    const inletValue = this.transformInletValue(inlet.getOutletValue(this));
    this.setValue(inletValue, Affinity.Reflexive);
  },

  get inletValue(): I | undefined {
    const inlet = this.inlet;
    return inlet !== null ? inlet.getOutletValue(this) : void 0;
  },

  getInletValue(): NonNullable<I> {
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

  getInletValueOr<E>(elseValue: E): NonNullable<I> | E {
    let inletValue: I | E | undefined = this.inletValue;
    if (inletValue === void 0 || inletValue === null) {
      inletValue = elseValue;
    }
    return inletValue as NonNullable<I> | E;
  },

  transformInletValue(inletValue: I): T {
    return inletValue as unknown as T;
  },

  attachOutlet(outlet: Property<any, any, any, T>): void {
    let outlets = this.outlets as Set<Property<any, any, any, T>> | null;
    if (outlets === null) {
      outlets = new Set<Property<any, any, any, T>>();
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.add(outlet);
  },

  detachOutlet(outlet: Property<any, any, any, T>): void {
    const outlets = this.outlets as Set<Property<any, any, any, T>> | null;
    if (outlets === null) {
      return;
    }
    outlets.delete(outlet);
  },

  getOutletValue(outlet: Property<any, any, any, T>): T {
    return this.value;
  },

  initValue(): T {
    return (Object.getPrototypeOf(this) as Property<unknown, T>).value;
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
    let value: T | E = this.value;
    if (value === void 0 || value === null) {
      value = elseValue;
    }
    return value as NonNullable<T> | E;
  },

  transformValue(value: T): T {
    return value;
  },

  setValue(newValue: T | U, affinity?: Affinity): void {
    if (affinity === void 0) {
      affinity = Affinity.Extrinsic;
    }
    if (!this.minAffinity(affinity)) {
      return;
    }
    newValue = this.fromAny(newValue);
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
    const owner = this.owner;
    if (updateFlags !== void 0 && Objects.hasAllKeys<FastenerContext>(owner, "requireUpdate")) {
      owner.requireUpdate!(updateFlags);
    }
  },

  didSetValue(newValue: T, oldValue: T): void {
    // hook
  },

  decohereOutlets(): void {
    const outlets = this.outlets;
    if (outlets === null) {
      return;
    }
    for (const outlet of outlets) {
      this.decohereOutlet(outlet);
    }
  },

  decohereOutlet(outlet: Property<any, T, any, any>): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  },

  recohere(t: number): void {
    let inlet: Property<any, I, any, any> | null;
    if ((this.flags & Fastener.DerivedFlag) === 0 || (inlet = this.inlet) === null) {
      return;
    }
    const inletValue = this.transformInletValue(inlet.getOutletValue(this));
    this.setValue(inletValue, Affinity.Reflexive);
  },

  definedValue(value: T): boolean {
    return value !== void 0 && value !== null;
  },

  equalValues(newValue: T, oldValue: T | undefined): boolean {
    return Equals(newValue, oldValue);
  },

  fromAny(value: T | U): T {
    return FromAny<T, U>(this.valueType, value);
  },
},
{
  tryValue<O, K extends keyof O, F extends O[K]>(owner: O, fastenerName: K): F extends Property<any, infer T, any, any> ? T : undefined {
    const property = FastenerContext.tryFastener(owner, fastenerName) as Property | null;
    if (property !== null) {
      return property.value as any;
    }
    const propertyClass = FastenerContext.getFastenerClass(owner, fastenerName) as PropertyClass | null;
    if (propertyClass !== null) {
      return propertyClass.prototype.value as any;
    }
    return void 0 as any;
  },

  tryValueOr<O, K extends keyof O, E, F extends O[K] = O[K]>(owner: O, fastenerName: K, elseValue: E): F extends Property<any, infer T, any, any> ? NonNullable<T> | E : E {
    let value: (F extends Property<any, infer T, any, any> ? T : undefined) | E = this.tryValue(owner, fastenerName);
    if (value === void 0 || value === null) {
      value = elseValue;
    }
    return value as F extends Property<any, infer T, any, any> ? NonNullable<T> | E : E;
  },

  construct(property: P | null, owner: P extends Fastener<infer O> ? O : never): P {
    if (property === null) {
      property = function (value?: P extends Property<any, infer T, infer U, any> ? T | U : never, affinity?: Affinity): P extends Property<infer O, infer T, any> ? T | O : never {
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

  refine(propertyClass: FastenerClass<any>): void {
    super.refine(propertyClass);
    const propertyProtortype = propertyClass.prototype;

    if (Object.prototype.hasOwnProperty.call(propertyProtortype, "value")) {
      Object.defineProperty(propertyProtortype, "value", {
        value: propertyProtortype.fromAny(propertyProtortype.value),
        enumerable: true,
        configurable: true,
      });
    }
  },
}))();
