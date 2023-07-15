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
import {Objects} from "@swim/util";
import type {Timing} from "@swim/util";
import type {FastenerDecorator} from "./Fastener";
import type {FastenerTemplate} from "./Fastener";
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
  getFastener<F extends Fastener<any, any, any>>(fastenerName: PropertyKey, fastenerType?: Proto<F>, contextType?: Proto<any> | null): F | null;

  getParentFastener<F extends Fastener<any, any, any>>(fastenerName: PropertyKey, fastenerType?: Proto<F>, contextType?: Proto<any> | null): F | null;

  attachFastener?(fastener: Fastener<any, any, any>): void;

  decohereFastener?(fastener: Fastener<any, any, any>): void;

  requireUpdate?(updateFlags: number): void;

  getTransition?(fastener: Fastener<any, any, any>): Timing | null;
}

/** @public */
export const FastenerContext: {
  tryFastener<R, K extends keyof R, F extends R[K] = R[K]>(owner: R, fastenerName: K): F extends Fastener<any, any, any> ? F | null : null;

  getFastenerClass<R, K extends keyof R>(owner: R, fastenerName: K): R[K] extends Fastener<any, any, any> ? FastenerClass<R[K]> | null : null;

  getFastenerSlot<R>(owner: R, fastenerName: keyof R): keyof R | undefined;

  getFastenerSlots<R>(owner: R): readonly (keyof R)[];

  fastenerDecorator<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>): FastenerDecorator<F>;

  /** @internal */
  decorateFastener<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never, value?: F) => F;
  /** @internal */
  decorateFastener<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: (this: F extends Fastener<infer R, any, any> ? R : never) => F, context: ClassGetterDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never) => F;

  /** @internal */
  decorateFastenerField<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never, value?: F) => F;

  /** @internal */
  decorateFastenerGetter<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: (this: F extends Fastener<infer R, any, any> ? R : never) => F, context: ClassGetterDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never) => F;

  /** @internal */
  initOwner(owner: unknown): FastenerContextClass;

  /** @internal */
  initFastenerField<R>(owner: R, fastenerName: PropertyKey): keyof R;

  /** @internal */
  initFastenerGetter<R>(owner: R, fastenerName: PropertyKey): keyof R;

  /** @internal */
  initFastenerClass<F extends Fastener<any, any, any>>(owner: F extends Fastener<infer R, any, any> ? R : never, baseClass: FastenerClass, template: FastenerTemplate<F>, fastenerName: PropertyKey, fastenerSlot: PropertyKey, fastenerClass: FastenerClass<F> | null): FastenerClass<F>;

  [Symbol.hasInstance](instance: unknown): instance is FastenerContext;

  readonly FastenerClassMap: unique symbol;

  readonly FastenerSlotMap: unique symbol;

  readonly FastenerSlots: unique symbol;
} = {
  tryFastener<R, K extends keyof R, F extends R[K]>(owner: R, fastenerName: K): F extends Fastener<any, any, any> ? F | null : null {
    const fastenerSlot = FastenerContext.getFastenerSlot(owner, fastenerName);
    const fastener = fastenerSlot !== void 0 ? owner[fastenerSlot] : void 0;
    return (fastener !== void 0 ? fastener : null) as F extends Fastener<any, any, any> ? F | null : null;
  },

  getFastenerClass<R, K extends keyof R>(owner: R, fastenerName: K): R[K] extends Fastener<any, any, any> ? FastenerClass<R[K]> | null : null {
    const contextClass = (owner as object).constructor as Partial<FastenerContextClass>;
    const fastenerClassMap = contextClass[FastenerContext.FastenerClassMap];
    const fastenerClass = fastenerClassMap !== void 0 ? fastenerClassMap[fastenerName] : void 0;
    return fastenerClass !== void 0 ? fastenerClass as R[K] extends Fastener<any, any, any> ? FastenerClass<R[K]> : never : null;
  },

  getFastenerSlot<R>(owner: R, fastenerName: PropertyKey): keyof R | undefined {
    const contextClass = (owner as object).constructor as Partial<FastenerContextClass>;
    const fastenerSlotMap = contextClass[FastenerContext.FastenerSlotMap];
    return fastenerSlotMap !== void 0 ? fastenerSlotMap[fastenerName] as keyof R : void 0;
  },

  getFastenerSlots<R>(owner: R): readonly (keyof R)[] {
    const contextClass = (owner as object).constructor as Partial<FastenerContextClass>;
    let fastenerSlots = contextClass[FastenerContext.FastenerSlots] as (keyof R)[] | undefined;
    if (fastenerSlots === void 0) {
      fastenerSlots = [];
    }
    return fastenerSlots;
  },

  fastenerDecorator<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>): FastenerDecorator<F> {
    return (FastenerContext.decorateFastener as any).bind(FastenerContext, baseClass, template);
  },

  decorateFastener<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: ((this: F extends Fastener<infer R, any, any> ? R : never) => F) | undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F> | ClassGetterDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never, value?: F) => F {
    if (context.kind === "field") {
      return FastenerContext.decorateFastenerField(baseClass, template, target as undefined, context);
    } else if (context.kind === "getter") {
      return FastenerContext.decorateFastenerGetter(baseClass, template, target!, context);
    }
    throw new Error("unsupported " + (context as ClassMemberDecoratorContext).kind + " decorator");
  },

  decorateFastenerField<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never, value?: F) => F {
    const fastenerName = context.name;
    let fastenerClass: FastenerClass<F> | null = null;
    context.addInitializer(function (this: F extends Fastener<infer R, any, any> ? R : never): void {
      FastenerContext.initFastenerField(this, fastenerName);
      fastenerClass = FastenerContext.initFastenerClass(this, baseClass, template, fastenerName, fastenerName, fastenerClass) as FastenerClass<F>;
    });
    return function (this: F extends Fastener<infer R, any, any> ? R : never, value?: F): F {
      if (value === void 0) {
        value = context.access.get(this);
      }
      if (!(value instanceof fastenerClass!)) {
        value = fastenerClass!.create(this);
      }
      return value;
    };
  },

  decorateFastenerGetter<F extends Fastener<any, any, any>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: F extends Fastener<infer R, any, any> ? (this: R) => F : never, context: ClassGetterDecoratorContext<F extends Fastener<infer R, any, any> ? R : never, F>): (this: F extends Fastener<infer R, any, any> ? R : never) => F {
    const fastenerName = context.name;
    let fastenerClass: FastenerClass<F> | null = null;
    context.addInitializer(function (this: F extends Fastener<infer R, any, any> ? R : never): void {
      const fastenerSlot = FastenerContext.initFastenerGetter(this, fastenerName);
      fastenerClass = FastenerContext.initFastenerClass(this, baseClass, template, fastenerName, fastenerSlot, fastenerClass) as FastenerClass<F>;
      this[fastenerSlot] = void 0;
    });
    return function (this: F extends Fastener<infer R, any, any> ? R : never): F {
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
  },

  initOwner(owner: unknown): FastenerContextClass {
    const contextClass = (owner as any).constructor as FastenerContextClass;
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
    return contextClass;
  },

  initFastenerField<R>(owner: R, fastenerName: PropertyKey): keyof R {
    const contextClass = FastenerContext.initOwner(owner);
    const fastenerSlotMap = contextClass[FastenerContext.FastenerSlotMap];
    fastenerSlotMap[fastenerName] = fastenerName;
    return fastenerName as keyof R;
  },

  initFastenerGetter<R>(owner: R, fastenerName: PropertyKey): keyof R {
    const contextClass = FastenerContext.initOwner(owner);
    const fastenerSlotMap = contextClass[FastenerContext.FastenerSlotMap];
    let fastenerSlot = fastenerSlotMap[fastenerName];
    if (fastenerSlot === void 0) {
      fastenerSlot = Symbol(fastenerName.toString());
      fastenerSlotMap[fastenerName] = fastenerSlot;
    }
    return fastenerSlot as keyof R;
  },

  initFastenerClass<F extends Fastener<any, any, any>>(owner: F extends Fastener<infer R, any, any> ? R : never, baseClass: FastenerClass, template: FastenerTemplate<F>, fastenerName: PropertyKey, fastenerSlot: PropertyKey, fastenerClass: FastenerClass<F> | null): FastenerClass<F> {
    const contextClass = FastenerContext.initOwner(owner);
    const fastenerClassMap = contextClass[FastenerContext.FastenerClassMap];
    const superFastenerClass = fastenerClassMap[fastenerName];
    if (fastenerClass === null) {
      fastenerClass = baseClass.define(fastenerName, template, superFastenerClass);
    }
    if (superFastenerClass !== fastenerClass) {
      fastenerClassMap[fastenerName] = fastenerClass;
      if (superFastenerClass === void 0) {
        contextClass[FastenerContext.FastenerSlots].push(fastenerSlot);
      }
    }
    return fastenerClass;
  },

  [Symbol.hasInstance](instance: unknown): instance is FastenerContext {
    return Objects.hasAnyKey<FastenerContext>(instance, "getParentFastener");
  },

  FastenerClassMap: Symbol("FastenerClassMap") as any,

  FastenerSlotMap: Symbol("FastenerSlotMap") as any,

  FastenerSlots: Symbol("FastenerSlots") as any,
};
