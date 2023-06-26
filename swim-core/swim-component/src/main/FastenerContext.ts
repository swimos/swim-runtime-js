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

import type {Proto} from "@swim/util";
import type {FastenerDecorator} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import type {Fastener} from "./Fastener";

/** @public */
export interface FastenerContextClass {
  /** @internal */
  prototype: Partial<FastenerContextClass>;
  /** @internal */
  [FastenerContext.FastenerClassMap]: {[fastenerName: PropertyKey]: FastenerClass<any> | undefined};
  /** @internal */
  [FastenerContext.FastenerSlotMap]: {[fastenerName: PropertyKey]: PropertyKey | undefined};
  /** @internal */
  [FastenerContext.FastenerSlots]: PropertyKey[];
}

/** @public */
export interface FastenerContext {
  getParentFastener<F extends Fastener<any>>(fastenerName: PropertyKey, fastenerType: Proto<F>, contextType?: Proto<unknown> | null): F | null;

  attachFastener?(fastener: Fastener): void;

  decohereFastener?(fastener: Fastener): void;

  requireUpdate?(updateFlags: number): void;
}

/** @public */
export const FastenerContext = (function () {
  const FastenerContext = {} as {
    getOptionalFastener<O, K extends keyof O>(owner: O, fastenerName: K): O[K] | null;

    getFastenerSlot<O>(owner: O, fastenerName: keyof O): keyof O | undefined;

    getFastenerSlots<O>(owner: O): readonly (keyof O)[];

    fastenerDecorator<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never): FastenerDecorator<F>;

    /** @internal */
    decorateFastener<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F;
    /** @internal */
    decorateFastener<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: (this: F extends Fastener<infer O> ? O : never) => F, context: ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never) => F;

    /** @internal */
    decorateFastenerField<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F;

    /** @internal */
    decorateFastenerGetter<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: (this: F extends Fastener<infer O> ? O : never) => F, context: ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never) => F;

    /** @internal */
    initOwner(owner: unknown): FastenerContextClass;

    /** @internal */
    initFastenerField<O>(owner: O, fastenerName: PropertyKey): keyof O;

    /** @internal */
    initFastenerGetter<O>(owner: O, fastenerName: PropertyKey): keyof O;

    /** @internal */
    initFastenerClass<F extends Fastener<any>>(owner: F extends Fastener<infer O> ? O : never, baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, fastenerName: PropertyKey, fastenerSlot: PropertyKey, fastenerClass: FastenerClass<F> | null): FastenerClass<F>;

    [Symbol.hasInstance](instance: unknown): instance is FastenerContext;

    readonly FastenerClassMap: unique symbol;

    readonly FastenerSlotMap: unique symbol;

    readonly FastenerSlots: unique symbol;
  };

  FastenerContext.getOptionalFastener = function <O, K extends keyof O>(owner: O, fastenerName: K): O[K] | null {
    const fastenerSlot = FastenerContext.getFastenerSlot(owner, fastenerName);
    const fastener = fastenerSlot !== void 0 ? owner[fastenerSlot] as O[K] | undefined : void 0;
    return fastener !== void 0 ? fastener : null;
  };

  FastenerContext.getFastenerSlot = function <O>(owner: O, fastenerName: PropertyKey): keyof O | undefined {
    const contextClass = (owner as object).constructor as Partial<FastenerContextClass>;
    const fastenerSlotMap = contextClass[FastenerContext.FastenerSlotMap];
    return fastenerSlotMap !== void 0 ? fastenerSlotMap[fastenerName] as keyof O : void 0;
  };

  FastenerContext.getFastenerSlots = function <O>(owner: O): readonly (keyof O)[] {
    const contextClass = (owner as object).constructor as Partial<FastenerContextClass>;
    let fastenerSlots = contextClass[FastenerContext.FastenerSlots] as (keyof O)[] | undefined;
    if (fastenerSlots === void 0) {
      fastenerSlots = [];
    }
    return fastenerSlots;
  };

  FastenerContext.fastenerDecorator = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never): FastenerDecorator<F> {
    return FastenerContext.decorateFastener.bind(FastenerContext, baseClass, template) as unknown as FastenerDecorator<F>;
  };

  FastenerContext.decorateFastener = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: ((this: F extends Fastener<infer O> ? O : never) => F) | undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F> | ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F {
    if (context.kind === "field") {
      return FastenerContext.decorateFastenerField(baseClass, template, target as undefined, context);
    } else if (context.kind === "getter") {
      return FastenerContext.decorateFastenerGetter(baseClass, template, target!, context);
    }
    throw new Error("unsupported " + (context as ClassMemberDecoratorContext).kind + " decorator");
  };

  FastenerContext.decorateFastenerField = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F {
    const fastenerName = context.name;
    let fastenerClass: FastenerClass<F> | null = null;
    context.addInitializer(function (this: F extends Fastener<infer O> ? O : never): void {
      FastenerContext.initFastenerField(this, fastenerName);
      fastenerClass = FastenerContext.initFastenerClass(this, baseClass, template, fastenerName, fastenerName, fastenerClass) as FastenerClass<F>;
    });
    return function (this: F extends Fastener<infer O> ? O : never, value?: F): F {
      if (value === void 0) {
        value = context.access.get(this);
      }
      if (!(value instanceof fastenerClass!)) {
        value = fastenerClass!.create(this);
      }
      return value;
    };
  };

  FastenerContext.decorateFastenerGetter = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: F extends Fastener<infer O> ? (this: O) => F : never, context: ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never) => F {
    const fastenerName = context.name;
    let fastenerClass: FastenerClass<F> | null = null;
    context.addInitializer(function (this: F extends Fastener<infer O> ? O : never): void {
      const fastenerSlot = FastenerContext.initFastenerGetter(this, fastenerName);
      fastenerClass = FastenerContext.initFastenerClass(this, baseClass, template, fastenerName, fastenerSlot, fastenerClass) as FastenerClass<F>;
      this[fastenerSlot] = void 0;
    });
    return function (this: F extends Fastener<infer O> ? O : never): F {
      const fastenerSlot = FastenerContext.getFastenerSlot(this, fastenerName)!;
      let fastener = this[fastenerSlot] as F | undefined;
      if (fastener === void 0) {
        fastener = fastenerClass!.create(this);
        this[fastenerSlot] = fastener;
        if (this.attachFastener !== void 0) {
          (this as FastenerContext).attachFastener!(fastener);
        }
      }
      return fastener;
    };
  };

  FastenerContext.initOwner = function (owner: unknown): FastenerContextClass {
    const contextClass = (owner as any).constructor as Partial<FastenerContextClass>;
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerContext.FastenerClassMap)) {
      Object.defineProperty(contextClass, FastenerContext.FastenerClassMap, {
        value: Object.create(null),
        configurable: true,
      });
    }
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerContext.FastenerSlotMap)) {
      Object.defineProperty(contextClass, FastenerContext.FastenerSlotMap, {
        value: Object.create(null),
        configurable: true,
      });
    }
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerContext.FastenerSlots)) {
      Object.defineProperty(contextClass, FastenerContext.FastenerSlots, {
        value: [],
        configurable: true,
      });
    }
    return contextClass as FastenerContextClass;
  };

  FastenerContext.initFastenerField = function <O>(owner: O, fastenerName: PropertyKey): keyof O {
    const contextClass = FastenerContext.initOwner(owner);
    const fastenerSlotMap = contextClass[FastenerContext.FastenerSlotMap];
    fastenerSlotMap[fastenerName] = fastenerName;
    return fastenerName as keyof O;
  };

  FastenerContext.initFastenerGetter = function <O>(owner: O, fastenerName: PropertyKey): keyof O {
    const contextClass = FastenerContext.initOwner(owner);
    const fastenerSlotMap = contextClass[FastenerContext.FastenerSlotMap];
    let fastenerSlot = fastenerSlotMap[fastenerName];
    if (fastenerSlot === void 0) {
      fastenerSlot = Symbol(fastenerName.toString());
      fastenerSlotMap[fastenerName] = fastenerSlot;
    }
    return fastenerSlot as keyof O;
  };

  FastenerContext.initFastenerClass = function <F extends Fastener<any>>(owner: F extends Fastener<infer O> ? O : never, baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, fastenerName: PropertyKey, fastenerSlot: PropertyKey, fastenerClass: FastenerClass<F> | null): FastenerClass<F> {
    const contextClass = FastenerContext.initOwner(owner);
    const fastenerClassMap = contextClass[FastenerContext.FastenerClassMap];
    const superFastenerClass = fastenerClassMap[fastenerSlot];
    if (fastenerClass === null) {
      fastenerClass = baseClass.define(fastenerName, template, superFastenerClass);
    }
    if (superFastenerClass !== fastenerClass) {
      fastenerClassMap[fastenerSlot] = fastenerClass;
      if (superFastenerClass === void 0) {
        contextClass[FastenerContext.FastenerSlots].push(fastenerSlot);
      }
    }
    return fastenerClass;
  };

  Object.defineProperty(FastenerContext, Symbol.hasInstance, {
    value: function (instance: unknown): instance is FastenerContext {
      if (instance === null || typeof instance !== "object" && typeof instance !== "function") {
        return false;
      }
      return "getParentFastener" in (instance as FastenerContext);
    },
    configurable: true,
  });

  (FastenerContext as any).FastenerClassMap = Symbol("FastenerClassMap");

  (FastenerContext as any).FastenerSlotMap = Symbol("FastenerSlotMap");

  (FastenerContext as any).FastenerSlots = Symbol("FastenerSlots");

  return FastenerContext;
})();
