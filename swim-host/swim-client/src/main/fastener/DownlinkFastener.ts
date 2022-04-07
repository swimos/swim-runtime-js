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

import {
  Mutable,
  Class,
  Proto,
  Equals,
  Arrays,
  ConsumerType,
  Consumable,
  Consumer,
} from "@swim/util";
import {
  FastenerFlags,
  FastenerOwner,
  FastenerRefinement,
  FastenerTemplate,
  FastenerClass,
  Fastener,
} from "@swim/component";
import {AnyValue, Value} from "@swim/structure";
import {AnyUri, Uri} from "@swim/uri";
import type {DownlinkObserver, Downlink} from "../downlink/Downlink";
import type {WarpRef} from "../ref/WarpRef";
import type {DownlinkFastenerContext} from "./DownlinkFastenerContext";

/** @public */
export interface DownlinkFastenerRefinement extends FastenerRefinement {
}

/** @public */
export interface DownlinkFastenerTemplate extends FastenerTemplate {
  extends?: Proto<DownlinkFastener<any>> | string | boolean | null;
  consumed?: boolean;
  hostUri?: AnyUri | null;
  nodeUri?: AnyUri | null;
  laneUri?: AnyUri | null;
  prio?: number;
  rate?: number;
  body?: AnyValue | null;
  warp?: WarpRef | null;
}

/** @public */
export interface DownlinkFastenerClass<F extends DownlinkFastener<any> = DownlinkFastener<any>> extends FastenerClass<F> {
  /** @override */
  specialize(className: string, template: DownlinkFastenerTemplate): DownlinkFastenerClass;

  /** @override */
  refine(fastenerClass: DownlinkFastenerClass): void;

  /** @override */
  extend(className: string, template: DownlinkFastenerTemplate): DownlinkFastenerClass<F>;

  /** @override */
  specify<O>(className: string, template: ThisType<DownlinkFastener<O>> & DownlinkFastenerTemplate & Partial<Omit<DownlinkFastener<O>, keyof DownlinkFastenerTemplate>>): DownlinkFastenerClass<F>;

  /** @override */
  <O>(template: ThisType<DownlinkFastener<O>> & DownlinkFastenerTemplate & Partial<Omit<DownlinkFastener<O>, keyof DownlinkFastenerTemplate>>): PropertyDecorator;

  /** @internal */
  readonly ConsumingFlag: FastenerFlags;
  /** @internal */
  readonly PendingFlag: FastenerFlags;
  /** @internal */
  readonly RelinkMask: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export type DownlinkFastenerDef<O, R extends DownlinkFastenerRefinement> =
  DownlinkFastener<O> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function DownlinkFastenerDef<F extends DownlinkFastener<any>>(
  template: F extends DownlinkFastenerDef<infer O, infer R>
          ? ThisType<DownlinkFastenerDef<O, R>>
          & DownlinkFastenerTemplate
          & Partial<Omit<DownlinkFastener<O>, keyof DownlinkFastenerTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof DownlinkFastenerTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return DownlinkFastener(template);
}

/** @public */
export interface DownlinkFastener<O = unknown> extends Fastener<O>, Consumable, DownlinkObserver {
  /** @override */
  get fastenerType(): Proto<DownlinkFastener<any>>;

  /** @override */
  readonly consumerType?: Class<Consumer>;

  /** @protected @override */
  onDerive(inlet: Fastener): void;

  /** @internal */
  readonly consumed?: boolean; // optional prototype property

  /** @protected */
  initHostUri(): Uri | null;

  readonly hostUri: Uri | null;

  setHostUri(hostUri: AnyUri | null): void;

  /** @protected */
  initNodeUri(): Uri | null;

  readonly nodeUri: Uri | null;

  setNodeUri(nodeUri: AnyUri | null): void;

  /** @protected */
  initLaneUri(): Uri | null;

  readonly laneUri: Uri | null;

  setLaneUri(laneUri: AnyUri | null): void;

  /** @protected */
  initPrio(): number | undefined;

  readonly prio: number | undefined;

  setPrio(prio: number | undefined): void;

