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
import type {LikeType} from "@swim/util";
import {Affinity} from "./Affinity";
import {FastenerContext} from "./FastenerContext";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";
import type {Component} from "./Component";
import type {ComponentRelationDescriptor} from "./ComponentRelation";
import type {ComponentRelationClass} from "./ComponentRelation";
import {ComponentRelation} from "./ComponentRelation";

/** @public */
export interface ComponentRefDescriptor<R, C extends Component> extends ComponentRelationDescriptor<R, C> {
  extends?: Proto<ComponentRef<any, any>> | boolean | null;
  componentKey?: string | boolean;
}

/** @public */
export interface ComponentRefClass<F extends ComponentRef<any, any> = ComponentRef> extends ComponentRelationClass<F> {
  tryComponent<R, K extends keyof R, F extends R[K] = R[K]>(owner: R, fastenerName: K): F extends {readonly component: infer C | null} ? C | null : null;
}

/** @public */
export interface ComponentRef<R = any, C extends Component = Component> extends ComponentRelation<R, C> {
  /** @override */
  get descriptorType(): Proto<ComponentRefDescriptor<R, C>>;

  /** @override */
  get fastenerType(): Proto<ComponentRef<any, any>>;

  /** @override */
  get parent(): ComponentRef<any, C> | null;

  get inletComponent(): C | null;

  getInletComponent(): C;

  get componentKey(): string | undefined;

  readonly component: C | null;

  getComponent(): C;

  setComponent(component: C | LikeType<C> | null, target?: Component | null, key?: string): C | null;

  attachComponent(component?: C | LikeType<C>, target?: Component | null): C;

  detachComponent(): C | null;

  insertComponent(parent?: Component | null, component?: C | LikeType<C>, target?: Component | null, key?: string): C;

  removeComponent(): C | null;

  deleteComponent(): C | null;

  /** @internal @override */
  bindComponent(component: Component, target: Component | null): void;

  /** @internal @override */
  unbindComponent(component: Component): void;

  /** @override */
  detectComponent(component: Component): C | null;

  /** @override */
  recohere(t: number): void;
}

