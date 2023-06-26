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
import {FromAny} from "@swim/util";
import {Affinity} from "./Affinity";
import type {FastenerContext} from "./FastenerContext";
import type {FastenerDescriptor} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";

/** @public */
export interface PropertyDescriptor<T = unknown, U = T> extends FastenerDescriptor {
  extends?: Proto<Property<any, any, any>> | boolean | null;
  valueType?: unknown;
  value?: T | U;
  updateFlags?: number;
}

/** @public */
export interface Property<O = unknown, T = unknown, U = T> extends Fastener<O> {
  (): T;
  (value: T | U, affinity?: Affinity): O;

  /** @override */
  get descriptorType(): Proto<PropertyDescriptor<T, U>>;

  /** @override */
  get fastenerType(): Proto<Property<any, any, any>>;

  /** @internal @override */
  setDerived(derived: boolean, inlet: Property<unknown, T>): void;

  /** @protected @override */
  willDerive(inlet: Property<unknown, T>): void;

  /** @protected @override */
  onDerive(inlet: Property<unknown, T>): void;

  /** @protected @override */
  didDerive(inlet: Property<unknown, T>): void;

  /** @protected @override */
  willUnderive(inlet: Property<unknown, T>): void;

  /** @protected @override */
  onUnderive(inlet: Property<unknown, T>): void;

  /** @protected @override */
  didUnderive(inlet: Property<unknown, T>): void;

  /** @override */
  get parent(): Property<unknown, T> | null;

  /** @override */
  readonly inlet: Property<unknown, T> | null;

  /** @override */
  bindInlet(inlet: Property<unknown, T, any>): void;

  /** @protected @override */
  willBindInlet(inlet: Property<unknown, T>): void;

  /** @protected @override */
  onBindInlet(inlet: Property<unknown, T>): void;

  /** @protected @override */
  didBindInlet(inlet: Property<unknown, T>): void;

  /** @protected @override */
  willUnbindInlet(inlet: Property<unknown, T>): void;

  /** @protected @override */
  onUnbindInlet(inlet: Property<unknown, T>): void;

  /** @protected @override */
  didUnbindInlet(inlet: Property<unknown, T>): void;

  /** @internal */
  readonly outlets: ReadonlySet<Property<unknown, T>> | null;

  /** @internal @override */
  attachOutlet(outlet: Property<unknown, T>): void;

  /** @internal @override */
  detachOutlet(outlet: Property<unknown, T>): void;

  getOutletValue(outlet: Property<unknown, T>): T;

  get inletValue(): T | undefined;

  getInletValue(): NonNullable<T>;

  getInletValueOr<E>(elseValue: E): NonNullable<T> | E;

