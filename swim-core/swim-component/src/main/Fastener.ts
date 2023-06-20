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
import {Affinity} from "./Affinity";
import {FastenerContext} from "./FastenerContext";

/** @public */
export type FastenerFlags = number;

/** @public */
export type FastenerOwner<F> =
  F extends Fastener<infer O> ? O : never;

/** @public */
export interface FastenerDescriptor {
  extends?: Proto<Fastener<any>> | boolean | null;
  name?: string | symbol;
  lazy?: boolean;
  /** @internal */
  flagsInit?: number;
  affinity?: Affinity;
  parentType?: Proto<any> | null | undefined;
  inherits?: string | symbol | boolean;
  binds?: boolean;
}

/** @public */
export type FastenerDecorator<F extends Fastener<any>> = {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value: F | undefined) => F;
};

/** @public */
export type FastenerTemplate<F extends Fastener<any>> =
  ThisType<F> &
  FastenerDescriptor &
  Partial<Omit<F, keyof FastenerDescriptor>>;

/** @public */
export interface FastenerClass<F extends Fastener<any> = Fastener<any>> {
  /** @internal */
  prototype: F;

  create(owner: FastenerOwner<F>): F;

  /** @protected */
  construct(fastener: F | null, owner: FastenerOwner<F>): F;

  /** @internal */
  declare(className: string | symbol): FastenerClass<F>;

  /** @internal */
  implement(fastenerClass: FastenerClass<any>, template: FastenerDescriptor): void;

  specialize(template: FastenerDescriptor): FastenerClass<F>;

  refine(fastenerClass: FastenerClass<any>): void;

  extend<F2 extends F>(className: string | symbol, template: FastenerTemplate<F2>): FastenerClass<F2>;
  extend<F2 extends F>(className: string | symbol, template: FastenerTemplate<F2>): FastenerClass<F2>;

  define<F2 extends F>(className: string | symbol, template: FastenerTemplate<F2>): FastenerClass<F2>;
  define<F2 extends F>(className: string | symbol, template: FastenerTemplate<F2>): FastenerClass<F2>;

  dummy<F2 extends F>(): F2;

  /** @override */
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
export interface Fastener<O = unknown> {
  readonly owner: O;

  /** @override */
  readonly fastenerType: Proto<Fastener<any>>; // prototype property

  readonly name: string | symbol;

  /** @internal */
  readonly lazy?: boolean; // optional prototype property

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

  get inheritName(): string | symbol | undefined;

  get inherits(): boolean;

  /** @internal */
  initInherits(inherits: string | symbol | boolean): void;

  setInherits(inherits: string | symbol | boolean): void;

  /** @protected */
  willSetInherits(inherits: boolean, inheritName: string | symbol | undefined): void;

  /** @protected */
  onSetInherits(inherits: boolean, inheritName: string | symbol | undefined): void;

  /** @protected */
  didSetInherits(inherits: boolean, inheritName: string | symbol | undefined): void;

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
  willUnderive(inlet: Fastener): void;

  /** @protected */
  didUnderive(inlet: Fastener): void;

  getInlet(): Fastener | null;

  get inlet(): Fastener | null;

  bindInlet(inlet?: Fastener): void;

  /** @protected */
  willBindInlet(inlet: Fastener): void;

  /** @protected */
  onBindInlet(inlet: Fastener): void;

  /** @protected */
  didBindInlet(inlet: Fastener): void;

