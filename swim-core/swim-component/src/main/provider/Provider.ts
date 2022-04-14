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

import {Mutable, Proto, Observable, ObserverType} from "@swim/util";
import {Affinity} from "../fastener/Affinity";
import {
  FastenerOwner,
  FastenerRefinement,
  FastenerTemplate,
  FastenerClass,
  Fastener,
} from "../fastener/Fastener";
import {Service} from "../service/Service";

/** @public */
export interface ProviderRefinement extends FastenerRefinement {
  service?: unknown;
  observes?: unknown;
}

/** @public */
export type ProviderService<R extends ProviderRefinement | Provider<any, any>, D = unknown> =
  R extends {service: infer S} ? S :
  R extends {extends: infer E} ? ProviderService<E, D> :
  R extends Provider<any, infer S> ? S :
  D;

/** @public */
export interface ProviderTemplate<S = unknown> extends FastenerTemplate {
  extends?: Proto<Provider<any, any>> | string | boolean | null;
  serviceType?: unknown;
  service?: S;
  observes?: boolean;
}

/** @public */
export interface ProviderClass<P extends Provider<any, any> = Provider<any, any>> extends FastenerClass<P> {
  /** @override */
  specialize(className: string, template: ProviderTemplate): ProviderClass;

  /** @override */
  refine(providerClass: ProviderClass): void;

  /** @override */
  extend(className: string, template: ProviderTemplate): ProviderClass<P>;

  /** @override */
  specify<O, S = unknown>(className: string, template: ThisType<Provider<O, S>> & ProviderTemplate<S> & Partial<Omit<Provider<O, S>, keyof ProviderTemplate>>): ProviderClass<P>;

  /** @override */
  <O, S = unknown>(template: ThisType<Provider<O, S>> & ProviderTemplate<S> & Partial<Omit<Provider<O, S>, keyof ProviderTemplate>>): PropertyDecorator;
}

/** @public */
export type ProviderDef<O, R extends ProviderRefinement = {}> =
  Provider<O, ProviderService<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ProviderService<R> : B> : {});

/** @public */
export function ProviderDef<P extends Provider<any, any>>(
  template: P extends ProviderDef<infer O, infer R>
          ? ThisType<ProviderDef<O, R>>
          & ProviderTemplate<ProviderService<R>>
          & Partial<Omit<Provider<O, ProviderService<R>>, keyof ProviderTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ProviderTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ProviderService<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return Provider(template);
}

/** @public */
export interface Provider<O = unknown, S = unknown> extends Fastener<O> {
  (): S;

  /** @override */
  get fastenerType(): Proto<Provider<any, any>>;

  /** @internal @override */
  getSuper(): Provider<unknown, S> | null;

  /** @internal @override */
  setDerived(derived: boolean, inlet: Provider<unknown, S>): void;

