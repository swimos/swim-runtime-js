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
import type {Timing} from "@swim/util";
import type {FastenerTemplate} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import type {Fastener} from "./Fastener";

/** @public */
export interface FastenerContext {
  getFastener?<F extends Fastener<any, any, any>>(fastenerName: PropertyKey, fastenerType?: Proto<F>, contextType?: Proto<any> | null): F | null;

  getParentFastener?<F extends Fastener<any, any, any>>(fastenerName: PropertyKey, fastenerType?: Proto<F>, contextType?: Proto<any> | null): F | null;

  attachFastener?(fastener: Fastener<any, any, any>): void;

  decohereFastener?(fastener: Fastener<any, any, any>): void;

  requireUpdate?(updateFlags: number): void;

  getTransition?(fastener: Fastener<any, any, any>): Timing | null;
}

/** @public */
export class FastenerContextMetaclass<R> {
  constructor() {
    this.classMap = {};
    this.slotMap = {};
    this.slots = [];
  }

  /** @internal */
  readonly classMap: {[fastenerName: PropertyKey]: FastenerClass<any> | undefined};

  /** @internal */
  readonly slotMap: {[fastenerName: PropertyKey]: keyof R | undefined};

  /** @internal */
  readonly slots: (keyof R)[];

  /** @internal */
  initFastenerClass<F extends Fastener<R, any, any>>(baseClass: FastenerClass<any>, template: FastenerTemplate<F>,
                                                     fastenerName: keyof R, fastenerSlot: keyof R,
                                                     fastenerClass: FastenerClass<F> | null): FastenerClass<F> {
    const fastenerSuperclass = this.classMap[fastenerName];
    if (fastenerClass === null) {
      fastenerClass = baseClass.define(fastenerName, template, fastenerSuperclass);
    }
    if (fastenerSuperclass !== fastenerClass) {
      this.classMap[fastenerName] = fastenerClass;
      this.slotMap[fastenerName] = fastenerSlot;
      if (fastenerSuperclass === void 0) {
        this.slots.push(fastenerSlot);
      }
    }
    return fastenerClass;
  }

  getFastenerClass<K extends keyof R>(fastenerName: K): R[K] extends Fastener<any, any, any> ? FastenerClass<R[K]> | null : null {
    const fastenerClass = this.classMap[fastenerName];
    return (fastenerClass !== void 0 ? fastenerClass : null) as R[K] extends Fastener<any, any, any> ? FastenerClass<R[K]> | null : null;
  }

  getFastenerSlot(fastenerName: PropertyKey): keyof R | undefined {
    return this.slotMap[fastenerName];
  }

  tryFastener<K extends keyof R, F extends R[K]>(owner: R, fastenerName: K): (F extends Fastener<any, any, any> ? F | null : never) | null {
    const fastenerSlot = this.slotMap[fastenerName];
    const fastener = fastenerSlot !== void 0 ? owner[fastenerSlot] : void 0;
    return (fastener !== void 0 ? fastener : null) as (F extends Fastener<any, any, any> ? F | null : never) | null;
  }

  /** @internal */
  static metaclasses: WeakMap<Proto<any>, FastenerContextMetaclass<any>> = new WeakMap();

  static get<R>(context: R): FastenerContextMetaclass<R> | null {
    const contextClass = (context as object).constructor;
    const contextMetaclass = this.metaclasses.get(contextClass);
    return contextMetaclass !== void 0 ? contextMetaclass : null;
  }

  /** @internal */
  static getOrCreate<R>(context: R): FastenerContextMetaclass<R> {
    const contextClass = (context as object).constructor;
    let contextMetaclass = this.metaclasses.get(contextClass);
    if (contextMetaclass === void 0) {
      contextMetaclass = new FastenerContextMetaclass<R>();
      this.metaclasses.set(contextClass, contextMetaclass);
    }
    return contextMetaclass;
  }
}
