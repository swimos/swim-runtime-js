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
export interface FastenerDescriptor<R> {
  name?: PropertyKey;
  extends?: Proto<Fastener<any, any, any>> | boolean | null;
  affinity?: Affinity;
  inherits?: PropertyKey | boolean;
}

/** @public */
export interface FastenerDecorator<F extends Fastener<any, any, any>> {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value?: F) => F;
  <T>(target: (this: T) => F, context: ClassGetterDecoratorContext<T, F>): (this: T) => F;
}

/** @public */
export type FastenerTemplate<F extends Fastener<any, any, any>> =
  F extends {readonly descriptorType?: Proto<infer D>}
          ? ThisType<F> & D & Partial<Omit<F, keyof D>> & (F extends Fastener<infer R, any, any> ? {readonly inletKeys?: readonly (keyof R)[]} : {})
          : never;

/** @public */
export type FastenerClassTemplate<C extends FastenerClass<any>> =
  ThisType<C> & Partial<C>;

/** @public */
export interface FastenerClass<F extends Fastener<any, any, any> = Fastener<any, any, any>> {
  /** @internal */
  prototype: F;

  create(owner: F extends Fastener<infer R, any, any> ? R : never): F;

  /** @protected */
  construct(fastener: F | null, owner: F extends Fastener<infer R, any, any> ? R : never): F;

  /** @internal */
  declare<F2 extends F, C extends FastenerClass<any> = FastenerClass<F2>>(className: PropertyKey): C;

  /** @internal */
  implement<F2 extends F, C extends FastenerClass<any> = FastenerClass<F2>>(fastenerClass: C, template: FastenerTemplate<F2>, classTemplate?: FastenerClassTemplate<C>): void;

  specialize(template: F extends {readonly descriptorType?: Proto<infer D>} ? D : never): FastenerClass<F>;

  refine(fastenerClass: FastenerClass<Fastener<any, any, any>>): void;

  extend<F2 extends F, C extends FastenerClass<any> = FastenerClass<F2>>(className: PropertyKey, template: FastenerTemplate<F2>, classTemplate?: FastenerClassTemplate<C>): C;

  define<F2 extends F>(className: PropertyKey, template: FastenerTemplate<F2>, extendsClass?: FastenerClass<F>): FastenerClass<F2>;

  dummy<F2 extends F>(): F2;

  <F2 extends F>(template: FastenerTemplate<F2>): FastenerDecorator<F2>;

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
export interface Fastener<R = any, O = any, I extends any[] = any> {
  get descriptorType(): Proto<FastenerDescriptor<R>>;

  get fastenerType(): Proto<Fastener<any, any, any>>;

  readonly owner: R;

  readonly name: PropertyKey;

  get binds(): boolean;

  /** @protected */
  init(): void;

  /** @internal */
  get flagsInit(): FastenerFlags;

  /** @internal */
  readonly flags: FastenerFlags;

  /** @internal */
  setFlags(flags: FastenerFlags): void;

  readonly coherentTime: number;

  /** @protected */
  setCoherentTime(coherentTime: number): void;

  readonly version: number;

  /** @protected */
  incrementVersion(): void;

  get parentType(): Proto<any> | null | undefined;

  get parent(): Fastener<any, any, any> | null;

  readonly inletVersion: readonly number[] | number;

  readonly inlet: readonly Fastener<any, any, any>[] | Fastener<any, any, any> | null;

  /** @internal */
  inheritInlet(): void;

  bindInlet<K extends keyof I, IK extends I[K]>(inlet: Fastener<any, IK, any>, key: IK): void;
  bindInlet<I0 extends I[0]>(inlet: Fastener<any, I0, any>): void;

  /** @protected */
  willBindInlet(inlet: Fastener<any, any, any>): void;

  /** @protected */
  onBindInlet(inlet: Fastener<any, any, any>): void;

  /** @protected */
  didBindInlet(inlet: Fastener<any, any, any>): void;

  /** @internal */
  uninheritInlet(): void;

  unbindInlet(inlet?: Fastener<any, any, any>): void;

  /** @protected */
  willUnbindInlet(inlet: Fastener<any, any, any>): void;

  /** @protected */
  onUnbindInlet(inlet: Fastener<any, any, any>): void;

  /** @protected */
  didUnbindInlet(inlet: Fastener<any, any, any>): void;

  /** @internal */
  attachOutlet(outlet: Fastener<any, any, any>): void;

