// Copyright 2015-2022 Swim.inc
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

import type {Mutable, Proto, ObserverType} from "@swim/util";
import {Affinity} from "../fastener/Affinity";
import {FastenerOwner, FastenerFlags, Fastener} from "../fastener/Fastener";
import type {AnyComponent, Component} from "./Component";
import {ComponentRelationInit, ComponentRelationClass, ComponentRelation} from "./ComponentRelation";

/** @internal */
export type ComponentSetType<F extends ComponentSet<any, any>> =
  F extends ComponentSet<any, infer C> ? C : never;

/** @public */
export interface ComponentSetInit<C extends Component = Component> extends ComponentRelationInit<C> {
  extends?: {prototype: ComponentSet<any, any>} | string | boolean | null;
  key?(component: C): string | undefined;
  compare?(a: C, b: C): number;

  sorted?: boolean;
  willSort?(parent: Component | null): void;
  didSort?(parent: Component | null): void;
  sortChildren?(parent: Component): void;
  compareChildren?(a: Component, b: Component): number;

  willInherit?(superFastener: ComponentSet<unknown, C>): void;
  didInherit?(superFastener: ComponentSet<unknown, C>): void;
  willUninherit?(superFastener: ComponentSet<unknown, C>): void;
  didUninherit?(superFastener: ComponentSet<unknown, C>): void;

  willBindSuperFastener?(superFastener: ComponentSet<unknown, C>): void;
  didBindSuperFastener?(superFastener: ComponentSet<unknown, C>): void;
  willUnbindSuperFastener?(superFastener: ComponentSet<unknown, C>): void;
  didUnbindSuperFastener?(superFastener: ComponentSet<unknown, C>): void;
}

/** @public */
export type ComponentSetDescriptor<O = unknown, C extends Component = Component, I = {}> = ThisType<ComponentSet<O, C> & I> & ComponentSetInit<C> & Partial<I>;

/** @public */
export interface ComponentSetClass<F extends ComponentSet<any, any> = ComponentSet<any, any>> extends ComponentRelationClass<F> {
  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface ComponentSetFactory<F extends ComponentSet<any, any> = ComponentSet<any, any>> extends ComponentSetClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): ComponentSetFactory<F> & I;

  define<O, C extends Component = Component>(className: string, descriptor: ComponentSetDescriptor<O, C>): ComponentSetFactory<ComponentSet<any, C>>;
  define<O, C extends Component = Component>(className: string, descriptor: {observes: boolean} & ComponentSetDescriptor<O, C, ObserverType<C>>): ComponentSetFactory<ComponentSet<any, C>>;
  define<O, C extends Component = Component, I = {}>(className: string, descriptor: {implements: unknown} & ComponentSetDescriptor<O, C, I>): ComponentSetFactory<ComponentSet<any, C> & I>;
  define<O, C extends Component = Component, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & ComponentSetDescriptor<O, C, I & ObserverType<C>>): ComponentSetFactory<ComponentSet<any, C> & I>;

  <O, C extends Component = Component>(descriptor: ComponentSetDescriptor<O, C>): PropertyDecorator;
  <O, C extends Component = Component>(descriptor: {observes: boolean} & ComponentSetDescriptor<O, C, ObserverType<C>>): PropertyDecorator;
  <O, C extends Component = Component, I = {}>(descriptor: {implements: unknown} & ComponentSetDescriptor<O, C, I>): PropertyDecorator;
  <O, C extends Component = Component, I = {}>(descriptor: {implements: unknown; observes: boolean} & ComponentSetDescriptor<O, C, I & ObserverType<C>>): PropertyDecorator;
}

/** @public */
export interface ComponentSet<O = unknown, C extends Component = Component> extends ComponentRelation<O, C> {
  (component: AnyComponent<C>): O;

  /** @override */
  get fastenerType(): Proto<ComponentSet<any, any>>;

  /** @internal @override */
  setInherited(inherited: boolean, superFastener: ComponentSet<unknown, C>): void;