  /** @protected @override */
  willDerive(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  onDerive(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  didDerive(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  willUnderive(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  onUnderive(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  didUnderive(inlet: Provider<unknown, S>): void;

  /** @override */
  get inlet(): Provider<unknown, S> | null;

  /** @protected @override */
  willBindInlet(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  onBindInlet(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  didBindInlet(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  willUnbindInlet(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  onUnbindInlet(inlet: Provider<unknown, S>): void;

  /** @protected @override */
  didUnbindInlet(inlet: Provider<unknown, S>): void;

  /** @internal @override */
  attachOutlet(target: Provider<unknown, S>): void;

  /** @internal @override */
  detachOutlet(target: Provider<unknown, S>): void;

  /** @internal */
  readonly serviceType?: unknown; // optional prototype property

  readonly service: S;

  getService(): NonNullable<S>;

  getServiceOr<E>(elseService: E): NonNullable<S> | E;

  /** @internal */
  setService(service: S): S;

  /** @protected */
  initService(service: S): void;

  /** @protected */
  willAttachService(service: S): void;

  /** @protected */
  onAttachService(service: S): void;

  /** @protected */
  didAttachService(service: S): void;

  /** @protected */
  deinitService(service: S): void;

  /** @protected */
  willDetachService(service: S): void;

  /** @protected */
  onDetachService(service: S): void;

  /** @protected */
  didDetachService(service: S): void;

  createService(): S;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const Provider = (function (_super: typeof Fastener) {
  const Provider = _super.extend("Provider", {
    static: true,
    affinity: Affinity.Inherited,
    inherits: true,
  }) as ProviderClass;

  Object.defineProperty(Provider.prototype, "fastenerType", {
    value: Provider,
    configurable: true,
  });

  Provider.prototype.onDerive = function <S>(this: Provider<unknown, S>, inlet: Provider<unknown, S>): void {
    this.setService(inlet.service);
  };

  Provider.prototype.onBindInlet = function <S>(this: Provider<unknown, S>, inlet: Provider<unknown, S>): void {
    if ((this.flags & Fastener.InheritsFlag) !== 0 && (this.flags & Affinity.Mask) === Affinity.Inherited) {
      this.initAffinity(Affinity.Transient);
    }
    _super.prototype.onBindInlet.call(this, inlet);
  };

  Provider.prototype.onUnbindInlet = function <S>(this: Provider<unknown, S>, inlet: Provider<unknown, S>): void {
    _super.prototype.onUnbindInlet.call(this, inlet);
    if ((this.flags & Fastener.InheritsFlag) !== 0 && (this.flags & Affinity.Mask) === Affinity.Transient) {
      this.initAffinity(Affinity.Inherited);
    }
  };

  Provider.prototype.getService = function <S>(this: Provider<unknown, S>): NonNullable<S> {
    const service = this.service;
    if (service === void 0 || service === null) {
      let message = service + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "service";
      throw new TypeError(message);
    }
    return service as NonNullable<S>;
  };

  Provider.prototype.getServiceOr = function <S, E>(this: Provider<unknown, S>, elseService: E): NonNullable<S> | E {
    let service: S | E = this.service;
    if (service === void 0 || service === null) {
      service = elseService;
    }
    return service as NonNullable<S> | E;
  };

  Provider.prototype.setService = function <S>(this: Provider<unknown, S>, newService: S): S {
    const oldService = this.service;
    if (oldService !== newService) {
      if (oldService !== void 0 && oldService !== null) {
        this.willDetachService(oldService);
        (this as Mutable<typeof this>).service = void 0 as unknown as S;
        this.onDetachService(oldService);
        this.deinitService(oldService);
        this.didDetachService(oldService);
      }
      if (newService !== void 0 && newService !== null) {
        this.willAttachService(newService);
        (this as Mutable<typeof this>).service = newService;
        this.onAttachService(newService);
        this.initService(newService);
        this.didAttachService(newService);
      }
    }
    return oldService;
  };

  Provider.prototype.initService = function <S>(this: Provider<unknown, S>, service: S): void {
    // hook
  };

  Provider.prototype.willAttachService = function <S>(this: Provider<unknown, S>, service: S): void {
    // hook
  };

  Provider.prototype.onAttachService = function <S>(this: Provider<unknown, S>, service: S): void {
    if (this.observes === true && Observable.is(service)) {
      service.observe(this as ObserverType<S>);
    }
  };

  Provider.prototype.didAttachService = function <S>(this: Provider<unknown, S>, service: S): void {
    // hook
  };

  Provider.prototype.deinitService = function <S>(this: Provider<unknown, S>, service: S): void {
    // hook
  };

  Provider.prototype.willDetachService = function <S>(this: Provider<unknown, S>, service: S): void {
    // hook
  };

  Provider.prototype.onDetachService = function <S>(this: Provider<unknown, S>, service: S): void {
    if (this.observes === true && Observable.is(service)) {
      service.unobserve(this as ObserverType<S>);
    }
  };

  Provider.prototype.didDetachService = function <S>(this: Provider<unknown, S>, service: S): void {
    // hook
  };

  Provider.prototype.createService = function <S>(this: Provider<unknown, S>): S {
    return this.service;
  };

  Provider.prototype.onMount = function (this: Provider): void {
    _super.prototype.onMount.call(this);
    let service = this.service;
    if (service === void 0 || service === null) {
      service = this.createService();
      this.setService(service);
    }
    if ((this.flags & Fastener.DerivedFlag) === 0 && service instanceof Service) {
      service.attachRoot(this.owner);
    }
  };

  Provider.prototype.onUnmount = function (this: Provider): void {
    const service = this.service;
    if ((this.flags & Fastener.DerivedFlag) === 0 && service instanceof Service) {
      service.detachRoot(this.owner);
    }
    _super.prototype.onUnmount.call(this);
  };

  Provider.create = function <P extends Provider<any, any>>(this: ProviderClass<P>, owner: FastenerOwner<P>): P {
    const provider = _super.create.call(this, owner) as P;
    if (provider.service === void 0) {
      const service = (Object.getPrototypeOf(provider) as ProviderTemplate).service;
      if (service !== void 0) {
        provider.setService(service);
      }
    }
    return provider;
  };

  Provider.construct = function <P extends Provider<any, any>>(provider: P | null, owner: FastenerOwner<P>): P {
    if (provider === null) {
      provider = function (): ProviderService<P> {
        return provider!.service;
      } as P;
      delete (provider as Partial<Mutable<P>>).name; // don't clobber prototype name
      Object.setPrototypeOf(provider, this.prototype);
    }
    provider = _super.construct.call(this, provider, owner) as P;
    (provider as Mutable<typeof provider>).service = void 0;
    return provider;
  };

  return Provider;
})(Fastener);
