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
import type {Observes} from "@swim/util";
import type {FastenerDescriptor} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";
import type {AnyComponent} from "./Component";
import type {ComponentFactory} from "./Component";
import {Component} from "./Component";

/** @public */
export interface ComponentRelationDescriptor<C extends Component = Component> extends FastenerDescriptor {
  extends?: Proto<ComponentRelation<any, any>> | boolean | null;
  componentType?: ComponentFactory<any, any>;
  observes?: boolean;
  binds?: boolean;
}

/** @public */
export interface ComponentRelationClass<F extends ComponentRelation<any, any> = ComponentRelation<any, any>> extends FastenerClass<F> {
}

/** @public */
export interface ComponentRelation<O = unknown, C extends Component = Component> extends Fastener<O> {
  /** @override */
  get descriptorType(): Proto<ComponentRelationDescriptor<C>>;

  /** @override */
  get fastenerType(): Proto<ComponentRelation<any, any>>;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @override */
  setDerived(derived: boolean, inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  willDerive(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  onDerive(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  didDerive(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  willUnderive(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  onUnderive(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  didUnderive(inlet: ComponentRelation<unknown, C>): void;

  /** @override */
  get parent(): ComponentRelation<unknown, C> | null;

  /** @override */
  readonly inlet: ComponentRelation<unknown, C> | null;

  /** @override */
  bindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  willBindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  onBindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  didBindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ComponentRelation<unknown, C>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<ComponentRelation<unknown, C>> | null;

  /** @internal @override */
  attachOutlet(outlet: ComponentRelation<unknown, C>): void;

  /** @internal @override */
  detachOutlet(outlet: ComponentRelation<unknown, C>): void;

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

  /** @internal @protected */
  fromAny(value: AnyComponent<C>): C;
}

/** @public */
export const ComponentRelation = (function (_super: typeof Fastener) {
  const ComponentRelation = _super.extend("ComponentRelation", {}) as ComponentRelationClass;

  Object.defineProperty(ComponentRelation.prototype, "fastenerType", {
    value: ComponentRelation,
    enumerable: true,
    configurable: true,
  });

  ComponentRelation.prototype.attachOutlet = function <C extends Component>(this: ComponentRelation<unknown, C>, outlet: ComponentRelation<unknown, C>): void {
    let outlets = this.outlets as ComponentRelation<unknown, C>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  ComponentRelation.prototype.detachOutlet = function <C extends Component>(this: ComponentRelation<unknown, C>, outlet: ComponentRelation<unknown, C>): void {
    const outlets = this.outlets as ComponentRelation<unknown, C>[] | null;
    if (outlets === null) {
      return;
    }
    const index = outlets.indexOf(outlet);
    if (index < 0) {
      return;
    }
    outlets.splice(index, 1);
  };

  ComponentRelation.prototype.initComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C): void {
    // hook
  };

  ComponentRelation.prototype.willAttachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C, target: Component | null): void {
    // hook
  };

  ComponentRelation.prototype.onAttachComponent = function <C extends Component>(this: ComponentRelation<unknown, C>, component: C, target: Component | null): void {
    if (this.observes === true) {
      component.observe(this as Observes<C>);
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
      component.unobserve(this as Observes<C>);
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
    enumerable: true,
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
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
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
    }
    return Component.fromAny(value) as C;
  };

  ComponentRelation.construct = function <F extends ComponentRelation<any, any>>(fastener: F | null, owner: F extends ComponentRelation<infer O, any> ? O : never): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).outlets = null;
    return fastener;
  };

  return ComponentRelation;
})(Fastener);
