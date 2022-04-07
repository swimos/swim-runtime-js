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
import {FastenerFlags, FastenerOwner, Fastener} from "../fastener/Fastener";
import type {AnyComponent, Component} from "./Component";
import {
  ComponentRelationRefinement,
  ComponentRelationTemplate,
  ComponentRelationClass,
  ComponentRelation,
} from "./ComponentRelation";

/** @public */
export interface ComponentSetRefinement extends ComponentRelationRefinement {
}

/** @public */
export type ComponentSetComponent<R extends ComponentSetRefinement | ComponentSet<any, any>, D = Component> =
  R extends {component: infer C} ? C :
  R extends {extends: infer E} ? ComponentSetComponent<E, D> :
  R extends ComponentSet<any, infer C> ? C :
  D;

/** @public */
export interface ComponentSetTemplate<C extends Component = Component> extends ComponentRelationTemplate<C> {
  extends?: Proto<ComponentSet<any, any>> | string | boolean | null;
  sorted?: boolean;
}

/** @public */
export interface ComponentSetClass<F extends ComponentSet<any, any> = ComponentSet<any, any>> extends ComponentRelationClass<F> {
  /** @override */
  specialize(className: string, template: ComponentSetTemplate): ComponentSetClass;

  /** @override */
  refine(fastenerClass: ComponentSetClass): void;

  /** @override */
  extend(className: string, template: ComponentSetTemplate): ComponentSetClass<F>;

  /** @override */
  specify<O, C extends Component = Component>(className: string, template: ThisType<ComponentSet<O, C>> & ComponentSetTemplate<C> & Partial<Omit<ComponentSet<O, C>, keyof ComponentSetTemplate>>): ComponentSetClass<F>;

  /** @override */
  <O, C extends Component = Component>(template: ThisType<ComponentSet<O, C>> & ComponentSetTemplate<C> & Partial<Omit<ComponentSet<O, C>, keyof ComponentSetTemplate>>): PropertyDecorator;

  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export type ComponentSetDef<O, R extends ComponentSetRefinement> =
  ComponentSet<O, ComponentSetComponent<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ComponentSetComponent<R> : B> : {});

/** @public */
export function ComponentSetDef<F extends ComponentSet<any, any>>(
  template: F extends ComponentSetDef<infer O, infer R>
          ? ThisType<ComponentSetDef<O, R>>
          & ComponentSetTemplate<ComponentSetComponent<R>>
          & Partial<Omit<ComponentSet<O, ComponentSetComponent<R>>, keyof ComponentSetTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ComponentSetTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ComponentSetComponent<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ComponentSet(template);
}

/** @public */
export interface ComponentSet<O = unknown, C extends Component = Component> extends ComponentRelation<O, C> {
  (component: AnyComponent<C>): O;

  /** @override */
  get fastenerType(): Proto<ComponentSet<any, any>>;

  /** @internal @override */
  getSuper(): ComponentSet<unknown, C> | null;