  /** @protected */
  initRate(): number | undefined;

  readonly rate: number | undefined;

  setRate(rate: number | undefined): void;

  /** @protected */
  initBody(): Value | null;

  readonly body: Value | null;

  setBody(body: AnyValue | null): void;

  /** @protected */
  initWarp(): WarpRef | null;

  readonly warp: WarpRef | null;

  setWarp(warp: WarpRef | null): void;

  readonly downlink: Downlink | null;

  /** @internal */
  link(): void;

  /** @internal */
  unlink(): void;

  /** @internal */
  relink(): void;

  /** @internal @abstract */
  createDownlink(warp: WarpRef): Downlink;

  initDownlink?(downlink: Downlink): Downlink;

  /** @internal */
  bindDownlink(downlink: Downlink): Downlink;

  /** @override */
  recohere(t: number): void;

  /** @internal */
  readonly consumers: ReadonlyArray<ConsumerType<this>>;

  /** @override */
  consume(consumer: ConsumerType<this>): void

  /** @protected */
  willConsume(consumer: ConsumerType<this>): void;

  /** @protected */
  onConsume(consumer: ConsumerType<this>): void;

  /** @protected */
  didConsume(consumer: ConsumerType<this>): void;

  /** @override */
  unconsume(consumer: ConsumerType<this>): void

  /** @protected */
  willUnconsume(consumer: ConsumerType<this>): void;

  /** @protected */
  onUnconsume(consumer: ConsumerType<this>): void;

  /** @protected */
  didUnconsume(consumer: ConsumerType<this>): void;

  get consuming(): boolean;

  /** @internal */
  startConsuming(): void;

  /** @protected */
  willStartConsuming(): void;

  /** @protected */
  onStartConsuming(): void;

  /** @protected */
  didStartConsuming(): void;

  /** @internal */
  stopConsuming(): void;

  /** @protected */
  willStopConsuming(): void;

  /** @protected */
  onStopConsuming(): void;