  /** @internal */
  detachOutlet(outlet: Fastener<any, any, any>): void;

  get inheritName(): PropertyKey | undefined;

  get inherits(): boolean;

  setInherits(inherits: PropertyKey | boolean): void;

  /** @protected */
  willSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void;

  /** @protected */
  onSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void;

  /** @protected */
  didSetInherits(inherits: boolean, inheritName: PropertyKey | undefined): void;

  get derived(): boolean;

  /** @internal */
  setDerived(derived: boolean): void;

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

  get coherent(): boolean;

  /** @protected */
  setCoherent(coherent: boolean): void;

  decohere(inlet?: Fastener<any, any, any>): void;

  requireRecohere(): void;

  recohere(t: number): void;

  /** @protected */
  get inletKeys(): readonly PropertyKey[] | undefined;

  resolveInlets(): readonly Fastener<any, any, any>[] | null;

  /** @protected */
  attachInlets(): void;

  /** @protected */
  detachInlets(): void;

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
export const Fastener = (<R, O, I extends any[], F extends Fastener<any, any, any>>() => (function (template: FastenerTemplate<Fastener<R, O, I>>, classTemplate: FastenerClassTemplate<FastenerClass<F>>): FastenerClass<F> {
  const Fastener = function (template: FastenerTemplate<F>): FastenerDecorator<F> {
    return FastenerContext.fastenerDecorator(Fastener, template);
  } as FastenerClass<F>;
  Object.setPrototypeOf(template, Object.prototype);
  Fastener.prototype = template as F;
  Fastener.prototype.constructor = Fastener;
  Object.setPrototypeOf(classTemplate, Fastener.prototype);
  Object.setPrototypeOf(Fastener, classTemplate);
  return Fastener;
})({
  get fastenerType(): Proto<Fastener<any, any, any>> {
    return Fastener;
  },

  get name(): string {
    return "Fastener";
  },

  init(): void {
    // hook
  },

  binds: false,

  flagsInit: 0,

  setFlags(flags: FastenerFlags): void {
    (this as Mutable<typeof this>).flags = flags;
  },

  incrementVersion(): void {
    (this as Mutable<typeof this>).version += 1;
  },

  setCoherentTime(coherentTime: number): void {
    (this as Mutable<typeof this>).coherentTime = coherentTime;
  },

  get parentType(): Proto<any> | null | undefined {
    return void 0;
  },

  get parent(): Fastener<any, any, any> | null {
    const inheritName = this.inheritName;
    if (inheritName === void 0 || !FastenerContext[Symbol.hasInstance](this.owner)) {
      return null;
    }
    return this.owner.getParentFastener(inheritName, this.fastenerType, this.parentType);
  },

  inheritInlet(): void {
    let inlet: Fastener | null;
    if ((this.flags & Fastener.InheritsFlag) === 0 || (inlet = this.parent) === null) {
      return;
    }
    this.willBindInlet(inlet);
    inlet.attachOutlet(this);
    (this as Mutable<typeof this>).inletVersion = -1;
    (this as Mutable<typeof this>).inlet = inlet;
    this.onBindInlet(inlet);
    this.didBindInlet(inlet);
  },

  bindInlet<K extends keyof I, IK extends I[K]>(inlet: Fastener<any, IK, any>, key?: IK): void {
    this.setInherits(false);
    this.willBindInlet(inlet);
    inlet.attachOutlet(this);
    (this as Mutable<typeof this>).inletVersion = -1;
    (this as Mutable<typeof this>).inlet = inlet;
    this.onBindInlet(inlet);
    this.didBindInlet(inlet);
  },

  willBindInlet(inlet: Fastener<any, any, any>): void {
    // hook
  },

  onBindInlet(inlet: Fastener<any, any, any>): void {
    this.recohere(performance.now());
  },

  didBindInlet(inlet: Fastener<any, any, any>): void {
    // hook
  },

  uninheritInlet(): void {
    if ((this.flags & Fastener.InheritsFlag) === 0) {
      return;
    }
    const inlet = this.inlet;
    if (!(inlet instanceof Fastener)) {
      return;
    }
    this.willUnbindInlet(inlet);
    inlet.detachOutlet(this);
    (this as Mutable<typeof this>).inletVersion = -1;
    (this as Mutable<typeof this>).inlet = null;
    this.onUnbindInlet(inlet);
    this.didUnbindInlet(inlet);
  },

  unbindInlet(inlet?: Fastener<any, any, any>): void {
    if (inlet === void 0 && this.inlet instanceof Fastener) {
      inlet = this.inlet;
    }
    if (inlet instanceof Fastener && inlet === this.inlet) {
      this.willUnbindInlet(inlet);
      inlet.detachOutlet(this);
      (this as Mutable<typeof this>).inletVersion = -1;
      (this as Mutable<typeof this>).inlet = null;
      this.onUnbindInlet(inlet);
      this.didUnbindInlet(inlet);
    } else if (inlet === void 0) {
      (this as Mutable<typeof this>).inletVersion = -1;
      (this as Mutable<typeof this>).inlet = null;
    }
  },

  willUnbindInlet(inlet: Fastener<any, any, any>): void {
    // hook
  },

  onUnbindInlet(inlet: Fastener<any, any, any>): void {
    this.setDerived(false);
  },

  didUnbindInlet(inlet: Fastener<any, any, any>): void {
    // hook
  },

  attachOutlet(outlet: Fastener<any, any, any>): void {
    // hook
  },

  detachOutlet(outlet: Fastener<any, any, any>): void {
    // hook
  },

  get inheritName(): PropertyKey | undefined {
    return (this.flags & Fastener.InheritsFlag) !== 0 ? this.name : void 0;
  },

  get inherits(): boolean {
    return (this.flags & Fastener.InheritsFlag) !== 0;
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

  setDerived(derived: boolean): void {
    if (derived) {
      this.setFlags(this.flags | Fastener.DerivedFlag);
    } else {
      this.setFlags(this.flags & ~Fastener.DerivedFlag);
    }
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
      if (inlet instanceof Fastener && Math.min(inlet.flags & Affinity.Mask, Affinity.Intrinsic) < newAffinity) {
        this.setDerived(false);
      }
    } else if (newAffinity < oldAffinity && (this.flags & Fastener.InheritsFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet instanceof Fastener && Math.min(inlet.flags & Affinity.Mask, Affinity.Intrinsic) >= newAffinity) {
        this.decohere(inlet);
      }
    }
  },

  didSetAffinity(newAffinity: Affinity, oldAffinity: Affinity): void {
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

  decohere(inlet?: Fastener<any, any, any>): void {
    if (inlet === void 0 || inlet !== this.inlet || (this.flags & Fastener.DerivedFlag) !== 0) {
      if ((this.flags & Fastener.DecoherentFlag) === 0) {
        this.requireRecohere();
      }
    } else {
      this.recohere(performance.now());
    }
  },

  requireRecohere(): void {
    this.setCoherent(false);
    if (Objects.hasAllKeys<FastenerContext>(this.owner, "decohereFastener")) {
      this.owner.decohereFastener!(this);
    }
  },

  recohere(t: number): void {
    this.setCoherentTime(t);
    const inlet = this.inlet;
    if (inlet instanceof Fastener) {
      this.setDerived((this.flags & Affinity.Mask) <= Math.min(inlet.flags & Affinity.Mask, Affinity.Intrinsic));
    } else if (Array.isArray(inlet)) {
      this.setDerived(true);
    } else {
      this.setDerived(false);
    }
    this.setCoherent(true);
  },

  inletKeys: void 0,

  resolveInlets(): readonly Fastener<any, any, any>[] | null {
    const inletKeys = this.inletKeys;
    if (inletKeys === void 0 || !Objects.hasAllKeys<FastenerContext>(this.owner, "getFastener")) {
      return null;
    }
    const inlets = new Array<Fastener<any, any, any>>(inletKeys.length);
    for (let i = 0; i < inletKeys.length; i += 1) {
      const inletKey = inletKeys[i]!;
      const inlet = this.owner.getFastener(inletKey);
      if (inlet === null) {
        return null;
      }
      inlets[i] = inlet;
    }
    return inlets;
  },

  attachInlets(): void {
    const inlets = this.resolveInlets();
    if (inlets !== null) {
      this.setInherits(false);
      this.setFlags(this.flags | Fastener.DerivedFlag);
      const inletVersions = new Array<number>(inlets.length);
      for (let i = 0; i < inlets.length; i += 1) {
        inletVersions[i] = -1;
      }
      (this as Mutable<typeof this>).inletVersion = inletVersions;
      (this as Mutable<typeof this>).inlet = inlets;
      for (let i = 0; i < inlets.length; i += 1) {
        inlets[i]!.attachOutlet(this);
      }
    } else {
      this.inheritInlet();
    }
  },

  detachInlets(): void {
    const inlet = this.inlet;
    if (Array.isArray(inlet)) {
      for (let i = 0; i < inlet.length; i += 1) {
        (inlet[i] as Fastener).detachOutlet(this);
      }
      (this as Mutable<typeof this>).inletVersion = -1;
      (this as Mutable<typeof this>).inlet = null;
      this.setFlags(this.flags & ~Fastener.DerivedFlag);
    } else {
      this.uninheritInlet();
    }
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
    this.attachInlets();
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
    this.detachInlets();
  },

  didUnmount(): void {
    // hook
  },

  toString(): string {
    return this.name.toString();
  },
},
{
  create(owner: F extends Fastener<infer R, any, any> ? R : never): F {
    const fastener = this.construct(null, owner);
    fastener.init();
    return fastener;
  },

  construct(fastener: F | null, owner: F extends Fastener<infer R, any, any> ? R : never): F {
    if (fastener === null) {
      fastener = Object.create(this.prototype) as F;
    }
    (fastener as Mutable<typeof fastener>).owner = owner;
    (fastener as Mutable<typeof fastener>).flags = fastener.flagsInit;
    (fastener as Mutable<typeof fastener>).coherentTime = 0;
    (fastener as Mutable<typeof fastener>).version = 0;
    (fastener as Mutable<typeof fastener>).inletVersion = -1;
    (fastener as Mutable<typeof fastener>).inlet = null;
    return fastener;
  },

  declare<F2 extends F, C extends FastenerClass<any>>(className: PropertyKey): C {
    if (typeof className === "string" && Identifiers.isValid(className) && className !== "template") {
      return new Function("FastenerContext",
        "return function " + className + "(template) { return FastenerContext.fastenerDecorator(" + className + ", template); }"
      )(FastenerContext) as C;
    }

    const fastenerClass = function <F extends Fastener<any, any, any>>(template: FastenerTemplate<F>): FastenerDecorator<F> {
      return FastenerContext.fastenerDecorator(fastenerClass, template);
    } as C;
    Object.defineProperty(fastenerClass, "name", {
      value: className,
      enumerable: true,
      configurable: true,
    });
    return fastenerClass;
  },

  implement<F2 extends F, C extends FastenerClass<any>>(fastenerClass: C, template: FastenerTemplate<F2>, classTemplate?: FastenerClassTemplate<C>): void {
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

  refine(fastenerClass: FastenerClass<Fastener<any, any, any>>): void {
    const fastenerPrototype = fastenerClass.prototype;

    let flagsInit = fastenerPrototype.flagsInit;
    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "affinity")) {
      flagsInit = flagsInit & ~Affinity.Mask | fastenerPrototype.affinity & Affinity.Mask;
      delete (fastenerPrototype as FastenerDescriptor<any>).affinity;
    }
    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "inherits")) {
      let inherits = fastenerPrototype.inherits as PropertyKey | boolean;
      if (typeof inherits === "string" || typeof inherits === "number" || typeof inherits === "symbol") {
        Object.defineProperty(fastenerPrototype, "name", {
          value: inherits,
          enumerable: true,
          configurable: true,
        });
        inherits = true;
      }
      if (inherits) {
        flagsInit |= Fastener.InheritsFlag;
      } else {
        flagsInit &= ~Fastener.InheritsFlag;
      }
      delete (fastenerPrototype as FastenerDescriptor<any>).inherits;
    }
    Object.defineProperty(fastenerPrototype, "flagsInit", {
      value: flagsInit,
      enumerable: true,
      configurable: true,
    });
  },

  extend<F2 extends F, C extends FastenerClass<any>>(className: PropertyKey, template: FastenerTemplate<F2>, classTemplate?: FastenerClassTemplate<C>): any {
    if (template.name !== void 0) {
      className = template.name;
    }
    const fastenerClass = this.declare<F2, C>(className);
    this.implement(fastenerClass, template, classTemplate);
    this.refine(fastenerClass);
    return fastenerClass;
  },

  define<F2 extends F>(className: PropertyKey, template: FastenerTemplate<F2>, extendsClass?: FastenerClass<F>): FastenerClass<F2> {
    if (typeof template.extends === "boolean") {
      if (template.extends === true) {
        Object.defineProperty(template, "extends", {
          value: extendsClass,
          enumerable: true,
          configurable: true,
        });
      } else if (template.extends === false) {
        Object.defineProperty(template, "extends", {
          value: null,
          enumerable: true,
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
