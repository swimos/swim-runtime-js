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
import {Affinity} from "./Affinity";
import {FastenerContext} from "./FastenerContext";
import type {FastenerFlags} from "./Fastener";
import type {FastenerDescriptor} from "./Fastener";
import type {FastenerClass} from "./Fastener";
import {Fastener} from "./Fastener";
import type {ServiceFactory} from "./Service";
import {Service} from "./"; // forward import

/** @public */
export interface ProviderDescriptor<S extends Service = Service> extends FastenerDescriptor {
  extends?: Proto<Provider> | boolean | null;
  serviceType?: ServiceFactory<any>;
  serviceKey?: string | boolean;
  creates?: boolean;
  observes?: boolean;
}

/** @public */
export interface ProviderClass<P extends Provider = Provider> extends FastenerClass<P> {
  tryService<O, K extends keyof O, F extends O[K] = O[K]>(owner: O, fastenerName: K): F extends Provider<any, infer S> ? S | null : null;

  /** @internal */
  readonly ManagedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface Provider<O = any, S extends Service = any> extends Fastener<O> {
  (): S | null;
  (service: S | null, target?: Service | null, key?: string): O;

  /** @override */
  get descriptorType(): Proto<ProviderDescriptor<S>>;

  /** @override */
  get fastenerType(): Proto<Provider>;

  /** @internal */
  readonly serviceType?: ServiceFactory<S>; // optional prototype property

  /** @internal */
  readonly creates?: boolean; // optional prototype property

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @override */
  setDerived(derived: boolean, inlet: Provider<any, S>): void;

  /** @protected @override */
  willDerive(inlet: Provider<any, S>): void;

  /** @protected @override */
  onDerive(inlet: Provider<any, S>): void;

  /** @protected @override */
  didDerive(inlet: Provider<any, S>): void;

  /** @protected @override */
  willUnderive(inlet: Provider<any, S>): void;

  /** @protected @override */
  onUnderive(inlet: Provider<any, S>): void;

  /** @protected @override */
  didUnderive(inlet: Provider<any, S>): void;

  /** @internal @override */
  get parent(): Provider<any, S> | null;

  /** @override */
  get inlet(): Provider<any, S> | null;

  /** @override */
  bindInlet(inlet: Provider<any, S>): void;

  /** @protected @override */
  willBindInlet(inlet: Provider<any, S>): void;

  /** @protected @override */
  onBindInlet(inlet: Provider<any, S>): void;

  /** @protected @override */
  didBindInlet(inlet: Provider<any, S>): void;

  /** @protected @override */
  willUnbindInlet(inlet: Provider<any, S>): void;

  /** @protected @override */
  onUnbindInlet(inlet: Provider<any, S>): void;

  /** @protected @override */
  didUnbindInlet(inlet: Provider<any, S>): void;

  /** @internal @override */
  attachOutlet(target: Provider<any, S>): void;

  /** @internal @override */
  detachOutlet(target: Provider<any, S>): void;

  get inletService(): S | null;

  getInletService(): S;

  /** @internal */
  readonly serviceKey?: string; // optional prototype property

  readonly service: S | null;

  getService(): NonNullable<S>;

  setService(service: S | null, target?: Service | null, key?: string): S | null;

  /** @protected */
  initService(service: S): void;

  /** @protected */
  willAttachService(service: S, target: Service | null): void;

  /** @protected */
  onAttachService(service: S, target: Service | null): void;

  /** @protected */
  didAttachService(service: S, target: Service | null): void;

  /** @protected */
  deinitService(service: S): void;

  /** @protected */
  willDetachService(service: S): void;

  /** @protected */
  onDetachService(service: S): void;

  /** @protected */
  didDetachService(service: S): void;

  /** @internal @protected */
  get parentService(): Service | null;

  /** @internal @protected */
  insertChild(parent: Service, child: S, target: Service | null, key: string | undefined): void;

  createService(): S;

  /** @protected */
  mountService(service: S, target: Service | null, key: string | undefined): void;

  /** @protected */
  unmountService(service: S): void;

  /** @protected */
  mountRootService(service: S): void;

  /** @protected */
  unmountRootService(service: S): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const Provider = (<O, S extends Service, P extends Provider>() => Fastener.extend<Provider<O, S>, ProviderClass<P>>("Provider", {
  affinity: Affinity.Inherited,
  inherits: true,
  creates: true,

  get fastenerType(): Proto<Provider> {
    return Provider;
  },

  onDerive(inlet: Provider<any, S>): void {
    this.setService(inlet.service);
  },

  onBindInlet(inlet: Provider<any, S>): void {
    if ((this.flags & Fastener.InheritsFlag) !== 0 && (this.flags & Affinity.Mask) === Affinity.Inherited) {
      this.initAffinity(Affinity.Transient);
    }
    super.onBindInlet(inlet);
  },

  onUnbindInlet(inlet: Provider<any, S>): void {
    super.onUnbindInlet(inlet);
    if ((this.flags & Fastener.InheritsFlag) !== 0 && (this.flags & Affinity.Mask) === Affinity.Transient) {
      this.initAffinity(Affinity.Inherited);
    }
  },

  get inletService(): S | null {
    const inlet = this.inlet;
    return inlet !== null ? inlet.service : null;
  },

  getInletService(): S {
    const inletService = this.inletService;
    if (inletService === void 0 || inletService === null) {
      let message = inletService + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "inlet service";
      throw new TypeError(message);
    }
    return inletService;
  },

  getService(): NonNullable<S> {
    const service = this.service;
    if (service === void 0 || service === null) {
      let message = service + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "service";
      throw new TypeError(message);
    }
    return service;
  },

  setService(newService: S | null, target?: Service | null, key?: string): S | null {
    if (target === void 0) {
      target = null;
    }
    const oldService = this.service;
    if (oldService === newService) {
      return oldService;
    } else if (oldService !== null) {
      (this as Mutable<typeof this>).service = null;
      this.willDetachService(oldService);
      if ((this.flags & Fastener.MountedFlag) !== 0) {
        this.unmountService(oldService);
      }
      this.onDetachService(oldService);
      this.deinitService(oldService);
      this.didDetachService(oldService);
    }
    if (newService !== null) {
      (this as Mutable<typeof this>).service = newService;
      this.willAttachService(newService, target);
      if ((this.flags & Fastener.MountedFlag) !== 0) {
        this.mountService(newService, target, key);
      }
      this.onAttachService(newService, target);
      this.initService(newService);
      this.didAttachService(newService, target);
    }
    return oldService;
  },

  initService(service: S): void {
    // hook
  },

  willAttachService(service: S, target: Service | null): void {
    // hook
  },

  onAttachService(service: S, target: Service | null): void {
    if (this.observes === true && (this.flags & Fastener.MountedFlag) !== 0) {
      service.observe(this as Observes<S>);
    }
  },

  didAttachService(service: S, target: Service | null): void {
    // hook
  },

  deinitService(service: S): void {
    // hook
  },

  willDetachService(service: S): void {
    // hook
  },

  onDetachService(service: S): void {
    if (this.observes === true && (this.flags & Fastener.MountedFlag) !== 0) {
      service.unobserve(this as Observes<S>);
    }
  },

  didDetachService(service: S): void {
    // hook
  },

  get parentService(): S | null {
    const parentProvider = this.parent;
    return parentProvider !== null ? parentProvider.service : null;
  },

  insertChild(parent: Service, child: S, target: Service | null, key: string | undefined): void {
    parent.insertChild(child, target, key);
  },

  createService(): S {
    let service: S | undefined;
    const serviceType = this.serviceType;
    if (serviceType !== void 0) {
      service = serviceType.global();
    }
    if (service === void 0 || service === null) {
      let message = "Unable to create ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "service";
      throw new Error(message);
    }
    return service;
  },

  mountService(service: S, target: Service | null, key: string | undefined): void {
    if (service.parent === null && !service.mounted) {
      let parent = this.parentService;
      if (parent === null) {
        parent = Service.global();
        target = null;
        key = void 0;
      } else if (key === void 0) {
        key = this.serviceKey;
      }
      this.insertChild(parent, service, target, key);
      this.setFlags(this.flags | Provider.ManagedFlag);
    }
    if (!this.derived) {
      this.mountRootService(service);
    }
  },

  unmountService(service: S): void {
    if (!this.derived) {
      this.unmountRootService(service);
    }
    if ((this.flags & Provider.ManagedFlag) !== 0) {
      this.setFlags(this.flags & ~Provider.ManagedFlag);
      service.remove();
    }
  },

  mountRootService(service: S): void {
    // hook
  },

  unmountRootService(this: Provider<unknown, S>, service: S): void {
    // hook
  },

  onMount(): void {
    super.onMount();
    let service = this.service;
    if (service !== null) {
      this.mountService(service, null, void 0);
      if (this.observes === true) {
        service.observe(this as Observes<S>);
      }
    } else if (this.creates) {
      service = this.createService();
      this.setService(service);
    }
  },

  onUnmount(): void {
    const service = this.service;
    if (service !== null) {
      if (this.observes === true) {
        service.unobserve(this as Observes<S>);
      }
      this.unmountService(service);
    }
    super.onUnmount();
  },
},
{
  tryService<O, K extends keyof O, F extends O[K]>(owner: O, fastenerName: K): F extends Provider<any, infer S> ? S | null : null {
    const provider = FastenerContext.tryFastener(owner, fastenerName) as Provider | null;
    if (provider !== null) {
      return provider.service as any;
    }
    return null as any;
  },

  create(owner: P extends Fastener<infer O> ? O : never): P {
    const provider = super.create(owner) as P;
    if (provider.service === null && provider.creates) {
      const service = provider.createService();
      provider.setService(service);
    }
    return provider;
  },

  construct(provider: P | null, owner: P extends Fastener<infer O> ? O : never): P {
    if (provider === null) {
      provider = function (service?: P extends Provider<any, infer S> ? S | null : never, target?: Service | null, key?: string): P extends Provider<infer O, infer S> ? S | O | null : never {
        if (service === void 0) {
          return provider!.service;
        } else {
          provider!.setService(service, target, key);
          return provider!.owner;
        }
      } as P;
      Object.defineProperty(provider, "name", {
        value: this.prototype.name,
        enumerable: true,
        configurable: true,
      });
      Object.setPrototypeOf(provider, this.prototype);
    }
    provider = super.construct(provider, owner) as P;
    (provider as Mutable<typeof provider>).service = null;
    return provider;
  },

  refine(providerClass: FastenerClass<any>): void {
    super.refine(providerClass);
    const providerPrototype = providerClass.prototype;

    if (Object.prototype.hasOwnProperty.call(providerPrototype, "serviceKey")) {
      const serviceKey = providerPrototype.serviceKey as string | boolean | undefined;
      if (serviceKey === true) {
        Object.defineProperty(providerPrototype, "serviceKey", {
          value: providerClass.name,
          enumerable: true,
          configurable: true,
        });
      } else if (serviceKey === false) {
        Object.defineProperty(providerPrototype, "serviceKey", {
          value: void 0,
          enumerable: true,
          configurable: true,
        });
      }
    }
  },

  ManagedFlag: 1 << (Fastener.FlagShift + 0),

  FlagShift: Fastener.FlagShift + 1,
  FlagMask: (1 << (Fastener.FlagShift + 1)) - 1,
}))();