  /** @protected */
  didStopConsuming(): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const DownlinkFastener = (function (_super: typeof Fastener) {
  const DownlinkFastener = _super.extend("DownlinkFastener", {
    lazy: false,
    static: true,
  }) as DownlinkFastenerClass;

  Object.defineProperty(DownlinkFastener.prototype, "fastenerType", {
    value: DownlinkFastener,
    configurable: true,
  });

  DownlinkFastener.prototype.onDerive = function (this: DownlinkFastener, inlet: DownlinkFastener): void {
    // hook
  };

  DownlinkFastener.prototype.initHostUri = function (this: DownlinkFastener): Uri | null {
    let hostUri = (Object.getPrototypeOf(this) as DownlinkFastener).hostUri as Uri | null | undefined;
    if (hostUri === void 0) {
      hostUri = null;
    }
    return hostUri;
  };

  DownlinkFastener.prototype.setHostUri = function (this: DownlinkFastener, hostUri: AnyUri | null): void {
    if (hostUri !== null) {
      hostUri = Uri.fromAny(hostUri);
    }
    if (!Equals(this.hostUri, hostUri)) {
      (this as Mutable<typeof this>).hostUri = hostUri;
      this.relink();
    }
  };

  DownlinkFastener.prototype.initNodeUri = function (this: DownlinkFastener): Uri | null {
    let nodeUri = (Object.getPrototypeOf(this) as DownlinkFastener).nodeUri as Uri | null | undefined;
    if (nodeUri === void 0) {
      nodeUri = null;
    }
    return nodeUri;
  };

  DownlinkFastener.prototype.setNodeUri = function (this: DownlinkFastener, nodeUri: AnyUri | null): void {
    if (nodeUri !== null) {
      nodeUri = Uri.fromAny(nodeUri);
    }
    if (!Equals(this.nodeUri, nodeUri)) {
      (this as Mutable<typeof this>).nodeUri = nodeUri;
      this.relink();
    }
  };

  DownlinkFastener.prototype.initLaneUri = function (this: DownlinkFastener): Uri | null {
    let laneUri = (Object.getPrototypeOf(this) as DownlinkFastener).laneUri as Uri | null | undefined;
    if (laneUri === void 0) {
      laneUri = null;
    }
    return laneUri;
  };

  DownlinkFastener.prototype.setLaneUri = function (this: DownlinkFastener, laneUri: AnyUri | null): void {
    if (laneUri !== null) {
      laneUri = Uri.fromAny(laneUri);
    }
    if (!Equals(this.laneUri, laneUri)) {
      (this as Mutable<typeof this>).laneUri = laneUri;
      this.relink();
    }
  };

  DownlinkFastener.prototype.initPrio = function (this: DownlinkFastener): number | undefined {
    return (Object.getPrototypeOf(this) as DownlinkFastener).prio;
  };

  DownlinkFastener.prototype.setPrio = function (this: DownlinkFastener, prio: number | undefined): void {
    if (this.prio !== prio) {
      (this as Mutable<typeof this>).prio = prio;
      this.relink();
    }
  };

  DownlinkFastener.prototype.initRate = function (this: DownlinkFastener): number | undefined {
    return (Object.getPrototypeOf(this) as DownlinkFastener).rate;
  };

  DownlinkFastener.prototype.setRate = function (this: DownlinkFastener, rate: number | undefined): void {
    if (this.rate !== rate) {
      (this as Mutable<typeof this>).rate = rate;
      this.relink();
    }
  };

  DownlinkFastener.prototype.initBody = function (this: DownlinkFastener): Value | null {
    let body = (Object.getPrototypeOf(this) as DownlinkFastener).body as Value | null | undefined;
    if (body === void 0) {
      body = null;
    }
    return body;
  };

  DownlinkFastener.prototype.setBody = function (this: DownlinkFastener, body: AnyValue | null): void {
    if (body !== null) {
      body = Value.fromAny(body);
    }
    if (!Equals(this.body, body)) {
      (this as Mutable<typeof this>).body = body;
      this.relink();
    }
  };

  DownlinkFastener.prototype.initWarp = function (this: DownlinkFastener): WarpRef | null {
    let warp = (Object.getPrototypeOf(this) as DownlinkFastener).warp as WarpRef | null | undefined;
    if (warp === void 0) {
      warp = null;
    }
    return warp;
  };

  DownlinkFastener.prototype.setWarp = function (this: DownlinkFastener, warp: WarpRef | null): void {
    if (this.warp !== warp) {
      (this as Mutable<typeof this>).warp = warp;
      this.relink();
    }
  };

  DownlinkFastener.prototype.link = function (this: DownlinkFastener<DownlinkFastenerContext>): void {
    if (this.downlink === null) {
      if (this.hostUri === null) {
        (this as Mutable<typeof this>).hostUri = this.initHostUri();
      }
      if (this.nodeUri === null) {
        (this as Mutable<typeof this>).nodeUri = this.initNodeUri();
      }
      if (this.laneUri === null) {
        (this as Mutable<typeof this>).laneUri = this.initLaneUri();
      }
      if (this.prio === null) {
        (this as Mutable<typeof this>).prio = this.initPrio();
      }
      if (this.rate === null) {
        (this as Mutable<typeof this>).rate = this.initRate();
      }
      if (this.body === null) {
        (this as Mutable<typeof this>).body = this.initBody();
      }
      if (this.warp === null) {
        (this as Mutable<typeof this>).warp = this.initWarp();
      }
      let warp = this.warp;
      if (warp === null) {
        warp = this.owner.warpRef.value;
      }
      if (warp === null) {
        warp = this.owner.warpProvider.service.client;
      }
      let downlink = this.createDownlink(warp);
      downlink = this.bindDownlink(downlink);
      if (this.initDownlink !== void 0) {
        downlink = this.initDownlink(downlink);
      }
      downlink = downlink.observe(this);
      (this as Mutable<typeof this>).downlink = downlink.open();
      this.setFlags(this.flags & ~DownlinkFastener.PendingFlag);
    }
  };

  DownlinkFastener.prototype.unlink = function (this: DownlinkFastener): void {
    const downlink = this.downlink;
    if (downlink !== null) {
      downlink.close();
      (this as Mutable<typeof this>).downlink = null;
      this.setFlags(this.flags | DownlinkFastener.PendingFlag);
    }
  };

  DownlinkFastener.prototype.relink = function (this: DownlinkFastener): void {
    this.setFlags(this.flags | DownlinkFastener.PendingFlag);
    if ((this.flags & DownlinkFastener.ConsumingFlag) !== 0) {
      this.setCoherent(false);
      this.decohere();
    }
  };

  DownlinkFastener.prototype.bindDownlink = function (this: DownlinkFastener, downlink: Downlink): Downlink {
    const hostUri = this.hostUri;
    if (hostUri !== null) {
      downlink = downlink.hostUri(hostUri);
    }
    const nodeUri = this.nodeUri;
    if (nodeUri !== null) {
      downlink = downlink.nodeUri(nodeUri);
    }
    const laneUri = this.laneUri;
    if (laneUri !== null) {
      downlink = downlink.laneUri(laneUri);
    }
    const prio = this.prio;
    if (prio !== void 0) {
      downlink = downlink.prio(prio);
    }
    const rate = this.rate;
    if (rate !== void 0) {
      downlink = downlink.rate(rate);
    }
    const body = this.body;
    if (body !== null) {
      downlink = downlink.body(body);
    }
    return downlink;
  };

  DownlinkFastener.prototype.recohere = function (this: DownlinkFastener, t: number): void {
    this.setCoherent(true);
    if (this.downlink !== null && (this.flags & DownlinkFastener.RelinkMask) === DownlinkFastener.RelinkMask) {
      this.unlink();
      this.link();
    } else if (this.downlink === null && (this.flags & DownlinkFastener.ConsumingFlag) !== 0) {
      this.link();
    } else if (this.downlink !== null && (this.flags & DownlinkFastener.ConsumingFlag) === 0) {
      this.unlink();
    }
  };

  DownlinkFastener.prototype.consume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    const oldConsumers = this.consumers;
    const newConsumerrss = Arrays.inserted(downlinkConsumer, oldConsumers);
    if (oldConsumers !== newConsumerrss) {
      this.willConsume(downlinkConsumer);
      (this as Mutable<typeof this>).consumers = newConsumerrss;
      this.onConsume(downlinkConsumer);
      this.didConsume(downlinkConsumer);
      if (oldConsumers.length === 0) {
        this.startConsuming();
      }
    }
  };

  DownlinkFastener.prototype.willConsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    // hook
  }