  unbindInlet(): void;

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
export const Fastener = (function (_super: typeof Object) {
  const Fastener = function <F extends Fastener<any>>(template: FastenerTemplate<F>): FastenerDecorator<F> {
    return FastenerContext.decorator(Fastener, template);
  } as FastenerClass;

  Fastener.prototype = Object.create(_super.prototype);
  Fastener.prototype.constructor = Fastener;

  Object.defineProperty(Fastener.prototype, "fastenerType", {
    value: Fastener,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(Fastener.prototype, "name", {
    value: "Fastener",
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.init = function (this: Fastener): void {
    // hook
  };

  Fastener.prototype.setFlags = function (this: Fastener, flags: FastenerFlags): void {
    (this as Mutable<typeof this>).flags = flags;
  };

  Object.defineProperty(Fastener.prototype, "affinity", {
    get(this: Fastener): Affinity {
      return this.flags & Affinity.Mask;
    },
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.hasAffinity = function (this: Fastener, affinity: Affinity): boolean {
    return affinity >= (this.flags & Affinity.Mask);
  };

  Fastener.prototype.initAffinity = function (this: Fastener, affinity: Affinity): void {
    (this as Mutable<typeof this>).flags = this.flags & ~Affinity.Mask | affinity & Affinity.Mask;
  };

  Fastener.prototype.minAffinity = function (this: Fastener, newAffinity: Affinity): boolean {
    const oldAffinity = this.flags & Affinity.Mask;
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
  };

  Fastener.prototype.setAffinity = function (this: Fastener, newAffinity: Affinity): void {
    if ((newAffinity & ~Affinity.Mask) !== 0) {
      throw new Error("invalid affinity: " + newAffinity);
    }
    const oldAffinity = this.flags & Affinity.Mask;
    if (newAffinity !== oldAffinity) {
      this.willSetAffinity(newAffinity, oldAffinity);
      this.setFlags(this.flags & ~Affinity.Mask | newAffinity);
      this.onSetAffinity(newAffinity, oldAffinity);
      this.didSetAffinity(newAffinity, oldAffinity);
    }
  };

  Fastener.prototype.willSetAffinity = function (this: Fastener, newAffinity: Affinity, oldAffinity: Affinity): void {
    // hook
  };

  Fastener.prototype.onSetAffinity = function (this: Fastener, newAffinity: Affinity, oldAffinity: Affinity): void {
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
  };

  Fastener.prototype.didSetAffinity = function (this: Fastener, newAffinity: Affinity, oldAffinity: Affinity): void {
    // hook
  };

  Object.defineProperty(Fastener.prototype, "parentType", {
    get: function (this: Fastener): Proto<unknown> | null | undefined {
      return void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(Fastener.prototype, "inheritName", {
    get: function (this: Fastener): string | symbol | undefined {
      return (this.flags & Fastener.InheritsFlag) !== 0 ? this.name : void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(Fastener.prototype, "inherits", {
    get: function (this: Fastener): boolean {
      return (this.flags & Fastener.InheritsFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.initInherits = function (this: Fastener, inherits: string | symbol | boolean): void {
    let inheritName: string | symbol | undefined;
    if (typeof inherits === "string" || typeof inherits === "symbol") {
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
  };

  Fastener.prototype.setInherits = function (this: Fastener, inherits: string | symbol | boolean): void {
    let inheritName: string | symbol | undefined;
    if (typeof inherits === "string" || typeof inherits === "symbol") {
      if (inherits !== this.name) {
        inheritName = inherits;
      }
      inherits = true;
    }
    if (inherits !== ((this.flags & Fastener.InheritsFlag) !== 0) || inheritName !== void 0) {
      this.unbindInlet();
      this.willSetInherits(inherits, inheritName);
      if (inherits) {
        if (inheritName !== void 0) {
          Object.defineProperty(this, "name", {
            value: inheritName,
            enumerable: true,
            configurable: true,
          });
        }
        this.setFlags(this.flags | Fastener.InheritsFlag);
      } else {
        this.setFlags(this.flags & ~Fastener.InheritsFlag);
      }
      this.onSetInherits(inherits, inheritName);
      this.didSetInherits(inherits, inheritName);
      this.bindInlet();
    }
  };

  Fastener.prototype.willSetInherits = function (this: Fastener, inherits: boolean, inheritName: string | symbol | undefined): void {
    // hook
  };

  Fastener.prototype.onSetInherits = function (this: Fastener, inherits: boolean, inheritName: string | symbol | undefined): void {
    // hook
  };

  Fastener.prototype.didSetInherits = function (this: Fastener, inherits: boolean, inheritName: string | symbol | undefined): void {
    // hook
  };

  Object.defineProperty(Fastener.prototype, "derived", {
    get: function (this: Fastener): boolean {
      return (this.flags & Fastener.DerivedFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.setDerived = function (this: Fastener, derived: boolean, inlet: Fastener): void {
    if (derived && (this.flags & Fastener.DerivedFlag) === 0) {
      this.willDerive(inlet);
      this.setFlags(this.flags | Fastener.DerivedFlag);
      this.onDerive(inlet);
      this.didDerive(inlet);
    } else if (!derived && (this.flags & Fastener.DerivedFlag) !== 0) {
      this.willUnderive(inlet);
      this.setFlags(this.flags & ~Fastener.DerivedFlag);
      this.willUnderive(inlet);
      this.didUnderive(inlet);
    }
  };

  Fastener.prototype.willDerive = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.onDerive = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.didDerive = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.willUnderive = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.willUnderive = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.didUnderive = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.getInlet = function (this: Fastener): Fastener | null {
    const inheritName = this.inheritName;
    if (inheritName !== void 0 && this.owner instanceof (FastenerContext as any)) {
      return (this.owner as FastenerContext).getParentFastener(inheritName, this.fastenerType, this.parentType);
    }
    return null;
  };

  Object.defineProperty(Fastener.prototype, "inlet", {
    get: function (this: Fastener): Fastener | null {
      return this.getInlet();
    },
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.bindInlet = function (this: Fastener, inlet?: Fastener | null): void {
    if (inlet === void 0) {
      inlet = this.getInlet();
    }
    if (inlet !== void 0 && inlet !== null) {
      this.willBindInlet(inlet);
      inlet.attachOutlet(this);
      this.onBindInlet(inlet);
      this.didBindInlet(inlet);
    }
  };

  Fastener.prototype.willBindInlet = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.onBindInlet = function (this: Fastener, inlet: Fastener): void {
    if ((inlet.flags & Affinity.Mask) >= (this.flags & Affinity.Mask)) {
      this.setDerived(true, inlet);
    }
  };

  Fastener.prototype.didBindInlet = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.unbindInlet = function (this: Fastener): void {
    const inlet = this.inlet;
    if (inlet !== null) {
      this.willUnbindInlet(inlet);
      inlet.detachOutlet(this);
      this.onUnbindInlet(inlet);
      this.didUnbindInlet(inlet);
    }
  };

  Fastener.prototype.willUnbindInlet = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.onUnbindInlet = function (this: Fastener, inlet: Fastener): void {
    this.setDerived(false, inlet);
  };

  Fastener.prototype.didUnbindInlet = function (this: Fastener, inlet: Fastener): void {
    // hook
  };

  Fastener.prototype.attachOutlet = function (this: Fastener, outlet: Fastener): void {
    // hook
  };

  Fastener.prototype.detachOutlet = function (this: Fastener, outlet: Fastener): void {
    // hook
  };

  Object.defineProperty(Fastener.prototype, "coherent", {
    get: function (this: Fastener): boolean {
      return (this.flags & Fastener.DecoherentFlag) === 0;
    },
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.setCoherent = function (this: Fastener, coherent: boolean): void {
    if (coherent) {
      this.setFlags(this.flags & ~Fastener.DecoherentFlag);
    } else {
      this.setFlags(this.flags | Fastener.DecoherentFlag);
    }
  };

  Fastener.prototype.decohere = function (this: Fastener): void {
    const owner = this.owner;
    if (owner === null || typeof owner !== "object" && typeof owner !== "function"
        || !("decohereFastener" in owner)) {
      return;
    }
    (owner as FastenerContext).decohereFastener!(this);
  };

  Fastener.prototype.recohere = function (this: Fastener, t: number): void {
    // hook
  };

  Object.defineProperty(Fastener.prototype, "mounted", {
    get: function (this: Fastener): boolean {
      return (this.flags & Fastener.MountedFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  Fastener.prototype.mount = function (this: Fastener): void {
    if ((this.flags & Fastener.MountedFlag) === 0) {
      this.willMount();
      this.setFlags(this.flags | Fastener.MountedFlag);
      this.onMount();
      this.didMount();
    }
  };

  Fastener.prototype.willMount = function (this: Fastener): void {
    // hook
  };

  Fastener.prototype.onMount = function (this: Fastener): void {
    this.bindInlet();
  };

  Fastener.prototype.didMount = function (this: Fastener): void {
    // hook
  };

  Fastener.prototype.unmount = function (this: Fastener): void {
    if ((this.flags & Fastener.MountedFlag) !== 0) {
      this.willUnmount();
      this.setFlags(this.flags & ~Fastener.MountedFlag);
      this.onUnmount();
      this.didUnmount();
    }
  };

  Fastener.prototype.willUnmount = function (this: Fastener): void {
    // hook
  };

  Fastener.prototype.onUnmount = function (this: Fastener): void {
    this.unbindInlet();
  };

  Fastener.prototype.didUnmount = function (this: Fastener): void {
    // hook
  };

  Fastener.prototype.toString = function (this: Fastener): string {
    return this.name.toString();
  };

  Fastener.create = function <F extends Fastener<any>>(this: FastenerClass<F>, owner: FastenerOwner<F>): F {
    const fastener = this.construct(null, owner);
    fastener.init();
    return fastener;
  };

  Fastener.construct = function <F extends Fastener<any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = Object.create(this.prototype) as F;
    }
    (fastener as Mutable<typeof fastener>).owner = owner;
    (fastener as Mutable<typeof fastener>).flags = 0;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initAffinity(flagsInit & Affinity.Mask);
      fastener.initInherits((flagsInit & Fastener.InheritsFlag) !== 0);
    }
    return fastener;
  };

  Fastener.declare = function (className: string | symbol): FastenerClass {
    let fastenerClass: FastenerClass;
    if (typeof className === "string" && Identifiers.isValid(className) && className !== "template") {
      fastenerClass = new Function("FastenerContext",
        "return function " + className + "(template) { return FastenerContext.decorator(" + className + ", template); }"
      )(FastenerContext);
    } else {
      fastenerClass = function <F extends Fastener<any>>(template: FastenerTemplate<F>): FastenerDecorator<F> {
        return FastenerContext.decorator(fastenerClass, template);
      } as FastenerClass;
      Object.defineProperty(fastenerClass, "name", {
        value: className,
        enumerable: true,
        configurable: true,
      });
    }
    return fastenerClass;
  };

  Fastener.implement = function (fastenerClass: FastenerClass<any>, template: FastenerDescriptor): void {
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
    fastenerClass.prototype = template;
    fastenerClass.prototype.constructor = fastenerClass;
    Object.setPrototypeOf(fastenerClass, this);
  };

  Fastener.specialize = function (template: FastenerDescriptor): FastenerClass {
    let baseClass = template.extends as FastenerClass | null | undefined;
    if (baseClass === void 0 || baseClass === null) {
      baseClass = this;
    }
    return baseClass;
  };

  Fastener.refine = function (fastenerClass: FastenerClass<any>): void {
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
      let inherits = fastenerPrototype.inherits as string | symbol | boolean;
      if (typeof inherits === "string" || typeof inherits === "symbol") {
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
  };

  Fastener.extend = function <F extends Fastener<any>>(className: string | symbol, template: FastenerTemplate<F>): FastenerClass<F> {
    if (template.name !== void 0) {
      className = template.name;
    }
    const fastenerClass = this.declare(className) as FastenerClass<F>;
    this.implement(fastenerClass, template);
    this.refine(fastenerClass);
    return fastenerClass;
  };

  Fastener.define = function <F extends Fastener<any>>(className: string | symbol, template: FastenerTemplate<F>): FastenerClass<F> {
    const baseClass = this.specialize(template);
    return baseClass.extend(className, template);
  };

  Fastener.dummy = function <F extends Fastener<any>>(): F {
    throw new Error("dummy fastener");
  };

  (Fastener as Mutable<typeof Fastener>).MountedFlag = 1 << (Affinity.Shift + 0);
  (Fastener as Mutable<typeof Fastener>).InheritsFlag = 1 << (Affinity.Shift + 1);
  (Fastener as Mutable<typeof Fastener>).DerivedFlag = 1 << (Affinity.Shift + 2);
  (Fastener as Mutable<typeof Fastener>).DecoherentFlag = 1 << (Affinity.Shift + 3);

  (Fastener as Mutable<typeof Fastener>).FlagShift = Affinity.Shift + 4;
  (Fastener as Mutable<typeof Fastener>).FlagMask = (1 << Fastener.FlagShift) - 1;

  return Fastener;
})(Object);