  /** @internal @override */
  setDerived(derived: boolean, inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  willDerive(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onDerive(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didDerive(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  willUnderive(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onUnderive(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didUnderive(inlet: ComponentSet<unknown, C>): void;

  /** @override */
  readonly inlet: ComponentSet<unknown, C> | null;

  /** @protected @override */
  willBindInlet(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onBindInlet(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didBindInlet(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ComponentSet<unknown, C>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ComponentSet<unknown, C>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<ComponentSet<unknown, C>> | null;

  /** @internal @override */
  attachOutlet(outlet: ComponentSet<unknown, C>): void;

  /** @internal @override */
  detachOutlet(outlet: ComponentSet<unknown, C>): void;

  /** @internal */
  readonly components: {readonly [componentId: number]: C | undefined};

  readonly componentCount: number;

  hasComponent(component: Component): boolean;

  addComponent(component?: AnyComponent<C>, target?: Component | null, key?: string): C;

  addComponents(components: {readonly [componentId: number]: C | undefined}, target?: Component | null): void;

  setComponents(components: {readonly [componentId: number]: C | undefined}, target?: Component | null): void;

  attachComponent(component?: AnyComponent<C>, target?: Component | null): C;

  attachComponents(components: {readonly [componentId: number]: C | undefined}, target?: Component | null): void;

  detachComponent(component: C): C | null;

  detachComponents(components?: {readonly [componentId: number]: C | undefined}): void;

  insertComponent(parent?: Component | null, component?: AnyComponent<C>, target?: Component | null, key?: string): C;

  insertComponents(parent: Component | null, components: {readonly [componentId: number]: C | undefined}, target?: Component | null): void;

  removeComponent(component: C): C | null;

  removeComponents(components?: {readonly [componentId: number]: C | undefined}): void;

  deleteComponent(component: C): C | null;

  deleteComponents(components?: {readonly [componentId: number]: C | undefined}): void;

  /** @internal @override */
  bindComponent(component: Component, target: Component | null): void;

  /** @internal @override */
  unbindComponent(component: Component): void;

  /** @override */
  detectComponent(component: Component): C | null;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: ComponentSet<unknown, C>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  componentKey(component: C): string | undefined;

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
  const ComponentSet = _super.extend("ComponentSet", {}) as ComponentSetClass;

  Object.defineProperty(ComponentSet.prototype, "fastenerType", {
    value: ComponentSet,
    configurable: true,
  });

  ComponentSet.prototype.onDerive = function (this: ComponentSet, inlet: ComponentSet): void {
    this.setComponents(inlet.components);
  };

  ComponentSet.prototype.onBindInlet = function <C extends Component>(this: ComponentSet<unknown, C>, inlet: ComponentSet<unknown, C>): void {
    (this as Mutable<typeof this>).inlet = inlet;
    _super.prototype.onBindInlet.call(this, inlet);
  };

  ComponentSet.prototype.onUnbindInlet = function <C extends Component>(this: ComponentSet<unknown, C>, inlet: ComponentSet<unknown, C>): void {
    _super.prototype.onUnbindInlet.call(this, inlet);
    (this as Mutable<typeof this>).inlet = null;
  };

  ComponentSet.prototype.attachOutlet = function <C extends Component>(this: ComponentSet<unknown, C>, outlet: ComponentSet<unknown, C>): void {
    let outlets = this.outlets as ComponentSet<unknown, C>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  ComponentSet.prototype.detachOutlet = function <C extends Component>(this: ComponentSet<unknown, C>, outlet: ComponentSet<unknown, C>): void {
    const outlets = this.outlets as ComponentSet<unknown, C>[] | null;
    if (outlets !== null) {
      const index = outlets.indexOf(outlet);
      if (index >= 0) {
        outlets.splice(index, 1);
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
        key = this.componentKey(newComponent);
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
      this.decohereOutlets();
    }
    return newComponent;
  };

  ComponentSet.prototype.addComponents = function <C extends Component>(this: ComponentSet, newComponents: {readonly [componentId: number]: C | undefined}, target?: Component | null): void {
    for (const componentId in newComponents) {
      this.addComponent(newComponents[componentId]!, target);
    }
  };

  ComponentSet.prototype.setComponents = function <C extends Component>(this: ComponentSet, newComponents: {readonly [componentId: number]: C | undefined}, target?: Component | null): void {
    const components = this.components;
    for (const componentId in components) {
      if (newComponents[componentId] === void 0) {
        this.detachComponent(components[componentId]!);
      }
    }
    for (const componentId in newComponents) {
      if (components[componentId] === void 0) {
        this.attachComponent(newComponents[componentId]!, target);
      }
    }
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
      this.decohereOutlets();
    }
    return newComponent;
  };

  ComponentSet.prototype.attachComponents = function <C extends Component>(this: ComponentSet, newComponents: {readonly [componentId: number]: C | undefined}, target?: Component | null): void {
    for (const componentId in newComponents) {
      this.attachComponent(newComponents[componentId]!, target);
    }
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
      this.decohereOutlets();
      return oldComponent;
    }
    return null;
  };

  ComponentSet.prototype.detachComponents = function <C extends Component>(this: ComponentSet<unknown, C>, components?: {readonly [componentId: number]: C | undefined}): void {
    if (components === void 0) {
      components = this.components;
    }
    for (const componentId in components) {
      this.detachComponent(components[componentId]!);
    }
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
      key = this.componentKey(newComponent);
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
      this.decohereOutlets();
    }
    return newComponent;
  };

  ComponentSet.prototype.insertComponents = function <C extends Component>(this: ComponentSet, parent: Component | null, newComponents: {readonly [componentId: number]: C | undefined}, target?: Component | null): void {
    for (const componentId in newComponents) {
      this.insertComponent(parent, newComponents[componentId]!, target);
    }
  };

  ComponentSet.prototype.removeComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: C): C | null {
    if (this.hasComponent(component)) {
      component.remove();
      return component;
    }
    return null;
  };

  ComponentSet.prototype.removeComponents = function <C extends Component>(this: ComponentSet<unknown, C>, components?: {readonly [componentId: number]: C | undefined}): void {
    if (components === void 0) {
      components = this.components;
    }
    for (const componentId in components) {
      this.removeComponent(components[componentId]!);
    }
  };

  ComponentSet.prototype.deleteComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: C): C | null {
    const oldComponent = this.detachComponent(component);
    if (oldComponent !== null) {
      oldComponent.remove();
    }
    return oldComponent;
  };

  ComponentSet.prototype.deleteComponents = function <C extends Component>(this: ComponentSet<unknown, C>, components?: {readonly [componentId: number]: C | undefined}): void {
    if (components === void 0) {
      components = this.components;
    }
    for (const componentId in components) {
      this.deleteComponent(components[componentId]!);
    }
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
        this.decohereOutlets();
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
        this.decohereOutlets();
      }
    }
  };

  ComponentSet.prototype.detectComponent = function <C extends Component>(this: ComponentSet<unknown, C>, component: Component): C | null {
    if (typeof this.componentType === "function" && component instanceof this.componentType) {
      return component as C;
    }
    return null;
  };

  ComponentSet.prototype.decohereOutlets = function (this: ComponentSet): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  ComponentSet.prototype.decohereOutlet = function (this: ComponentSet, outlet: ComponentSet): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  ComponentSet.prototype.recohere = function (this: ComponentSet, t: number): void {
    if ((this.flags & Fastener.DerivedFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null) {
        this.setComponents(inlet.components);
      }
    }
  };

  ComponentSet.prototype.componentKey = function <C extends Component>(this: ComponentSet<unknown, C>, component: C): string | undefined {
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

  ComponentSet.construct = function <F extends ComponentSet<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newComponent: AnyComponent<ComponentSetComponent<F>>): FastenerOwner<F> {
        fastener!.addComponent(newComponent);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initSorted((flagsInit & ComponentSet.SortedFlag) !== 0);
    }
    Object.defineProperty(fastener, "inlet", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).components = {};
    (fastener as Mutable<typeof fastener>).componentCount = 0;
    return fastener;
  };

  ComponentSet.refine = function (fastenerClass: ComponentSetClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "sorted")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.sorted) {
        flagsInit |= ComponentSet.SortedFlag;
      } else {
        flagsInit &= ~ComponentSet.SortedFlag;
      }
      delete (fastenerPrototype as ComponentSetTemplate).sorted;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        configurable: true,
      });
    }
  };

  (ComponentSet as Mutable<typeof ComponentSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (ComponentSet as Mutable<typeof ComponentSet>).FlagShift = _super.FlagShift + 1;
  (ComponentSet as Mutable<typeof ComponentSet>).FlagMask = (1 << ComponentSet.FlagShift) - 1;

  return ComponentSet;
})(ComponentRelation);