/** @public */
export const ComponentRef = (<R, C extends Component, F extends ComponentRef<any, any>>() => ComponentRelation.extend<ComponentRef<R, C>, ComponentRefClass<F>>("ComponentRef", {
  get fastenerType(): Proto<ComponentRef<any, any>> {
    return ComponentRef;
  },

  get inletComponent(): C | null {
    const inlet = this.inlet;
    return inlet instanceof ComponentRef ? inlet.component : null;
  },

  getInletComponent(): C {
    const inletComponent = this.inletComponent;
    if (inletComponent === void 0 || inletComponent === null) {
      let message = inletComponent + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "inlet component";
      throw new TypeError(message);
    }
    return inletComponent;
  },

  componentKey: void 0,

  getComponent(): C {
    const component = this.component;
    if (component === null) {
      let message = component + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "component";
      throw new TypeError(message);
    }
    return component;
  },

  setComponent(newComponent: C  | null, target?: Component | null, key?: string): C | null {
    if (newComponent !== null) {
      newComponent = this.fromLike(newComponent);
    }
    let oldComponent = this.component;
    if (oldComponent === newComponent) {
      this.setCoherent(true);
      return oldComponent;
    } else if (target === void 0) {
      target = null;
    }
    let parent: Component | null;
    if (this.binds && (parent = this.parentComponent, parent !== null)) {
      if (oldComponent !== null && oldComponent.parent === parent) {
        if (target === null) {
          target = oldComponent.nextSibling;
        }
        oldComponent.remove();
      }
      if (newComponent !== null) {
        if (key === void 0) {
          key = this.componentKey;
        }
        this.insertChild(parent, newComponent, target, key);
      }
      oldComponent = this.component;
      if (oldComponent === newComponent) {
        return oldComponent;
      }
    }
    if (oldComponent !== null) {
      (this as Mutable<typeof this>).component = null;
      this.willDetachComponent(oldComponent);
      this.onDetachComponent(oldComponent);
      this.deinitComponent(oldComponent);
      this.didDetachComponent(oldComponent);
    }
    if (newComponent !== null) {
      (this as Mutable<typeof this>).component = newComponent;
      this.willAttachComponent(newComponent, target);
      this.onAttachComponent(newComponent, target);
      this.initComponent(newComponent);
      this.didAttachComponent(newComponent, target);
    }
    this.setCoherent(true);
    this.decohereOutlets();
    return oldComponent;
  },

  attachComponent(newComponent?: C | LikeType<C>, target?: Component | null): C {
    const oldComponent = this.component;
    if (newComponent !== void 0 && newComponent !== null) {
      newComponent = this.fromLike(newComponent);
    } else if (oldComponent === null) {
      newComponent = this.createComponent();
    } else {
      newComponent = oldComponent;
    }
    if (target === void 0) {
      target = null;
    }
    if (oldComponent === newComponent) {
      return newComponent;
    } else if (oldComponent !== null) {
      (this as Mutable<typeof this>).component = null;
      this.willDetachComponent(oldComponent);
      this.onDetachComponent(oldComponent);
      this.deinitComponent(oldComponent);
      this.didDetachComponent(oldComponent);
    }
    (this as Mutable<typeof this>).component = newComponent;
    this.willAttachComponent(newComponent, target);
    this.onAttachComponent(newComponent, target);
    this.initComponent(newComponent);
    this.didAttachComponent(newComponent, target);
    this.setCoherent(true);
    this.decohereOutlets();
    return newComponent;
  },

  detachComponent(): C | null {
    const oldComponent = this.component;
    if (oldComponent === null) {
      return null;
    }
    (this as Mutable<typeof this>).component = null;
    this.willDetachComponent(oldComponent);
    this.onDetachComponent(oldComponent);
    this.deinitComponent(oldComponent);
    this.didDetachComponent(oldComponent);
    this.setCoherent(true);
    this.decohereOutlets();
    return oldComponent;
  },

  insertComponent(parent?: Component | null, newComponent?: C | LikeType<C>, target?: Component | null, key?: string): C {
    let oldComponent = this.component;
    if (newComponent !== void 0 && newComponent !== null) {
      newComponent = this.fromLike(newComponent);
    } else if (oldComponent === null) {
      newComponent = this.createComponent();
    } else {
      newComponent = oldComponent;
    }
    if (parent === void 0) {
      parent = null;
    }
    if (!this.binds && oldComponent === newComponent && newComponent.parent !== null && parent === null && key === void 0) {
      return newComponent;
    }
    if (parent === null) {
      parent = this.parentComponent;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.componentKey;
    }
    if (parent !== null && (newComponent.parent !== parent || newComponent.key !== key)) {
      this.insertChild(parent, newComponent, target, key);
    }
    oldComponent = this.component;
    if (oldComponent === newComponent) {
      return newComponent;
    } else if (oldComponent !== null) {
      (this as Mutable<typeof this>).component = null;
      this.willDetachComponent(oldComponent);
      this.onDetachComponent(oldComponent);
      this.deinitComponent(oldComponent);
      this.didDetachComponent(oldComponent);
      if (this.binds && parent !== null && oldComponent.parent === parent) {
        oldComponent.remove();
      }
    }
    (this as Mutable<typeof this>).component = newComponent;
    this.willAttachComponent(newComponent, target);
    this.onAttachComponent(newComponent, target);
    this.initComponent(newComponent);
    this.didAttachComponent(newComponent, target);
    this.setCoherent(true);
    this.decohereOutlets();
    return newComponent;
  },

  removeComponent(): C | null {
    const component = this.component;
    if (component === null) {
      return null;
    }
    component.remove();
    return component;
  },

  deleteComponent(): C | null {
    const component = this.detachComponent();
    if (component === null) {
      return null;
    }
    component.remove();
    return component;
  },

  bindComponent(component: Component, target: Component | null): void {
    if (!this.binds || this.component !== null) {
      return;
    }
    const newComponent = this.detectComponent(component);
    if (newComponent === null) {
      return;
    }
    (this as Mutable<typeof this>).component = newComponent;
    this.willAttachComponent(newComponent, target);
    this.onAttachComponent(newComponent, target);
    this.initComponent(newComponent);
    this.didAttachComponent(newComponent, target);
    this.setCoherent(true);
    this.decohereOutlets();
  },

  unbindComponent(component: Component): void {
    if (!this.binds) {
      return;
    }
    const oldComponent = this.detectComponent(component);
    if (oldComponent === null || this.component !== oldComponent) {
      return;
    }
    (this as Mutable<typeof this>).component = null;
    this.willDetachComponent(oldComponent);
    this.onDetachComponent(oldComponent);
    this.deinitComponent(oldComponent);
    this.didDetachComponent(oldComponent);
    this.setCoherent(true);
    this.decohereOutlets();
  },

  detectComponent(component: Component): C | null {
    const key = this.componentKey;
    if (key !== void 0 && key === component.key) {
      return component as C;
    }
    return null;
  },

  recohere(t: number): void {
    this.setCoherentTime(t);
    const inlets = this.inlet;
    if (inlets instanceof ComponentRef) {
      this.setDerived((this.flags & Affinity.Mask) <= Math.min(inlets.flags & Affinity.Mask, Affinity.Intrinsic));
      if ((this.flags & Fastener.DerivedFlag) !== 0) {
        this.setComponent(inlets.component);
      }
    } else {
      this.setDerived(false);
    }
  },
},
{
  tryComponent<R, K extends keyof R, F extends R[K]>(owner: R, fastenerName: K): F extends {readonly component: infer C | null} ? C | null : null {
    const componentRef = FastenerContext.tryFastener(owner, fastenerName) as ComponentRef<any, any> | null;
    if (componentRef !== null) {
      return componentRef.component as any;
    }
    return null as any;
  },

  construct(fastener: F | null, owner: F extends Fastener<infer R, any, any> ? R : never): F {
    fastener = super.construct(fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).component = null;
    return fastener;
  },

  refine(fastenerClass: FastenerClass<ComponentRef<any, any>>): void {
    super.refine(fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    const componentKeyDescriptor = Object.getOwnPropertyDescriptor(fastenerPrototype, "componentKey");
    if (componentKeyDescriptor !== void 0 && "value" in componentKeyDescriptor) {
      if (componentKeyDescriptor.value === true) {
        componentKeyDescriptor.value = fastenerClass.name;
        Object.defineProperty(fastenerPrototype, "componentKey", componentKeyDescriptor);
      } else if (componentKeyDescriptor.value === false) {
        componentKeyDescriptor.value = void 0;
        Object.defineProperty(fastenerPrototype, "componentKey", componentKeyDescriptor);
      }
    }
  },
}))();
