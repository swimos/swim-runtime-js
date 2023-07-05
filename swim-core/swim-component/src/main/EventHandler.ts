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
import {Objects} from "@swim/util";
import type {FastenerFlags} from "./Fastener";
import type {FastenerDescriptor} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";
import type {Component} from "./Component";

/** @public */
export interface EventHandlerDescriptor<T extends EventTarget = EventTarget> extends FastenerDescriptor {
  extends?: Proto<EventHandler> | boolean | null;
  type?: string | readonly string[];
  target?: T | null;
  options?: AddEventListenerOptions;
  disabled?: boolean;
  bindsOwner?: boolean;
  binds?: boolean;
}

/** @public */
export interface EventHandlerClass<F extends EventHandler = EventHandler> extends FastenerClass<F> {
  /** @internal */
  readonly DisabledFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface EventHandler<O = any, T extends EventTarget = any> extends Fastener<O>, EventListener {
  /** @override */
  (event: Event): void;

  /** @override */
  get descriptorType(): Proto<EventHandlerDescriptor<T>>;

  /** @override */
  get fastenerType(): Proto<EventHandler>;

  initType(): string | undefined;

  readonly type?: string | readonly string[]; // prototype property

  /** @internal */
  readonly options?: AddEventListenerOptions; // optional prototype property

  /** @internal */
  readonly bindsOwner?: boolean; // optional prototype property

  initTarget(): T | null | undefined;

  readonly target: T | null;

  getTarget(): T;

  setTarget(target: T | null): T | null;

  /** @protected */
  willAttachTarget(target: T): void;

  /** @protected */
  onAttachTarget(target: T): void;

  /** @protected */
  didAttachTarget(target: T): void;

  /** @protected */
  willDetachTarget(target: T): void;

  /** @protected */
  onDetachTarget(target: T): void;

  /** @protected */
  didDetachTarget(target: T): void;

  /** @protected */
  attachEvents(target: T): void;

  /** @protected */
  detachEvents(target: T): void;

  /** @internal */
  initDisabled(disabled: boolean): void;

  /** @protected */
  handle(event: Event): void;

  get disabled(): boolean;

  disable(disabled?: boolean): this;

  /** @protected */
  willDisable(): void;

  /** @protected */
  onDisable(): void;

  /** @protected */
  didDisable(): void;

  /** @protected */
  willEnable(): void;

  /** @protected */
  onEnable(): void;

  /** @protected */
  didEnable(): void;

  /** @internal */
  bindComponent(component: Component, target?: Component | null): void;

  /** @internal */
  unbindComponent(component: Component): void;

  detectComponent(component: Component): T | null;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const EventHandler = (<O, T extends EventTarget, F extends EventHandler>() => Fastener.extend<EventHandler<O, T>, EventHandlerClass<F>>("EventHandler", {
  get fastenerType(): Proto<EventHandler> {
    return EventHandler;
  },

  handle(event: Event): void {
    // hook
  },

  initType(): string | undefined {
    return void 0;
  },

  initTarget(): T | null | undefined {
    let target: T | null | undefined = (Object.getPrototypeOf(this) as EventHandler).target;
    if (target === void 0) {
      const owner = this.owner as EventTarget;
      if (Objects.hasAllKeys<T>(owner, "addEventListener", "removeEventListener")) {
        target = owner;
      }
    }
    return target;
  },

  getTarget(): T {
    const target = this.target;
    if (target === null) {
      throw new TypeError("null " + this.name.toString() + " event target");
    }
    return target;
  },

  setTarget(newTarget: T | null): T | null {
    const oldTarget = this.target;
    if (oldTarget === newTarget) {
      return oldTarget;
    } else if (oldTarget !== null) {
      (this as Mutable<typeof this>).target = null;
      this.willDetachTarget(oldTarget);
      this.onDetachTarget(oldTarget);
      this.didDetachTarget(oldTarget);
    }
    if (newTarget !== null) {
      (this as Mutable<typeof this>).target = newTarget;
      this.willAttachTarget(newTarget);
      this.onAttachTarget(newTarget);
      this.didAttachTarget(newTarget);
    }
    return oldTarget;
  },

  willAttachTarget(target: T): void {
    // hook
  },

  onAttachTarget(target: T): void {
    if ((this.flags & (Fastener.MountedFlag | EventHandler.DisabledFlag)) === Fastener.MountedFlag) {
      this.attachEvents(target);
    }
  },

  didAttachTarget(target: T): void {
    // hook
  },

  willDetachTarget(target: T): void {
    // hook
  },

  onDetachTarget(target: T): void {
    if ((this.flags & (Fastener.MountedFlag | EventHandler.DisabledFlag)) === Fastener.MountedFlag) {
      this.detachEvents(target);
    }
  },

  didDetachTarget(target: T): void {
    // hook
  },

  attachEvents(target: T): void {
    const type = this.type;
    if (typeof type === "string") {
      target.addEventListener(type, this, this.options);
    } else if (type !== void 0) {
      for (let i = 0, n = type.length; i < n; i += 1) {
        target.addEventListener(type[i]!, this, this.options);
      }
    }
  },

  detachEvents(target: T): void {
    const type = this.type;
    if (typeof type === "string") {
      target.removeEventListener(type, this, this.options);
    } else if (type !== void 0) {
      for (let i = 0, n = type.length; i < n; i += 1) {
        target.removeEventListener(type[i]!, this, this.options);
      }
    }
  },

  initDisabled(disabled: boolean): void {
    if (disabled) {
      (this as Mutable<typeof this>).flags = this.flags | EventHandler.DisabledFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~EventHandler.DisabledFlag;
    }
  },

  get disabled(): boolean {
    return (this.flags & EventHandler.DisabledFlag) !== 0;
  },

  disable(disabled?: boolean): typeof this {
    if (disabled === void 0) {
      disabled = true;
    }
    if (disabled === ((this.flags & EventHandler.DisabledFlag) !== 0)) {
      return this;
    } else if (disabled) {
      this.willDisable();
      this.setFlags(this.flags | EventHandler.DisabledFlag);
      this.onDisable();
      this.didDisable();
    } else {
      this.willEnable();
      this.setFlags(this.flags & ~EventHandler.DisabledFlag);
      this.onEnable();
      this.didEnable();
    }
    return this;
  },

  willDisable(): void {
    // hook
  },

  onDisable(): void {
    const target = this.target;
    if (target !== null && (this.flags & Fastener.MountedFlag) !== 0) {
      this.detachEvents(target);
    }
  },

  didDisable(): void {
    // hook
  },

  willEnable(): void {
    // hook
  },

  onEnable(): void {
    const target = this.target;
    if (target !== null && (this.flags & Fastener.MountedFlag) !== 0) {
      this.attachEvents(target);
    }
  },

  didEnable(): void {
    // hook
  },

  bindComponent(component: Component): void {
    if (!this.binds || this.target !== null) {
      return;
    }
    const target = this.detectComponent(component);
    if (target !== null) {
      this.setTarget(target);
    }
  },

  unbindComponent(component: Component): void {
    if (!this.binds) {
      return;
    }
    const target = this.detectComponent(component);
    if (target !== null && target === this.target) {
      this.setTarget(null);
    }
  },

  detectComponent(component: Component): T | null {
    return null;
  },

  onMount(): void {
    super.onMount();
    const target = this.target;
    if (target !== null && (this.flags & EventHandler.DisabledFlag) === 0) {
      this.attachEvents(target);
    }
  },

  onUnmount(): void {
    super.onUnmount();
    const target = this.target;
    if (target !== null && (this.flags & EventHandler.DisabledFlag) === 0) {
      this.detachEvents(target);
    }
  },
},
{
  create(owner: F extends Fastener<infer O> ? O : never): F {
    const fastener = super.create(owner) as F;
    if (fastener.target === null && fastener.bindsOwner === true &&
        (owner as EventTarget).addEventListener !== void 0 &&
        (owner as EventTarget).removeEventListener !== void 0) {
      fastener.setTarget(owner);
    }
    return fastener;
  },

  construct(fastener: F | null, owner: F extends Fastener<infer O> ? O : never): F {
    if (fastener === null) {
      fastener = function (event: Event): void {
        fastener!.handle(event);
      } as F;
      Object.defineProperty(fastener, "name", {
        value: this.prototype.name,
        enumerable: true,
        configurable: true,
      });
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = super.construct(fastener, owner) as F;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initDisabled((flagsInit & EventHandler.DisabledFlag) !== 0);
    }
    const type = fastener.initType();
    if (type !== void 0) {
      Object.defineProperty(fastener, "type", {
        value: type,
        enumerable: true,
        configurable: true,
      });
    }
    Object.defineProperty(fastener, "target", {
      value: fastener.initTarget(),
      enumerable: true,
      configurable: true,
    });
    return fastener;
  },

  refine(fastenerClass: EventHandlerClass<any>): void {
    super.refine(fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "disabled")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.disabled) {
        flagsInit |= EventHandler.DisabledFlag;
      } else {
        flagsInit &= ~EventHandler.DisabledFlag;
      }
      delete (fastenerPrototype as EventHandlerDescriptor).disabled;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        enumerable: true,
        configurable: true,
      });
    }
  },

  DisabledFlag: 1 << (Fastener.FlagShift + 0),

  FlagShift: Fastener.FlagShift + 1,
  FlagMask: (1 << (Fastener.FlagShift + 1)) - 1,
}))();