  transformInletValue(inletValue: T): T;

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
  decohereOutlet(outlet: Property<unknown, T>): void;

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
export const Property = (function (_super: typeof Fastener) {
  const Property = _super.extend("Property", {}) as FastenerClass<Property<any, any, any>>;

  Object.defineProperty(Property.prototype, "fastenerType", {
    value: Property,
    enumerable: true,
    configurable: true,
  });

  Property.prototype.onDerive = function <T>(this: Property<unknown, T>, inlet: Property<unknown, T>): void {
    const inletValue = this.transformInletValue(inlet.getOutletValue(this));
    this.setValue(inletValue, Affinity.Reflexive);
  };

  Property.prototype.attachOutlet = function <T>(this: Property<unknown, T>, outlet: Property<unknown, T>): void {
    let outlets = this.outlets as Set<Property<unknown, T>> | null;
    if (outlets === null) {
      outlets = new Set<Property<unknown, T>>();
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.add(outlet);
  };

  Property.prototype.detachOutlet = function <T>(this: Property<unknown, T>, outlet: Property<unknown, T>): void {
    const outlets = this.outlets as Set<Property<unknown, T>> | null;
    if (outlets === null) {
      return;
    }
    outlets.delete(outlet);
  };

  Property.prototype.getOutletValue = function <T>(this: Property<unknown, T>, outlet: Property<unknown, T>): T {
    return this.value;
  };

  Object.defineProperty(Property.prototype, "inletValue", {
    get: function <T>(this: Property<unknown, T>): T | undefined {
      const inlet = this.inlet;
      return inlet !== null ? inlet.getOutletValue(this) : void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Property.prototype.getInletValue = function <T>(this: Property<unknown, T>): NonNullable<T> {
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
    return inletValue as NonNullable<T>;
  };

  Property.prototype.getInletValueOr = function <T, E>(this: Property<unknown, T>, elseValue: E): NonNullable<T> | E {
    let inletValue: T | E | undefined = this.inletValue;
    if (inletValue === void 0 || inletValue === null) {
      inletValue = elseValue;
    }
    return inletValue as NonNullable<T> | E;
  };

  Property.prototype.transformInletValue = function <T>(this: Property<unknown, T>, inletValue: T): T {
    return inletValue;
  };

  Property.prototype.initValue = function <T>(this: Property<unknown, T>): T {
    return (Object.getPrototypeOf(this) as Property<unknown, T>).value;
  };

  Property.prototype.getValue = function <T>(this: Property<unknown, T>): NonNullable<T> {
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
    return value as NonNullable<T>;
  };

  Property.prototype.getValueOr = function <T, E>(this: Property<unknown, T>, elseValue: E): NonNullable<T> | E {
    let value: T | E = this.value;
    if (value === void 0 || value === null) {
      value = elseValue;
    }
    return value as NonNullable<T> | E;
  };

  Property.prototype.transformValue = function <T>(this: Property<unknown, T>, value: T): T {
    return value;
  };

  Property.prototype.setValue = function <T, U>(this: Property<unknown, T, U>, newValue: T | U, affinity?: Affinity): void {
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
  };

  Property.prototype.willSetValue = function <T>(this: Property<unknown, T>, newValue: T, oldValue: T): void {
    // hook
  };

  Property.prototype.onSetValue = function <T>(this: Property<unknown, T>, newValue: T, oldValue: T): void {
    const updateFlags = this.updateFlags;
    const owner = this.owner;
    if (updateFlags === void 0 || owner === null || typeof owner !== "object" && typeof owner !== "function"
        || !("requireUpdate" in owner)) {
      return;
    }
    (owner as FastenerContext).requireUpdate!(updateFlags);
  };

  Property.prototype.didSetValue = function <T>(this: Property<unknown, T>, newValue: T, oldValue: T): void {
    // hook
  };

  Property.prototype.decohereOutlets = function (this: Property): void {
    const outlets = this.outlets;
    if (outlets === null) {
      return;
    }
    for (const outlet of outlets) {
      this.decohereOutlet(outlet);
    }
  };

  Property.prototype.decohereOutlet = function (this: Property, outlet: Property): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  Property.prototype.recohere = function (this: Property, t: number): void {
    let inlet: Property | null;
    if ((this.flags & Fastener.DerivedFlag) === 0 || (inlet = this.inlet) === null) {
      return;
    }
    const inletValue = this.transformInletValue(inlet.getOutletValue(this));
    this.setValue(inletValue, Affinity.Reflexive);
  };

  Property.prototype.definedValue = function <T>(this: Property<unknown, T>, value: T): boolean {
    return value !== void 0 && value !== null;
  };

  Property.prototype.equalValues = function <T>(this: Property<unknown, T>, newValue: T, oldValue: T | undefined): boolean {
    return Equals(newValue, oldValue);
  };

  Property.prototype.fromAny = function <T, U>(this: Property<unknown, T, U>, value: T | U): T {
    return FromAny.fromAny<T, U>(this.valueType, value);
  };

  Property.construct = function <P extends Property<any, any, any>>(property: P | null, owner: P extends Property<infer O, any, any> ? O : never): P {
    if (property === null) {
      property = function (value?: P extends Property<any, infer T, infer U> ? T | U : never, affinity?: Affinity): P extends Property<infer O, infer T, any> ? T | O : never {
        if (arguments.length === 0) {
          return property!.value;
        } else {
          property!.setValue(value!, affinity);
          return property!.owner;
        }
      } as P;
      delete (property as Partial<Mutable<P>>).name; // don't clobber prototype name
      Object.setPrototypeOf(property, this.prototype);
    }
    property = _super.construct.call(this, property, owner) as P;
    (property as Mutable<typeof property>).outlets = null;
    (property as Mutable<typeof property>).value = property.initValue();
    return property;
  };

  Property.refine = function (propertyClass: FastenerClass<any>): void {
    _super.refine.call(this, propertyClass);
    const propertyProtortype = propertyClass.prototype;

    if (Object.prototype.hasOwnProperty.call(propertyProtortype, "value")) {
      Object.defineProperty(propertyProtortype, "value", {
        value: propertyProtortype.fromAny(propertyProtortype.value),
        enumerable: true,
        configurable: true,
      });
    }
  };

  return Property;
})(Fastener);
