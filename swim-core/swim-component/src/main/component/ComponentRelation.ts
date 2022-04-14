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

import type {Proto, ObserverType} from "@swim/util";
import {FastenerRefinement, FastenerTemplate, FastenerClass, Fastener} from "../fastener/Fastener";
import {AnyComponent, ComponentFactory, Component} from "./Component";

/** @public */
export interface ComponentRelationRefinement extends FastenerRefinement {
  component?: Component;
  observes?: unknown;
}

/** @public */
export type ComponentRelationComponent<R extends ComponentRelationRefinement | ComponentRelation<any, any>, D = Component> =
  R extends {component: infer C} ? C :
  R extends {extends: infer E} ? ComponentRelationComponent<E, D> :
  R extends ComponentRelation<any, infer C> ? C :
  D;

/** @public */
export interface ComponentRelationTemplate<C extends Component = Component> extends FastenerTemplate {
  extends?: Proto<ComponentRelation<any, any>> | string | boolean | null;
  componentType?: ComponentFactory<C>;
  observes?: boolean;
  binds?: boolean;
}

/** @public */
export interface ComponentRelationClass<F extends ComponentRelation<any, any> = ComponentRelation<any, any>> extends FastenerClass<F> {
  /** @override */
  specialize(className: string, template: ComponentRelationTemplate): ComponentRelationClass;

  /** @override */
  refine(fastenerClass: ComponentRelationClass): void;

  /** @override */
  extend(className: string, template: ComponentRelationTemplate): ComponentRelationClass<F>;

  /** @override */
  specify<O, C extends Component = Component>(className: string, template: ThisType<ComponentRelation<O, C>> & ComponentRelationTemplate<C> & Partial<Omit<ComponentRelation<O, C>, keyof ComponentRelationTemplate>>): ComponentRelationClass<F>;

  /** @override */
  <O, C extends Component = Component>(template: ThisType<ComponentRelation<O, C>> & ComponentRelationTemplate<C> & Partial<Omit<ComponentRelation<O, C>, keyof ComponentRelationTemplate>>): PropertyDecorator;
}

/** @public */
export type ComponentRelationDef<O, R extends ComponentRelationRefinement = {}> =
  ComponentRelation<O, ComponentRelationComponent<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ComponentRelationComponent<R> : B> : {});

/** @public */
export function ComponentRelationDef<F extends ComponentRelation<any, any>>(
  template: F extends ComponentRelationDef<infer O, infer R>
          ? ThisType<ComponentRelationDef<O, R>>
          & ComponentRelationTemplate<ComponentRelationComponent<R>>
          & Partial<Omit<ComponentRelation<O, ComponentRelationComponent<R>>, keyof ComponentRelationTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ComponentRelationTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ComponentRelationComponent<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ComponentRelation(template);
}

/** @public */
export interface ComponentRelation<O = unknown, C extends Component = Component> extends Fastener<O> {
  /** @override */
  get fastenerType(): Proto<ComponentRelation<any, any>>;

  /** @internal */
  readonly componentType?: ComponentFactory<C>; // optional prototype property

  /** @protected */
  initComponent(component: C): void;

  /** @protected */
  willAttachComponent(component: C, target: Component | null): void;

  /** @protected */
  onAttachComponent(component: C, target: Component | null): void;

  /** @protected */
  didAttachComponent(component: C, target: Component | null): void;

  /** @protected */
  deinitComponent(component: C): void;

  /** @protected */
  willDetachComponent(component: C): void;

  /** @protected */
  onDetachComponent(component: C): void;

  /** @protected */
  didDetachComponent(component: C): void;

  /** @internal @protected */
  get parentComponent(): Component | null;

  /** @internal @protected */
  insertChild(parent: Component, child: C, target: Component | null, key: string | undefined): void;

  /** @internal */
  bindComponent(component: Component, target: Component | null): void;

  /** @internal */
  unbindComponent(component: Component): void;

  detectComponent(component: Component): C | null;

  createComponent(): C;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @protected */
  fromAny(value: AnyComponent<C>): C;
}

/** @public */
export const ComponentRelation = (function (_super: typeof Fastener) {
  const ComponentRelation = _super.extend("ComponentRelation", {
    lazy: false,
    static: true,
  }) as ComponentRelationClass;

  Object.defineProperty(ComponentRelation.prototype, "fastenerType", {
    value: ComponentRelation,
    configurable: true,
  });

  ComponentRelation.prototype.initComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C): void {
    // hook
  };

  ComponentRelation.prototype.willAttachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C, target: Component | null): void {
    // hook
  };

  ComponentRelation.prototype.onAttachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C, target: Component | null): void {
    if (this.observes === true) {
      component.observe(this as ObserverType<C>);
    }
  };

  ComponentRelation.prototype.didAttachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C, target: Component | null): void {
    // hook
  };

  ComponentRelation.prototype.deinitComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C): void {
    // hook
  };

  ComponentRelation.prototype.willDetachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C): void {
    // hook
  };

  ComponentRelation.prototype.onDetachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C): void {
    if (this.observes === true) {
      component.unobserve(this as ObserverType<C>);
    }
  };

  ComponentRelation.prototype.didDetachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C): void {
    // hook
  };

  Object.defineProperty(ComponentRelation.prototype, "parentComponent", {
    get(this: ComponentRelation): Component | null {
      const owner = this.owner;
      return owner instanceof Component ? owner : null;
    },
    configurable: true,
  });

  ComponentRelation.prototype.insertChild = function <C extends Component>(this: ComponentRelation<unknown, C>, parent: Component, child: C, target: Component | null, key: string | undefined): void {
    parent.insertChild(child, target, key);
  };

  ComponentRelation.prototype.bindComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: Component, target: Component | null): void {
    // hook
  };

  ComponentRelation.prototype.unbindComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: Component): void {
    // hook
  };

  ComponentRelation.prototype.detectComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: Component): C | null {
    return null;
  };

  ComponentRelation.prototype.createComponent = function <C extends Component>(this: ComponentRelation<unknown, C>): C {
    let component: C | undefined;
    const componentType = this.componentType;
    if (componentType !== void 0) {
      component = componentType.create();
    }
    if (component === void 0 || component === null) {
      let message = "Unable to create ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "component";
      throw new Error(message);
    }
    return component;
  };

  ComponentRelation.prototype.fromAny = function <C extends Component>(this: ComponentRelation<unknown, C>, value: AnyComponent<C>): C {
    const componentType = this.componentType;
    if (componentType !== void 0) {
      return componentType.fromAny(value);
    } else {
      return Component.fromAny(value) as C;
    }
  };

  return ComponentRelation;
})(Fastener);
