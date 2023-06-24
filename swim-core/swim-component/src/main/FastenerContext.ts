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

/** @internal */
export const FastenerClassMap: unique symbol = Symbol("FastenerClassMap");

/** @internal */
export const FastenerFieldMap: unique symbol = Symbol("FastenerFieldMap");

/** @internal */
export const FastenerNames: unique symbol = Symbol("FastenerNames");

/** @public */
export interface FastenerContextClass {
  /** @internal */
  prototype: Partial<FastenerContextClass>;
  /** @internal */
  [FastenerClassMap]: {[fastenerName: string | symbol]: FastenerClass<any> | undefined};
  /** @internal */
  [FastenerFieldMap]: {[fastenerName: string | symbol]: string | symbol | undefined};
  /** @internal */
  [FastenerNames]: (string | symbol)[];
}

/** @public */
export interface FastenerContext {
  getParentFastener<F extends Fastener<unknown>>(fastenerName: string | symbol, fastenerType: Proto<F>, contextType?: Proto<unknown> | null): F | null;

  attachFastener?(fastener: Fastener): void;

  decohereFastener?(fastener: Fastener): void;

  requireUpdate?(updateFlags: number): void;
}

/** @public */
export const FastenerContext = (function () {
  const FastenerContext = {} as {
    getContextClass(owner: object): FastenerContextClass;

    getFastenerNames<O extends object>(owner: O): readonly (keyof O)[];

    decorator<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never): FastenerDecorator<F>;

    decorate<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F;
    decorate<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: (this: F extends Fastener<infer O> ? O : never) => F, context: ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never) => F;

    /** @internal */
    decorateField<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F;

    /** @internal */
    decorateGetter<F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: (this: F extends Fastener<infer O> ? O : never) => F, context: ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never) => F;

    /** @internal */
    initializeFastenerClass<F extends Fastener<any>>(this: F extends Fastener<infer O> ? O : never, baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, fastenerName: string | symbol, fastenerField: string | symbol, fastenerClass: FastenerClass<F> | null): FastenerClass<F>;

    /** @internal */
    getFastenerField(this: object, fastenerName: string | symbol): string | symbol;

    [Symbol.hasInstance](instance: unknown): instance is FastenerContext;
  };

  FastenerContext.getContextClass = function (owner: object): FastenerContextClass {
    const contextClass = owner.constructor as unknown as FastenerContextClass;
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerClassMap)) {
      Object.defineProperty(contextClass, FastenerClassMap, {
        value: Object.create(null),
        configurable: true,
      });
    }
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerFieldMap)) {
      Object.defineProperty(contextClass, FastenerFieldMap, {
        value: Object.create(null),
        configurable: true,
      });
    }
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerNames)) {
      Object.defineProperty(contextClass, FastenerNames, {
        value: [],
        configurable: true,
      });
    }
    return contextClass;
  };

  FastenerContext.getFastenerNames = function <O extends object>(owner: O): readonly (keyof O)[] {
    return FastenerContext.getContextClass(owner)[FastenerNames] as (keyof O)[];
  };

  FastenerContext.decorator = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never): FastenerDecorator<F> {
    return FastenerContext.decorate.bind(FastenerContext, baseClass, template) as unknown as FastenerDecorator<F>;
  };

  FastenerContext.decorate = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: ((this: F extends Fastener<infer O> ? O : never) => F) | undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F> | ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F {
    if (context.kind === "field") {
      return FastenerContext.decorateField(baseClass, template, target as undefined, context);
    } else if (context.kind === "getter") {
      return FastenerContext.decorateGetter(baseClass, template, target!, context);
    }
    throw new Error("unsupported " + (context as ClassMemberDecoratorContext).kind + " decorator");
  };

  FastenerContext.decorateField = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: undefined, context: ClassFieldDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never, value?: F) => F {
    const fastenerName = context.name;
    let fastenerClass: FastenerClass<F> | null = null;
    context.addInitializer(function (this: F extends Fastener<infer O> ? O : never): void {
      fastenerClass = FastenerContext.initializeFastenerClass.call(this, baseClass, template, fastenerName, fastenerName, fastenerClass) as FastenerClass<F>;
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

  FastenerContext.decorateGetter = function <F extends Fastener<any>>(baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, target: F extends Fastener<infer O> ? (this: O) => F : never, context: ClassGetterDecoratorContext<F extends Fastener<infer O> ? O : never, F>): (this: F extends Fastener<infer O> ? O : never) => F {
    const fastenerName = context.name;
    let fastenerClass: FastenerClass<F> | null = null;
    context.addInitializer(function (this: F extends Fastener<infer O> ? O : never): void {
      const fastenerField = FastenerContext.getFastenerField.call(this, fastenerName);
      fastenerClass = FastenerContext.initializeFastenerClass.call(this, baseClass, template, fastenerName, fastenerField, fastenerClass) as FastenerClass<F>;
      this[fastenerField] = void 0;
    });
    return function (this: F extends Fastener<infer O> ? O : never): F {
      const fastenerField = FastenerContext.getFastenerField.call(this, fastenerName);
      let fastener = this[fastenerField] as F | undefined;
      if (fastener === void 0) {
        fastener = fastenerClass!.create(this);
        this[fastenerField] = fastener;
        if (this.attachFastener !== void 0) {
          (this as FastenerContext).attachFastener!(fastener);
        }
      }
      return fastener;
    };
  };

  FastenerContext.initializeFastenerClass = function <F extends Fastener<any>>(this: F extends Fastener<infer O> ? O : never, baseClass: FastenerClass, template: F extends {readonly descriptorType?: Proto<infer D>} ? ThisType<F> & D & Partial<Omit<F, keyof D>> : never, fastenerName: string | symbol, fastenerField: string | symbol, fastenerClass: FastenerClass<F> | null): FastenerClass<F> {
    const contextClass = FastenerContext.getContextClass(this);
    const fastenerClassMap = contextClass[FastenerClassMap];
    const superFastenerClass = fastenerClassMap[fastenerField];
    if (fastenerClass === null) {
      fastenerClass = baseClass.define(fastenerName, template, superFastenerClass);
    }
    if (superFastenerClass !== fastenerClass) {
      fastenerClassMap[fastenerField] = fastenerClass;
      if (superFastenerClass === void 0) {
        contextClass[FastenerNames].push(fastenerField);
      }
    }
    return fastenerClass;
  };

  FastenerContext.getFastenerField = function (this: object, fastenerName: string | symbol): string | symbol {
    const contextClass = FastenerContext.getContextClass(this);
    const fastenerFieldMap = contextClass[FastenerFieldMap];
    let fastenerField = fastenerFieldMap[fastenerName];
    if (fastenerField === void 0) {
      fastenerField = Symbol(fastenerName.toString());
      fastenerFieldMap[fastenerName] = fastenerField;
    }
    return fastenerField;
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

  return FastenerContext;
})();
