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
import {Identifiers} from "@swim/util";
import {Objects} from "@swim/util";
import {Affinity} from "./Affinity";
import {FastenerContext} from "./FastenerContext";

/** @public */
export type FastenerFlags = number;

/** @public */
export interface FastenerDescriptor {
  name?: PropertyKey;
  extends?: Proto<Fastener> | boolean | null;
  /** @internal */
  flagsInit?: number;
  affinity?: Affinity;
  inherits?: PropertyKey | boolean;
  parentType?: Proto<any> | null | undefined;
  binds?: boolean;
}

/** @public */
export interface FastenerDecorator<F extends Fastener> {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value?: F) => F;
  <T>(target: (this: T) => F, context: ClassGetterDecoratorContext<T, F>): (this: T) => F;
}

/** @public */
export interface FastenerClass<F extends Fastener = Fastener> {
  /** @internal */
  prototype: F;

  create(owner: F extends Fastener<infer O> ? O : never): F;

  /** @protected */
  construct(fastener: F | null, owner: F extends Fastener<infer O> ? O : never): F;

  /** @internal */
  declare<F2 extends F, C extends FastenerClass<any> = FastenerClass<F2>>(className: PropertyKey): C;

  /** @internal */
  implement<F2 extends F, C extends FastenerClass<any> = FastenerClass<F2>>(fastenerClass: C, template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never, classTemplate?: ThisType<C> & Partial<C>): void;

  specialize(template: F extends {readonly descriptorType?: Proto<infer D>} ? D : never): FastenerClass<F>;

  refine(fastenerClass: FastenerClass<any>): void;

  extend<F2 extends F, C extends FastenerClass<any> = FastenerClass<F2>>(className: PropertyKey, template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never, classTemplate?: ThisType<C> & Partial<C>): C;

  define<F2 extends F>(className: PropertyKey, template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never, extendsClass?: FastenerClass<F>): FastenerClass<F2>;

  dummy<F2 extends F>(): F2;

  <F2 extends F>(template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never): FastenerDecorator<F2>;

  /** @internal */
  readonly MountedFlag: FastenerFlags;
  /** @internal */
  readonly InheritsFlag: FastenerFlags;
  /** @internal */
  readonly DerivedFlag: FastenerFlags;
  /** @internal */
  readonly DecoherentFlag: FastenerFlags;

