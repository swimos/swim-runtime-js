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
import type {FastenerOwner} from "./Fastener";
import type {FastenerDecorator} from "./Fastener";
import type {FastenerTemplate} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import type {Fastener} from "./Fastener";

/** @internal */
export const FastenerClassCache: unique symbol = Symbol("FastenerClassCache");

/** @internal */
export const FastenerNameCache: unique symbol = Symbol("FastenerNameCache");

/** @public */
export interface FastenerContextClass<F extends Fastener<any> = Fastener<any>> {
  /** @internal */
  [FastenerClassCache]: {[fastenerName: string | symbol]: FastenerClass<F> | undefined};
  /** @internal */
  [FastenerNameCache]: (string | symbol)[];
}

/** @public */
export interface FastenerContext {
  getParentFastener<F extends Fastener<unknown>>(fastenerName: string | symbol, fastenerType: Proto<F>, contextType?: Proto<unknown> | null): F | null;

  decohereFastener?(fastener: Fastener): void;

  requireUpdate?(updateFlags: number): void;
}

/** @public */
export const FastenerContext = (function () {
  const FastenerContext = {} as {
    getContextClass<F extends Fastener<any>>(owner: FastenerOwner<F>): FastenerContextClass<F>;

    getFastenerNames<T extends FastenerContext>(owner: T): readonly (keyof T)[];

    createFastenerClass<F extends Fastener<any>>(fastenerName: string | symbol, baseClass: FastenerClass, template: FastenerTemplate<F>, superFastener: F | undefined): FastenerClass<F>;

    decorator<F extends Fastener<any>>(baseClass: FastenerClass, template: FastenerTemplate<F>): FastenerDecorator<F>;

    decorate<F extends Fastener<any>, T extends FastenerOwner<F>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value: F | undefined) => F;

    [Symbol.hasInstance](instance: unknown): instance is FastenerContext;
  };

  FastenerContext.getContextClass = function <F extends Fastener<any>>(owner: FastenerOwner<F>): FastenerContextClass<F> {
    const contextClass = owner.constructor as FastenerContextClass<F>;
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerClassCache)) {
      Object.defineProperty(contextClass, FastenerClassCache, {
        value: Object.create(null),
        configurable: true,
      });
    }
    if (!Object.prototype.hasOwnProperty.call(contextClass, FastenerNameCache)) {
      Object.defineProperty(contextClass, FastenerNameCache, {
        value: [],
        configurable: true,
      });
    }
    return contextClass;
  };

  FastenerContext.getFastenerNames = function <T extends FastenerContext>(owner: T): readonly (keyof T)[] {
    return FastenerContext.getContextClass(owner)[FastenerNameCache] as (keyof T)[];
  };

  FastenerContext.createFastenerClass = function <F extends Fastener<any>>(fastenerName: string | symbol, baseClass: FastenerClass, template: FastenerTemplate<F>, superFastener: F | undefined): FastenerClass<F> {
    if (template.extends === true) {
      const superFastenerPrototype = superFastener !== void 0 ? Object.getPrototypeOf(superFastener) : null;
      const superFastenerClass = superFastenerPrototype !== null ? superFastenerPrototype.constructor : null;
      Object.defineProperty(template, "extends", {
        value: superFastenerClass,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else if (template.extends === false) {
      Object.defineProperty(template, "extends", {
        value: null,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    return baseClass.define(fastenerName, template);
  };

  FastenerContext.decorator = function <F extends Fastener<any>>(baseClass: FastenerClass, template: FastenerTemplate<F>): FastenerDecorator<F> {
    return FastenerContext.decorate.bind(FastenerContext, baseClass, template) as unknown as FastenerDecorator<F>;
  };

  FastenerContext.decorate = function <F extends Fastener<any>, T extends FastenerOwner<F>>(baseClass: FastenerClass, template: FastenerTemplate<F>, target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, superFastener: F | undefined) => F {
    let fastenerClass: FastenerClass<F> | undefined;
    return function (this: T, superFastener: F | undefined): F {
      if (fastenerClass === void 0) {
        if (superFastener === void 0) {
          superFastener = context.access.get(this);
        }
        fastenerClass = FastenerContext.createFastenerClass(context.name, baseClass, template, superFastener);
      }

      const contextClass = FastenerContext.getContextClass(this);
      const fastenerClasses = contextClass[FastenerClassCache];
      if (!(context.name in fastenerClasses)) {
        fastenerClasses[context.name] = fastenerClass;
        contextClass[FastenerNameCache].push(context.name);
      }

      return fastenerClass.create(this);
    };
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