  DownlinkFastener.prototype.onConsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    // hook
  };

  DownlinkFastener.prototype.didConsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    // hook
  };

  DownlinkFastener.prototype.unconsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    const oldConsumers = this.consumers;
    const newConsumerrss = Arrays.removed(downlinkConsumer, oldConsumers);
    if (oldConsumers !== newConsumerrss) {
      this.willUnconsume(downlinkConsumer);
      (this as Mutable<typeof this>).consumers = newConsumerrss;
      this.onUnconsume(downlinkConsumer);
      this.didUnconsume(downlinkConsumer);
      if (newConsumerrss.length === 0) {
        this.stopConsuming();
      }
    }
  };

  DownlinkFastener.prototype.willUnconsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    // hook
  };

  DownlinkFastener.prototype.onUnconsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    // hook
  };

  DownlinkFastener.prototype.didUnconsume = function (this: DownlinkFastener, downlinkConsumer: ConsumerType<typeof this>): void {
    // hook
  };

  Object.defineProperty(DownlinkFastener.prototype, "consuming", {
    get(this: DownlinkFastener): boolean {
      return (this.flags & DownlinkFastener.ConsumingFlag) !== 0;
    },
    configurable: true,
  })

  DownlinkFastener.prototype.startConsuming = function (this: DownlinkFastener): void {
    if ((this.flags & DownlinkFastener.ConsumingFlag) === 0) {
      this.willStartConsuming();
      this.setFlags(this.flags | DownlinkFastener.ConsumingFlag);
      this.onStartConsuming();
      this.didStartConsuming();
    }
  };

  DownlinkFastener.prototype.willStartConsuming = function (this: DownlinkFastener): void {
    // hook
  };

  DownlinkFastener.prototype.onStartConsuming = function (this: DownlinkFastener): void {
    this.setCoherent(false);
    this.decohere();
  };

  DownlinkFastener.prototype.didStartConsuming = function (this: DownlinkFastener): void {
    // hook
  };

  DownlinkFastener.prototype.stopConsuming = function (this: DownlinkFastener): void {
    if ((this.flags & DownlinkFastener.ConsumingFlag) !== 0) {
      this.willStopConsuming();
      this.setFlags(this.flags & ~DownlinkFastener.ConsumingFlag);
      this.onStopConsuming();
      this.didStopConsuming();
    }
  };

  DownlinkFastener.prototype.willStopConsuming = function (this: DownlinkFastener): void {
    // hook
  };

  DownlinkFastener.prototype.onStopConsuming = function (this: DownlinkFastener): void {
    this.setCoherent(false);
    this.decohere();
  };

  DownlinkFastener.prototype.didStopConsuming = function (this: DownlinkFastener): void {
    // hook
  };

  DownlinkFastener.prototype.onMount = function (this: DownlinkFastener): void {
    _super.prototype.onMount.call(this);
    if ((this.flags & DownlinkFastener.ConsumingFlag) !== 0) {
      this.setCoherent(false);
      this.decohere();
    }
  };

  DownlinkFastener.prototype.onUnmount = function (this: DownlinkFastener): void {
    _super.prototype.onUnmount.call(this);
    this.unlink();
  };

  DownlinkFastener.construct = function <F extends DownlinkFastener<any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).consumers = Arrays.empty;
    (fastener as Mutable<typeof fastener>).hostUri = null;
    (fastener as Mutable<typeof fastener>).nodeUri = null;
    (fastener as Mutable<typeof fastener>).laneUri = null;
    (fastener as Mutable<typeof fastener>).prio = void 0;
    (fastener as Mutable<typeof fastener>).rate = void 0;
    (fastener as Mutable<typeof fastener>).body = null;
    (fastener as Mutable<typeof fastener>).warp = null;
    (fastener as Mutable<typeof fastener>).downlink = null;
    return fastener;
  };

  DownlinkFastener.refine = function (fastenerClass: DownlinkFastenerClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "hostUri")) {
      Object.defineProperty(fastenerPrototype, "hostUri", {
        value: Uri.fromAny(fastenerPrototype.hostUri),
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "nodeUri")) {
      Object.defineProperty(fastenerPrototype, "nodeUri", {
        value: Uri.fromAny(fastenerPrototype.nodeUri),
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "laneUri")) {
      Object.defineProperty(fastenerPrototype, "laneUri", {
        value: Uri.fromAny(fastenerPrototype.laneUri),
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "prio")) {
      Object.defineProperty(fastenerPrototype, "prio", {
        value: fastenerPrototype.prio,
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "rate")) {
      Object.defineProperty(fastenerPrototype, "rate", {
        value: fastenerPrototype.rate,
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "body")) {
      Object.defineProperty(fastenerPrototype, "body", {
        value: Value.fromAny(fastenerPrototype.body),
        enumerable: true,
        configurable: true,
      });
    }
  };

  (DownlinkFastener as Mutable<typeof DownlinkFastener>).ConsumingFlag = 1 << (_super.FlagShift + 0);
  (DownlinkFastener as Mutable<typeof DownlinkFastener>).PendingFlag = 1 << (_super.FlagShift + 1);
  (DownlinkFastener as Mutable<typeof DownlinkFastener>).RelinkMask = DownlinkFastener.ConsumingFlag | DownlinkFastener.PendingFlag;

  (DownlinkFastener as Mutable<typeof DownlinkFastener>).FlagShift = _super.FlagShift + 2;
  (DownlinkFastener as Mutable<typeof DownlinkFastener>).FlagMask = (1 << DownlinkFastener.FlagShift) - 1;

  return DownlinkFastener;
})(Fastener);