  /** @internal */
  readonly FlagShift: number;
  /** @internal */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface Fastener<O = any> {
  get descriptorType(): Proto<FastenerDescriptor>;

  get fastenerType(): Proto<Fastener>;

  readonly owner: O;

  readonly name: PropertyKey;

  /** @internal */
  readonly binds?: boolean; // optional prototype property

  /** @protected */
  init(): void;

  /** @internal */
  readonly flagsInit?: FastenerFlags; // optional prototype property

  /** @internal */
  readonly flags: FastenerFlags;

  /** @internal */
  setFlags(flags: FastenerFlags): void;

  get affinity(): Affinity;

  hasAffinity(affinity: Affinity): boolean;

  /** @internal */
  initAffinity(affinity: Affinity): void;

  /** @internal */
  minAffinity(affinity: Affinity): boolean;

  setAffinity(affinity: Affinity): void;

  /** @protected */
  willSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void;

  /** @protected */
  onSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void;

  /** @protected */
  didSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void;

  get parentType(): Proto<unknown> | null | undefined;

  get inheritName(): PropertyKey | undefined;

  get inherits(): boolean;

  /** @internal */
  initInherits(inherits: PropertyKey | boolean): void;

  setInherits(inherits: PropertyKey | boolean): void;

  /** @protected */
  willSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void;

  /** @protected */
  onSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void;

  /** @protected */
  didSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void;

  get derived(): boolean;

  /** @internal */
  setDerived(derived: boolean, inlet: Fastener): void;

  /** @protected */
  willDerive(inlet: Fastener): void;

  /** @protected */
  onDerive(inlet: Fastener): void;

  /** @protected */
  didDerive(inlet: Fastener): void;

  /** @protected */
  willUnderive(inlet: Fastener): void;

  /** @protected */
  onUnderive(inlet: Fastener): void;

  /** @protected */
  didUnderive(inlet: Fastener): void;

  get parent(): Fastener | null;

  readonly inlet: Fastener | null;

  /** @internal */
  inheritInlet(): void;

  bindInlet(inlet: Fastener): void;

  /** @protected */
  willBindInlet(inlet: Fastener): void;

  /** @protected */
  onBindInlet(inlet: Fastener): void;

  /** @protected */
  didBindInlet(inlet: Fastener): void;

  /** @internal */
  uninheritInlet(): void;

  unbindInlet(inlet?: Fastener): void;

  /** @protected */
  willUnbindInlet(inlet: Fastener): void;

  /** @protected */
  onUnbindInlet(inlet: Fastener): void;

  /** @protected */
  didUnbindInlet(inlet: Fastener): void;

  /** @internal */
  attachOutlet(outlet: Fastener): void;

  /** @internal */
  detachOutlet(outlet: Fastener): void;

  get coherent(): boolean;

  /** @internal */
  setCoherent(coherent: boolean): void;

  /** @internal */
  decohere(): void;

  /** @internal */
  recohere(t: number): void;

  get mounted(): boolean;

  /** @internal */
  mount(): void;

  /** @protected */
  willMount(): void;

  /** @protected */
  onMount(): void;

  /** @protected */
  didMount(): void;

  /** @internal */
  unmount(): void;

  /** @protected */
  willUnmount(): void;

  /** @protected */
  onUnmount(): void;

  /** @protected */
  didUnmount(): void;

  /** @override */
  toString(): string;
}

/** @public */
export const Fastener = (<O, F extends Fastener>() => (function (template: ThisType<Fastener<O>> & FastenerDescriptor & Partial<Omit<Fastener, keyof FastenerDescriptor>>, classTemplate: ThisType<FastenerClass<F>> & Partial<FastenerClass<F>>): FastenerClass<F> {
  const Fastener = function (template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never): FastenerDecorator<F> {
    return FastenerContext.fastenerDecorator(Fastener, template);
  } as FastenerClass<F>;
  Object.setPrototypeOf(template, Object.prototype);
  Fastener.prototype = template as F;
  Fastener.prototype.constructor = Fastener;
  Object.setPrototypeOf(classTemplate, Fastener.prototype);
  Object.setPrototypeOf(Fastener, classTemplate);
  return Fastener;
})({
  get fastenerType(): Proto<Fastener> {
    return Fastener;
  },

  get name(): string {
    return "Fastener";
  },

  init(): void {
    // hook
  },

  setFlags(flags: FastenerFlags): void {
    (this as Mutable<typeof this>).flags = flags;
  },

  get affinity(): Affinity {
    return (this.flags & Affinity.Mask) as Affinity;
  },

  hasAffinity(affinity: Affinity): boolean {
    return affinity >= (this.flags & Affinity.Mask);
  },

  initAffinity(affinity: Affinity): void {
    (this as Mutable<typeof this>).flags = this.flags & ~Affinity.Mask | affinity & Affinity.Mask;
  },

  minAffinity(newAffinity: Affinity): boolean {
    const oldAffinity = (this.flags & Affinity.Mask) as Affinity;
    if (newAffinity === Affinity.Reflexive) {
      newAffinity = oldAffinity;
    } else if ((newAffinity & ~Affinity.Mask) !== 0) {
      throw new Error("invalid affinity: " + newAffinity);
    }
    if (newAffinity > oldAffinity) {
      this.willSetAffinity(newAffinity, oldAffinity);
      this.setFlags(this.flags & ~Affinity.Mask | newAffinity);
      this.onSetAffinity(newAffinity, oldAffinity);
      this.didSetAffinity(newAffinity, oldAffinity);
    }
    return newAffinity >= oldAffinity;
  },

  setAffinity(newAffinity: Affinity): void {
    if ((newAffinity & ~Affinity.Mask) !== 0) {
      throw new Error("invalid affinity: " + newAffinity);
    }
    const oldAffinity = (this.flags & Affinity.Mask) as Affinity;
    if (newAffinity === oldAffinity) {
      return;
    }
    this.willSetAffinity(newAffinity, oldAffinity);
    this.setFlags(this.flags & ~Affinity.Mask | newAffinity);
    this.onSetAffinity(newAffinity, oldAffinity);
    this.didSetAffinity(newAffinity, oldAffinity);
  },

  willSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void {
    // hook
  },

  onSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void {
    if (newAffinity > oldAffinity && (this.flags & Fastener.DerivedFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null && Math.min(inlet.flags & Affinity.Mask, Affinity.Intrinsic) < newAffinity) {
        this.setDerived(false, inlet);
      }
    } else if (newAffinity < oldAffinity && (this.flags & Fastener.InheritsFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null && Math.min(inlet.flags & Affinity.Mask, Affinity.Intrinsic) >= newAffinity) {
        this.setDerived(true, inlet);
      }
    }
  },

  didSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void {
    // hook
  },

  get parentType(): Proto<unknown> | null | undefined {
    return void 0;
  },

  get inheritName(): PropertyKey | undefined {
    return (this.flags & Fastener.InheritsFlag) !== 0 ? this.name : void 0;
  },

  get inherits(): boolean {
    return (this.flags & Fastener.InheritsFlag) !== 0;
  },

  initInherits(inherits: PropertyKey | boolean): void {
    let inheritName: PropertyKey | undefined;
    if (typeof inherits === "string" || typeof inherits === "number" || typeof inherits === "symbol") {
      inheritName = inherits;
      inherits = true;
    }
    if (inherits) {
      if (inheritName !== void 0) {
        Object.defineProperty(this, "name", {
          value: inheritName,
          enumerable: true,
          configurable: true,
        });
      }
      (this as Mutable<typeof this>).flags = this.flags | Fastener.InheritsFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~Fastener.InheritsFlag;
    }
  },

  setInherits(inherits: PropertyKey | boolean): void {
    let inheritName: PropertyKey | undefined;
    if (typeof inherits === "string" || typeof inherits === "number" || typeof inherits === "symbol") {
      if (inherits !== this.name) {
        inheritName = inherits;
      }
      inherits = true;
    }
    if (inherits && ((this.flags & Fastener.InheritsFlag) === 0 || (inheritName !== void 0 && inheritName !== this.name))) {
      this.unbindInlet();
      this.willSetInherits(true, inheritName);
      if (inheritName !== void 0) {
        Object.defineProperty(this, "name", {
          value: inheritName,
          enumerable: true,
          configurable: true,
        });
      }
      this.setFlags(this.flags | Fastener.InheritsFlag);
      this.onSetInherits(true, inheritName);
      this.didSetInherits(true, inheritName);
      this.inheritInlet();
    } else if (!inherits && (this.flags & Fastener.InheritsFlag) !== 0) {
      this.unbindInlet();
      this.willSetInherits(false, inheritName);
      this.setFlags(this.flags & ~Fastener.InheritsFlag);
      this.onSetInherits(false, inheritName);
      this.didSetInherits(false, inheritName);
    }
  },

  willSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void {
    // hook
  },

  onSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void {
    // hook
  },

  didSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void {
    // hook
  },

  get derived(): boolean {
    return (this.flags & Fastener.DerivedFlag) !== 0;
  },

  setDerived(derived: boolean, inlet: Fastener): void {
    if (derived && (this.flags & Fastener.DerivedFlag) === 0) {
      this.willDerive(inlet);
      this.setFlags(this.flags | Fastener.DerivedFlag);
      this.onDerive(inlet);
      this.didDerive(inlet);
    } else if (!derived && (this.flags & Fastener.DerivedFlag) !== 0) {
      this.willUnderive(inlet);
      this.setFlags(this.flags & ~Fastener.DerivedFlag);
      this.onUnderive(inlet);
      this.didUnderive(inlet);
    }
  },

  willDerive(inlet: Fastener): void {
    // hook
  },

  onDerive(inlet: Fastener): void {
    // hook
  },

  didDerive(inlet: Fastener): void {
    // hook
  },

  willUnderive(inlet: Fastener): void {
    // hook
  },

  onUnderive(inlet: Fastener): void {
    // hook
  },

  didUnderive(inlet: Fastener): void {
    // hook
  },

  get parent(): Fastener | null {
    const inheritName = this.inheritName;
    if (inheritName === void 0 || !FastenerContext[Symbol.hasInstance](this.owner)) {
      return null;
    }
    return this.owner.getParentFastener(inheritName, this.fastenerType, this.parentType);
  },

  inheritInlet(): void {
    if ((this.flags & Fastener.InheritsFlag) === 0) {
      return;
    }
    const inlet = this.parent;
    if (inlet === null) {
      return;
    }
    this.willBindInlet(inlet);
    inlet.attachOutlet(this);
    (this as Mutable<typeof this>).inlet = inlet;
    this.onBindInlet(inlet);
    this.didBindInlet(inlet);
  },

  bindInlet(inlet: Fastener): void {
    this.setInherits(false);
    this.willBindInlet(inlet);
    inlet.attachOutlet(this);
    (this as Mutable<typeof this>).inlet = inlet;
    this.onBindInlet(inlet);
    this.didBindInlet(inlet);
  },

  willBindInlet(inlet: Fastener): void {
    // hook
  },

  onBindInlet(inlet: Fastener): void {
    if ((inlet.flags & Affinity.Mask) >= (this.flags & Affinity.Mask)) {
      this.setDerived(true, inlet);
    }
  },

  didBindInlet(inlet: Fastener): void {
    // hook
  },

  uninheritInlet(): void {
    if ((this.flags & Fastener.InheritsFlag) === 0) {
      return;
    }
    const inlet = this.inlet;
    if (inlet === null) {
      return;
    }
    this.willUnbindInlet(inlet);
    inlet.detachOutlet(this);
    (this as Mutable<typeof this>).inlet = null;
    this.onUnbindInlet(inlet);
    this.didUnbindInlet(inlet);
  },

  unbindInlet(inlet?: Fastener | null): void {
    if (inlet !== void 0 && inlet !== null && inlet !== this.inlet) {
      return;
    }
    inlet = this.inlet;
    if (inlet === null) {
      return;
    }
    this.willUnbindInlet(inlet);
    inlet.detachOutlet(this);
    (this as Mutable<typeof this>).inlet = null;
    this.onUnbindInlet(inlet);
    this.didUnbindInlet(inlet);
  },

  willUnbindInlet(inlet: Fastener): void {
    // hook
  },

  onUnbindInlet(inlet: Fastener): void {
    this.setDerived(false, inlet);
  },

  didUnbindInlet(inlet: Fastener): void {
    // hook
  },

  attachOutlet(outlet: Fastener): void {
    // hook
  },

  detachOutlet(outlet: Fastener): void {
    // hook
  },

  get coherent(): boolean {
    return (this.flags & Fastener.DecoherentFlag) === 0;
  },

  setCoherent(coherent: boolean): void {
    if (coherent) {
      this.setFlags(this.flags & ~Fastener.DecoherentFlag);
    } else {
      this.setFlags(this.flags | Fastener.DecoherentFlag);
    }
  },

  decohere(): void {
    const owner = this.owner;
    if (Objects.hasAllKeys<FastenerContext>(owner, "decohereFastener")) {
      owner.decohereFastener!(this);
    }
  },

  recohere(t: number): void {
    // hook
  },

  get mounted(): boolean {
    return (this.flags & Fastener.MountedFlag) !== 0;
  },

  mount(): void {
    if ((this.flags & Fastener.MountedFlag) !== 0) {
      return;
    }
    this.willMount();
    this.setFlags(this.flags | Fastener.MountedFlag);
    this.onMount();
    this.didMount();
  },

  willMount(): void {
    // hook
  },

  onMount(): void {
    this.inheritInlet();
  },

  didMount(): void {
    // hook
  },

  unmount(): void {
    if ((this.flags & Fastener.MountedFlag) === 0) {
      return;
    }
    this.willUnmount();
    this.setFlags(this.flags & ~Fastener.MountedFlag);
    this.onUnmount();
    this.didUnmount();
  },

  willUnmount(): void {
    // hook
  },

  onUnmount(): void {
    this.uninheritInlet();
  },

  didUnmount(): void {
    // hook
  },

  toString(): string {
    return this.name.toString();
  },
},
{
  create(owner: F extends Fastener<infer O> ? O : never): F {
    const fastener = this.construct(null, owner);
    fastener.init();
    return fastener;
  },

  construct(fastener: F | null, owner: F extends Fastener<infer O> ? O : never): F {
    if (fastener === null) {
      fastener = Object.create(this.prototype) as F;
    }
    (fastener as Mutable<typeof fastener>).flags = 0;
    (fastener as Mutable<typeof fastener>).owner = owner;
    (fastener as Mutable<typeof fastener>).inlet = null;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initAffinity((flagsInit & Affinity.Mask) as Affinity);
      fastener.initInherits((flagsInit & Fastener.InheritsFlag) !== 0);
    }
    return fastener;
  },

  declare<F2 extends F, C extends FastenerClass<any>>(className: PropertyKey): C {
    if (typeof className === "string" && Identifiers.isValid(className) && className !== "template") {
      return new Function("FastenerContext",
        "return function " + className + "(template) { return FastenerContext.fastenerDecorator(" + className + ", template); }"
      )(FastenerContext) as C;
    }

    const fastenerClass = function <F extends Fastener>(template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never): FastenerDecorator<F> {
      return FastenerContext.fastenerDecorator(fastenerClass, template);
    } as C;
    Object.defineProperty(fastenerClass, "name", {
      value: className,
      enumerable: true,
      configurable: true,
    });
    return fastenerClass;
  },

  implement<F2 extends F, C extends FastenerClass<any>>(fastenerClass: C, template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never, classTemplate?: ThisType<C> & Partial<C>): void {
    Object.defineProperty(template, "name", {
      value: fastenerClass.name,
      enumerable: true,
      configurable: true,
    });
    if ("extends" in template) {
      delete template.extends;
    }
    // Directly insert the template object into the prototype chain
    // to ensure that super works correctly.
    Object.setPrototypeOf(template, this.prototype);
    fastenerClass.prototype = template as unknown as F2;
    fastenerClass.prototype.constructor = fastenerClass;
    if (classTemplate !== void 0) {
      Object.setPrototypeOf(fastenerClass, classTemplate);
      Object.setPrototypeOf(classTemplate, this);
    } else {
      Object.setPrototypeOf(fastenerClass, this);
    }
  },

  specialize(template: F extends {readonly descriptorType?: Proto<infer D>} ? D : never): FastenerClass<F> {
    let baseClass = template.extends as FastenerClass<F> | null | undefined;
    if (baseClass === void 0 || baseClass === null) {
      baseClass = this;
    }
    return baseClass;
  },

  refine(fastenerClass: FastenerClass<any>): void {
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "affinity")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      flagsInit = flagsInit & ~Affinity.Mask | fastenerPrototype.affinity & Affinity.Mask;
      delete (fastenerPrototype as FastenerDescriptor).affinity;
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "inherits")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      let inherits = fastenerPrototype.inherits as PropertyKey | boolean;
      if (typeof inherits === "string" || typeof inherits === "number" || typeof inherits === "symbol") {
        Object.defineProperty(fastenerPrototype, "name", {
          value: inherits,
          enumerable: true,
          configurable: true,
        });
        inherits = true;
      }
      if (fastenerPrototype.inherits) {
        flagsInit |= Fastener.InheritsFlag;
      } else {
        flagsInit &= ~Fastener.InheritsFlag;
      }
      delete (fastenerPrototype as FastenerDescriptor).inherits;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        enumerable: true,
        configurable: true,
      });
    }
  },

  extend<F2 extends F, C extends FastenerClass<any>>(className: PropertyKey, template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never, classTemplate?: ThisType<C> & Partial<C>): any {
    if (template.name !== void 0) {
      className = template.name;
    }
    const fastenerClass = this.declare<F2, C>(className);
    this.implement(fastenerClass, template, classTemplate);
    this.refine(fastenerClass);
    return fastenerClass;
  },

  define<F2 extends F>(className: PropertyKey, template: F2 extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F2> & D & Partial<Omit<F2, keyof D>> : never, extendsClass?: FastenerClass<F>): FastenerClass<F2> {
    if (typeof template.extends === "boolean") {
      const extendsDescriptor = Object.getOwnPropertyDescriptor(template, "extends")!;
      if (template.extends === true) {
        Object.defineProperty(template, "extends", {
          value: extendsClass,
          writable: extendsDescriptor.writable,
          enumerable: extendsDescriptor.enumerable,
          configurable: true,
        });
      } else if (template.extends === false) {
        Object.defineProperty(template, "extends", {
          value: null,
          writable: extendsDescriptor.writable,
          enumerable: extendsDescriptor.enumerable,
          configurable: true,
        });
      }
    }
    const baseClass = this.specialize(template);
    return baseClass.extend(className, template);
  },

  dummy<F2 extends F>(): F2 {
    throw new Error("dummy fastener");
  },

  MountedFlag: 1 << (Affinity.Shift + 0),
  InheritsFlag: 1 << (Affinity.Shift + 1),
  DerivedFlag: 1 << (Affinity.Shift + 2),
  DecoherentFlag: 1 << (Affinity.Shift + 3),

  FlagShift: Affinity.Shift + 4,
  FlagMask: (1 << (Affinity.Shift + 4)) - 1,
}))();