  /** @internal */
  syncInherited(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  willInherit(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onInherit(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didInherit(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  willUninherit(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onUninherit(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didUninherit(superFastener: ComponentSet<unknown, C>): void;

  /** @override */
  readonly superFastener: ComponentSet<unknown, C> | null;

  /** @internal @override */
  getSuperFastener(): ComponentSet<unknown, C> | null;

  /** @protected @override */
  willBindSuperFastener(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onBindSuperFastener(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didBindSuperFastener(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  willUnbindSuperFastener(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onUnbindSuperFastener(superFastener: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didUnbindSuperFastener(superFastener: ComponentSet<unknown, C>): void;

  /** @internal */
  readonly subFasteners: ReadonlyArray<ComponentSet<unknown, C>> | null;

  /** @internal @override */
  attachSubFastener(subFastener: ComponentSet<unknown, C>): void;

  /** @internal @override */
  detachSubFastener(subFastener: ComponentSet<unknown, C>): void;

  /** @internal */
  readonly components: {readonly [componentId: number]: C | undefined};

  readonly componentCount: number;

  hasComponent(component: Component): boolean;

  addComponent(component?: AnyComponent<C>, target?: Component | null, key?: string): C;

  attachComponent(component?: AnyComponent<C>, target?: Component | null): C;

  detachComponent(component: C): C | null;

  insertComponent(parent?: Component | null, component?: AnyComponent<C>, target?: Component | null, key?: string): C;

  removeComponent(component: C): C | null;

  deleteComponent(component: C): C | null;

  /** @internal @override */
  bindComponent(component: Component, target: Component | null): void;

  /** @internal @override */
  unbindComponent(component: Component): void;

  /** @override */
  detectComponent(component: Component): C | null;

  /** @internal @protected */
  decohereSubFasteners(): void;

  /** @internal @protected */
  decohereSubFastener(subFastener: ComponentSet<unknown, C>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  key(component: C): string | undefined;

  get sorted(): boolean;

  /** @internal */
  initSorted(sorted: boolean): void;

  sort(sorted?: boolean): this;

  /** @protected */
  willSort(parent: Component | null): void;

  /** @protected */
  onSort(parent: Component | null): void;

  /** @protected */
  didSort(parent: Component | null): void;

  /** @internal @protected */
  sortChildren(parent: Component): void;

  /** @internal */
  compareChildren(a: Component, b: Component): number;

  /** @internal @protected */
  compare(a: C, b: C): number;
}

/** @public */
export const ComponentSet = (function (_super: typeof ComponentRelation) {
  const ComponentSet: ComponentSetFactory = _super.extend("ComponentSet");

  Object.defineProperty(ComponentSet.prototype, "fastenerType", {
    get: function (this: ComponentSet): Proto<ComponentSet<any, any>> {
      return ComponentSet;
    },
    configurable: true,
  });

  ComponentSet.prototype.syncInherited = function (this: ComponentSet, superFastener: ComponentSet): void {
    const components = this.components;
    const superComponents = superFastener.components;
    for (const componentId in components) {
      if (superComponents[componentId] === void 0) {
        this.detachComponent(components[componentId]!);
      }
    }
    for (const componentId in superComponents) {
      if (components[componentId] === void 0) {
        this.attachComponent(superComponents[componentId]);
      }
    }
  };

  ComponentSet.prototype.onInherit = function (this: ComponentSet, superFastener: ComponentSet): void {
    this.syncInherited(superFastener);
  };

  ComponentSet.prototype.onBindSuperFastener = function <C extends Component>(this: ComponentSet<unknown, C>, superFastener: ComponentSet<unknown, C>): void {
    (this as Mutable<typeof this>).superFastener = superFastener;
    _super.prototype.onBindSuperFastener.call(this, superFastener);
  };

  ComponentSet.prototype.onUnbindSuperFastener = function <C extends Component>(this: ComponentSet<unknown, C>, superFastener: ComponentSet<unknown, C>): void {
    _super.prototype.onUnbindSuperFastener.call(this, superFastener);
    (this as Mutable<typeof this>).superFastener = null;
  };

  ComponentSet.prototype.attachSubFastener = function <C extends Component>(this: ComponentSet<unknown, C>, subFastener: ComponentSet<unknown, C>): void {
    let subFasteners = this.subFasteners as ComponentSet<unknown, C>[] | null;
    if (subFasteners === null) {
      subFasteners = [];
      (this as Mutable<typeof this>).subFasteners = subFasteners;
    }
    subFasteners.push(subFastener);
  };

  ComponentSet.prototype.detachSubFastener = function <C extends Component>(this: ComponentSet<unknown, C>, subFastener: ComponentSet<unknown, C>): void {
    const subFasteners = this.subFasteners as ComponentSet<unknown, C>[] | null;
    if (subFasteners !== null) {
      const index = subFasteners.indexOf(subFastener);
      if (index >= 0) {
        subFasteners.splice(index, 1);
      }
    }
  };

  ComponentSet.prototype.hasComponent = function (this: ComponentSet, component: Component): boolean {
    return this.components[component.uid] !== void 0;
  };

  ComponentSet.prototype.addComponent = function <C extends Component>(this: ComponentSet<unknown, C>, newComponent?: AnyComponent<C>, target?: Component | null, key?: string): C {
    if (newComponent !== void 0 && newComponent !== null) {
      newComponent = this.fromAny(newComponent);
    } else {
      newComponent = this.createComponent();
    }
    if (target === void 0) {
      target = null;
    }
    let parent: Component | null;
    if (this.binds && (parent = this.parentComponent, parent !== null)) {
      if (key === void 0) {
        key = this.key(newComponent);
      }
      this.insertChild(parent, newComponent, target, key);
    }
    const components = this.components as {[comtrollerId: number]: C | undefined};
    if (components[newComponent.uid] === void 0) {
      components[newComponent.uid] = newComponent;
      (this as Mutable<typeof this>).componentCount += 1;
      this.willAttachComponent(newComponent, target);
      this.onAttachComponent(newComponent, target);
      this.initComponent(newComponent);
      this.didAttachComponent(newComponent, target);
      this.setCoherent(true);
      this.decohereSubFasteners();
    }
    return newComponent;
  };

  ComponentSet.prototype.attachComponent = function <C extends Component>(this: ComponentSet<unknown, C>, newComponent?: AnyComponent<C>, target?: Component | null): C {
    if (newComponent !== void 0 && newComponent !== null) {
      newComponent = this.fromAny(newComponent);
    } else {
      newComponent = this.createComponent();
    }
    const components = this.components as {[comtrollerId: number]: C | undefined};
    if (components[newComponent.uid] === void 0) {
      if (target === void 0) {
        target = null;
      }
      components[newComponent.uid] = newComponent;
      (this as Mutable<typeof this>).componentCount += 1;
      this.willAttachComponent(newComponent, target);
      this.onAttachComponent(newComponent, target);
      this.initComponent(newComponent);
      this.didAttachComponent(newComponent, target);
      this.setCoherent(true);
      this.decohereSubFasteners();
    }
    return newComponent;
  };

  ComponentSet.prototype.detachComponent = function <C extends Component>(this: ComponentSet<unknown, C>, oldComponent: C): C | null {
    const components = this.components as {[comtrollerId: number]: C | undefined};
    if (components[oldComponent.uid] !== void 0) {
      (this as Mutable<typeof this>).componentCount -= 1;
      delete components[oldComponent.uid];
      this.willDetachComponent(oldComponent);
      this.onDetachComponent(oldComponent);
      this.deinitComponent(oldComponent);
      this.didDetachComponent(oldComponent);
      this.setCoherent(true);
      this.decohereSubFasteners();
      return oldComponent;
    }
    return null;
  };

  ComponentSet.prototype.insertComponent = function <C extends Component>(this: ComponentSet<unknown, C>, parent?: Component | null, newComponent?: AnyComponent<C>, target?: Component | null, key?: string): C {
    if (newComponent !== void 0 && newComponent !== null) {
      newComponent = this.fromAny(newComponent);
    } else {
      newComponent = this.createComponent();
    }
    if (parent === void 0 || parent === null) {
      parent = this.parentComponent;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.key(newComponent);
    }
    if (parent !== null && (newComponent.parent !== parent || newComponent.key !== key)) {
      this.insertChild(parent, newComponent, target, key);
    }
    const components = this.components as {[comtrollerId: number]: C | undefined};
    if (components[newComponent.uid] === void 0) {
      components[newComponent.uid] = newComponent;
      (this as Mutable<typeof this>).componentCount += 1;
      this.willAttachComponent(newComponent, target);
      this.onAttachComponent(newComponent, target);
      this.initComponent(newComponent);
      this.didAttachComponent(newComponent, target);
      this.setCoherent(true);
      this.decohereSubFasteners();
    }
    return newComponent;
  };

  ComponentSet.prototype.removeComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: C): C | null {
    if (this.hasComponent(component)) {
      component.remove();
      return component;
    }
    return null;
  };

  ComponentSet.prototype.deleteComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: C): C | null {
    const oldComponent = this.detachComponent(component);
    if (oldComponent !== null) {
      oldComponent.remove();
    }
    return oldComponent;
  };

  ComponentSet.prototype.bindComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: Component, target: Component | null): void {
    if (this.binds) {
      const newComponent = this.detectComponent(component);
      const components = this.components as {[comtrollerId: number]: C | undefined};
      if (newComponent !== null && components[newComponent.uid] === void 0) {
        components[newComponent.uid] = newComponent;
        (this as Mutable<typeof this>).componentCount += 1;
        this.willAttachComponent(newComponent, target);
        this.onAttachComponent(newComponent, target);
        this.initComponent(newComponent);
        this.didAttachComponent(newComponent, target);
        this.setCoherent(true);
        this.decohereSubFasteners();
      }
    }
  };

  ComponentSet.prototype.unbindComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: Component): void {
    if (this.binds) {
      const oldComponent = this.detectComponent(component);
      const components = this.components as {[comtrollerId: number]: C | undefined};
      if (oldComponent !== null && components[oldComponent.uid] !== void 0) {
        (this as Mutable<typeof this>).componentCount -= 1;
        delete components[oldComponent.uid];
        this.willDetachComponent(oldComponent);
        this.onDetachComponent(oldComponent);
        this.deinitComponent(oldComponent);
        this.didDetachComponent(oldComponent);
        this.setCoherent(true);
        this.decohereSubFasteners();
      }
    }
  };

  ComponentSet.prototype.detectComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: Component): C | null {
    if (typeof this.type === "function" && component instanceof this.type) {
      return component as C;
    }
    return null;
  };

  ComponentSet.prototype.decohereSubFasteners = function (this: ComponentSet): void {
    const subFasteners = this.subFasteners;
    for (let i = 0, n = subFasteners !== null ? subFasteners.length : 0; i < n; i += 1) {
      this.decohereSubFastener(subFasteners![i]!);
    }
  };

  ComponentSet.prototype.decohereSubFastener = function (this: ComponentSet, subFastener: ComponentSet): void {
    if ((subFastener.flags & Fastener.InheritedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (subFastener.flags & Affinity.Mask)) {
      subFastener.setInherited(true, this);
    } else if ((subFastener.flags & Fastener.InheritedFlag) !== 0 && (subFastener.flags & Fastener.DecoherentFlag) === 0) {
      subFastener.setCoherent(false);
      subFastener.decohere();
    }
  };

  ComponentSet.prototype.recohere = function (this: ComponentSet, t: number): void {
    if ((this.flags & Fastener.InheritedFlag) !== 0) {
      const superFastener = this.superFastener;
      if (superFastener !== null) {
        this.syncInherited(superFastener);
      }
    }
  };

  ComponentSet.prototype.key = function <C extends Component>(this: ComponentSet<unknown, C>, component: C): string | undefined {
    return void 0;
  };

  Object.defineProperty(ComponentSet.prototype, "sorted", {
    get(this: ComponentSet): boolean {
      return (this.flags & ComponentSet.SortedFlag) !== 0;
    },
    configurable: true,
  });

  ComponentSet.prototype.initSorted = function (this: ComponentSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | ComponentSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ComponentSet.SortedFlag;
    }
  };

  ComponentSet.prototype.sort = function (this: ComponentSet, sorted?: boolean): typeof this {
    if (sorted === void 0) {
      sorted = true;
    }
    const flags = this.flags;
    if (sorted && (flags & ComponentSet.SortedFlag) === 0) {
      const parent = this.parentComponent;
      this.willSort(parent);
      this.setFlags(flags | ComponentSet.SortedFlag);
      this.onSort(parent);
      this.didSort(parent);
    } else if (!sorted && (flags & ComponentSet.SortedFlag) !== 0) {
      this.setFlags(flags & ~ComponentSet.SortedFlag);
    }
    return this;
  };

  ComponentSet.prototype.willSort = function (this: ComponentSet, parent: Component | null): void {
    // hook
  };

  ComponentSet.prototype.onSort = function (this: ComponentSet, parent: Component | null): void {
    if (parent !== null) {
      this.sortChildren(parent);
    }
  };

  ComponentSet.prototype.didSort = function (this: ComponentSet, parent: Component | null): void {
    // hook
  };

  ComponentSet.prototype.sortChildren = function <C extends Component>(this: ComponentSet<unknown, C>, parent: Component): void {
    parent.sortChildren(this.compareChildren.bind(this));
  };

  ComponentSet.prototype.compareChildren = function <C extends Component>(this: ComponentSet<unknown, C>, a: Component, b: Component): number {
    const components = this.components;
    const x = components[a.uid];
    const y = components[b.uid];
    if (x !== void 0 && y !== void 0) {
      return this.compare(x, y);
    } else {
      return x !== void 0 ? 1 : y !== void 0 ? -1 : 0;
    }
  };

  ComponentSet.prototype.compare = function <C extends Component>(this: ComponentSet<unknown, C>, a: C, b: C): number {
    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
  };

  ComponentSet.construct = function <F extends ComponentSet<any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newComponent: AnyComponent<ComponentSetType<F>>): FastenerOwner<F> {
        fastener!.addComponent(newComponent);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, fastenerClass.prototype);
    }
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    Object.defineProperty(fastener, "superFastener", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).subFasteners = null;
    (fastener as Mutable<typeof fastener>).components = {};
    (fastener as Mutable<typeof fastener>).componentCount = 0;
    return fastener;
  };

  ComponentSet.define = function <O, C extends Component>(className: string, descriptor: ComponentSetDescriptor<O, C>): ComponentSetFactory<ComponentSet<any, C>> {
    let superClass = descriptor.extends as ComponentSetFactory | null | undefined;
    const affinity = descriptor.affinity;
    const inherits = descriptor.inherits;
    const sorted = descriptor.sorted;
    delete descriptor.extends;
    delete descriptor.implements;
    delete descriptor.affinity;
    delete descriptor.inherits;
    delete descriptor.sorted;

    if (superClass === void 0 || superClass === null) {
      superClass = this;
    }

    const fastenerClass = superClass.extend(className, descriptor);

    fastenerClass.construct = function (fastenerClass: {prototype: ComponentSet<any, any>}, fastener: ComponentSet<O, C> | null, owner: O): ComponentSet<O, C> {
      fastener = superClass!.construct(fastenerClass, fastener, owner);
      if (affinity !== void 0) {
        fastener.initAffinity(affinity);
      }
      if (inherits !== void 0) {
        fastener.initInherits(inherits);
      }
      if (sorted !== void 0) {
        fastener.initSorted(sorted);
      }
      return fastener;
    };

    return fastenerClass;
  };

  (ComponentSet as Mutable<typeof ComponentSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (ComponentSet as Mutable<typeof ComponentSet>).FlagShift = _super.FlagShift + 1;
  (ComponentSet as Mutable<typeof ComponentSet>).FlagMask = (1 << ComponentSet.FlagShift) - 1;

  return ComponentSet;
})(ComponentRelation);
