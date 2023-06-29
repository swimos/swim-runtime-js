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
import type {Class} from "@swim/util";
import type {Proto} from "@swim/util";
import {Equals} from "@swim/util";
import type {Observes} from "@swim/util";
import type {Observable} from "@swim/util";
import type {ObserverMethods} from "@swim/util";
import type {ObserverParameters} from "@swim/util";
import type {Observer} from "@swim/util";
import type {Consumer} from "@swim/util";
import type {Consumable} from "@swim/util";
import type {FastenerFlags} from "@swim/component";
import type {FastenerDescriptor} from "@swim/component";
import type {FastenerClass} from "@swim/component";
import {Fastener} from "@swim/component";
import type {AnyValue} from "@swim/structure";
import {Value} from "@swim/structure";
import type {AnyUri} from "@swim/uri";
import {Uri} from "@swim/uri";
import type {EventMessage} from "@swim/warp";
import type {LinkRequest} from "@swim/warp";
import type {LinkedResponse} from "@swim/warp";
import type {SyncRequest} from "@swim/warp";
import type {SyncedResponse} from "@swim/warp";
import type {UnlinkRequest} from "@swim/warp";
import type {UnlinkedResponse} from "@swim/warp";
import {WarpDownlinkContext} from "./WarpDownlinkContext";
import type {WarpDownlinkModel} from "./WarpDownlinkModel";

/** @public */
export interface WarpDownlinkDescriptor extends FastenerDescriptor {
  extends?: Proto<WarpDownlink<any>> | boolean | null;
  consumed?: boolean;
  hostUri?: AnyUri | null;
  nodeUri?: AnyUri | null;
  laneUri?: AnyUri | null;
  prio?: number;
  rate?: number;
  body?: AnyValue | null;
  relinks?: boolean;
  syncs?: boolean;
}

/** @public */
export interface WarpDownlinkClass<F extends WarpDownlink<any> = WarpDownlink<any>> extends FastenerClass<F> {
  /** @internal */
  readonly RelinksFlag: FastenerFlags;
  /** @internal */
  readonly SyncsFlag: FastenerFlags;
  /** @internal */
  readonly ConsumingFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface WarpDownlinkObserver<F extends WarpDownlink<any> = WarpDownlink> extends Observer<F> {
  onEvent?(body: Value, downlink: F): void;

  onCommand?(body: Value, downlink: F): void;

  willLink?(downlink: F): void;

  didLink?(downlink: F): void;

  willSync?(downlink: F): void;

  didSync?(downlink: F): void;

  willUnlink?(downlink: F): void;

  didUnlink?(downlink: F): void;

  didConnect?(downlink: F): void;

  didDisconnect?(downlink: F): void;

  didClose?(downlink: F): void;

  didFail?(error: unknown, downlink: F): void;
}

/** @public */
export interface WarpDownlink<O = unknown> extends Fastener<O>, Observable, Consumable {
  /** @override */
  get descriptorType(): Proto<WarpDownlinkDescriptor>;

  /** @override */
  get fastenerType(): Proto<WarpDownlink<any>>;

  /** @override */
  readonly observerType?: Class<WarpDownlinkObserver>;

  /** @protected */
  readonly consumed?: boolean; // optional prototype property

  /** @internal */
  readonly model: WarpDownlinkModel | null;

  /** @protected @override */
  onDerive(inlet: WarpDownlink): void;

  /** @protected */
  initHostUri(): Uri | null;

  readonly hostUri: Uri | null;

  getHostUri(): Uri | null;

  setHostUri(hostUri: AnyUri | null): this;

  /** @protected */
  initNodeUri(): Uri | null;

  readonly nodeUri: Uri | null;

  getNodeUri(): Uri | null;

  setNodeUri(nodeUri: AnyUri | null): this;

  /** @protected */
  initLaneUri(): Uri | null;

  readonly laneUri: Uri | null;

  getLaneUri(): Uri | null;

  setLaneUri(laneUri: AnyUri | null): this;

  /** @protected */
  initPrio(): number | undefined;

  readonly prio: number | undefined;

  getPrio(): number | undefined;

  setPrio(prio: number | undefined): this;

  /** @protected */
  initRate(): number | undefined;

  readonly rate: number | undefined;

  getRate(): number | undefined;

  setRate(rate: number | undefined): this;

  /** @protected */
  initBody(): Value | null;

  readonly body: Value | null;

  getBody(): Value | null;

  setBody(body: AnyValue | null): this;

  /** @internal */
  initRelinks(relinks: boolean): void;

  get relinks(): boolean;

  relink(relinks?: boolean): this;

  /** @internal */
  initSyncs(syncs: boolean): void;

  get syncs(): boolean;

  sync(syncs?: boolean): this;

  get opened(): boolean;

  get online(): boolean;

  get connected(): boolean;

  get authenticated(): boolean;

  get deauthenticated(): boolean;

  get linked(): boolean;

  get synced(): boolean;

  get session(): Value;

  command(body: AnyValue): void;

  /** @protected */
  onEvent(body: Value): void;

  /** @protected */
  onCommand(body: Value): void;

  /** @protected */
  willLink(): void;

  /** @protected */
  didLink(): void;

  /** @protected */
  willSync(): void;

  /** @protected */
  didSync(): void;

  /** @protected */
  willUnlink(): void;

  /** @protected */
  didUnlink(): void;

  /** @protected */
  didConnect(): void;

  /** @protected */
  didDisconnect(): void;

  /** @protected */
  didClose(): void;

  /** @protected */
  didFail(error: unknown): void;

  /** @internal */
  onEventMessage(message: EventMessage): void;

  /** @internal */
  onCommandMessage(body: Value): void;

  /** @internal */
  onLinkRequest(request?: LinkRequest): void;

  /** @internal */
  onLinkedResponse(response?: LinkedResponse): void;

  /** @internal */
  onSyncRequest(request?: SyncRequest): void;

  /** @internal */
  onSyncedResponse(response?: SyncedResponse): void;

  /** @internal */
  onUnlinkRequest(request?: UnlinkRequest): void;

  /** @internal */
  onUnlinkedResponse(response?: UnlinkedResponse): void;

  /** @internal */
  hostDidConnect(): void;

  /** @internal */
  hostDidDisconnect(): void;

  /** @internal */
  hostDidFail(error: unknown): void;

  /** @internal */
  readonly observers: ReadonlySet<Observes<this>> | null;

  /** @override */
  observe(observer: Observes<this>): void;

  /** @protected */
  willObserve(observer: Observes<this>): void;

  /** @protected */
  onObserve(observer: Observes<this>): void;

  /** @protected */
  didObserve(observer: Observes<this>): void;

  /** @override */
  unobserve(observer: Observes<this>): void;

  /** @protected */
  willUnobserve(observer: Observes<this>): void;

  /** @protected */
  onUnobserve(observer: Observes<this>): void;

  /** @protected */
  didUnobserve(observer: Observes<this>): void;

  callObservers<O, K extends keyof ObserverMethods<O>>(this: {readonly observerType?: Class<O>}, key: K, ...args: ObserverParameters<O, K>): void;

  /** @internal */
  readonly consumers: ReadonlySet<Consumer> | null;

  /** @override */
  consume(consumer: Consumer): void;

  /** @protected */
  willConsume(consumer: Consumer): void;

  /** @protected */
  onConsume(consumer: Consumer): void;

  /** @protected */
  didConsume(consumer: Consumer): void;

  /** @override */
  unconsume(consumer: Consumer): void;

  /** @protected */
  willUnconsume(consumer: Consumer): void;

  /** @protected */
  onUnconsume(consumer: Consumer): void;

  /** @protected */
  didUnconsume(consumer: Consumer): void;

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

  /** @abstract */
  open(): this;

  close(): void;

  /** @internal */
  reopen(): void;

  /** @override */
  recohere(t: number): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const WarpDownlink = (function (_super: typeof Fastener) {
  const WarpDownlink = _super.extend("WarpDownlink", {}) as WarpDownlinkClass;

  Object.defineProperty(WarpDownlink.prototype, "fastenerType", {
    value: WarpDownlink,
    enumerable: true,
    configurable: true,
  });

  WarpDownlink.prototype.onDerive = function (this: WarpDownlink, inlet: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.initHostUri = function (this: WarpDownlink): Uri | null {
    let hostUri = (Object.getPrototypeOf(this) as WarpDownlink).hostUri as Uri | null | undefined;
    if (hostUri === void 0) {
      hostUri = null;
    }
    return hostUri;
  };

  WarpDownlink.prototype.getHostUri = function (this: WarpDownlink): Uri | null {
    let hostUri = this.hostUri;
    if (hostUri === null && WarpDownlinkContext.has(this.owner, "hostUri")) {
      hostUri = this.owner.hostUri();
    }
    return hostUri;
  };

  WarpDownlink.prototype.setHostUri = function (this: WarpDownlink, hostUri: AnyUri | null): WarpDownlink {
    if (hostUri !== null) {
      hostUri = Uri.fromAny(hostUri);
    }
    if (!Equals(this.hostUri, hostUri)) {
      (this as Mutable<typeof this>).hostUri = hostUri;
      this.reopen();
    }
    return this;
  };

  WarpDownlink.prototype.initNodeUri = function (this: WarpDownlink): Uri | null {
    let nodeUri = (Object.getPrototypeOf(this) as WarpDownlink).nodeUri as Uri | null | undefined;
    if (nodeUri === void 0) {
      nodeUri = null;
    }
    return nodeUri;
  };

  WarpDownlink.prototype.getNodeUri = function (this: WarpDownlink): Uri | null {
    let nodeUri = this.nodeUri;
    if (nodeUri === null && WarpDownlinkContext.has(this.owner, "nodeUri")) {
      nodeUri = this.owner.nodeUri();
    }
    return nodeUri;
  };

  WarpDownlink.prototype.setNodeUri = function (this: WarpDownlink, nodeUri: AnyUri | null): WarpDownlink {
    if (nodeUri !== null) {
      nodeUri = Uri.fromAny(nodeUri);
    }
    if (!Equals(this.nodeUri, nodeUri)) {
      (this as Mutable<typeof this>).nodeUri = nodeUri;
      this.reopen();
    }
    return this;
  };

  WarpDownlink.prototype.initLaneUri = function (this: WarpDownlink): Uri | null {
    let laneUri = (Object.getPrototypeOf(this) as WarpDownlink).laneUri as Uri | null | undefined;
    if (laneUri === void 0) {
      laneUri = null;
    }
    return laneUri;
  };

  WarpDownlink.prototype.getLaneUri = function (this: WarpDownlink): Uri | null {
    let laneUri = this.laneUri;
    if (laneUri === null && WarpDownlinkContext.has(this.owner, "laneUri")) {
      laneUri = this.owner.laneUri();
    }
    return laneUri;
  };

  WarpDownlink.prototype.setLaneUri = function (this: WarpDownlink, laneUri: AnyUri | null): WarpDownlink {
    if (laneUri !== null) {
      laneUri = Uri.fromAny(laneUri);
    }
    if (!Equals(this.laneUri, laneUri)) {
      (this as Mutable<typeof this>).laneUri = laneUri;
      this.reopen();
    }
    return this;
  };

  WarpDownlink.prototype.initPrio = function (this: WarpDownlink): number | undefined {
    return (Object.getPrototypeOf(this) as WarpDownlink).prio;
  };

  WarpDownlink.prototype.getPrio = function (this: WarpDownlink): number | undefined {
    return this.prio;
  };

  WarpDownlink.prototype.setPrio = function (this: WarpDownlink, prio: number | undefined): WarpDownlink {
    if (this.prio !== prio) {
      (this as Mutable<typeof this>).prio = prio;
      this.reopen();
    }
    return this;
  };

  WarpDownlink.prototype.initRate = function (this: WarpDownlink): number | undefined {
    return (Object.getPrototypeOf(this) as WarpDownlink).rate;
  };

  WarpDownlink.prototype.getRate = function (this: WarpDownlink): number | undefined {
    return this.rate;
  };

  WarpDownlink.prototype.setRate = function (this: WarpDownlink, rate: number | undefined): WarpDownlink {
    if (this.rate !== rate) {
      (this as Mutable<typeof this>).rate = rate;
      this.reopen();
    }
    return this;
  };

  WarpDownlink.prototype.initBody = function (this: WarpDownlink): Value | null {
    let body = (Object.getPrototypeOf(this) as WarpDownlink).body as Value | null | undefined;
    if (body === void 0) {
      body = null;
    }
    return body;
  };

  WarpDownlink.prototype.getBody = function (this: WarpDownlink): Value | null {
    return this.body;
  };

  WarpDownlink.prototype.setBody = function (this: WarpDownlink, body: AnyValue | null): WarpDownlink {
    if (body !== null) {
      body = Value.fromAny(body);
    }
    if (!Equals(this.body, body)) {
      (this as Mutable<typeof this>).body = body;
      this.reopen();
    }
    return this;
  };

  WarpDownlink.prototype.initRelinks = function (this: WarpDownlink, relinks: boolean): void {
    if (relinks) {
      (this as Mutable<typeof this>).flags = this.flags | WarpDownlink.RelinksFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~WarpDownlink.RelinksFlag;
    }
  };

  Object.defineProperty(WarpDownlink.prototype, "relinks", {
    get(this: WarpDownlink): boolean {
      return (this.flags & WarpDownlink.RelinksFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  WarpDownlink.prototype.relink = function (this: WarpDownlink, relinks?: boolean): typeof this {
    if (relinks === void 0) {
      relinks = true;
    }
    const flags = this.flags;
    if (relinks && (flags & WarpDownlink.RelinksFlag) === 0) {
      this.setFlags(flags | WarpDownlink.RelinksFlag);
    } else if (!relinks && (flags & WarpDownlink.RelinksFlag) !== 0) {
      this.setFlags(flags & ~WarpDownlink.RelinksFlag);
    }
    return this;
  };

  WarpDownlink.prototype.initSyncs = function (this: WarpDownlink, syncs: boolean): void {
    if (syncs) {
      (this as Mutable<typeof this>).flags = this.flags | WarpDownlink.SyncsFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~WarpDownlink.SyncsFlag;
    }
  };

  Object.defineProperty(WarpDownlink.prototype, "syncs", {
    get(this: WarpDownlink): boolean {
      return (this.flags & WarpDownlink.SyncsFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  WarpDownlink.prototype.sync = function (this: WarpDownlink, syncs?: boolean): typeof this {
    if (syncs === void 0) {
      syncs = true;
    }
    const flags = this.flags;
    if (syncs && (flags & WarpDownlink.SyncsFlag) === 0) {
      this.setFlags(flags | WarpDownlink.SyncsFlag);
    } else if (!syncs && (flags & WarpDownlink.SyncsFlag) !== 0) {
      this.setFlags(flags & ~WarpDownlink.SyncsFlag);
    }
    return this;
  };

  Object.defineProperty(WarpDownlink.prototype, "opened", {
    get(this: WarpDownlink): boolean {
      return this.model !== null;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "online", {
    get(this: WarpDownlink): boolean {
      const model = this.model;
      return model !== null && model.online.value;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "connected", {
    get(this: WarpDownlink): boolean {
      const model = this.model;
      return model !== null && model.connected;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "authenticated", {
    get(this: WarpDownlink): boolean {
      const model = this.model;
      return model !== null && model.authenticated;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "deauthenticated", {
    get(this: WarpDownlink): boolean {
      const model = this.model;
      return model !== null && model.deauthenticated;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "linked", {
    get(this: WarpDownlink): boolean {
      const model = this.model;
      return model !== null && model.linked;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "synced", {
    get(this: WarpDownlink): boolean {
      const model = this.model;
      return model !== null && model.synced;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(WarpDownlink.prototype, "session", {
    get(this: WarpDownlink): Value {
      const model = this.model;
      return model !== null ? model.session.value : Value.absent();
    },
    enumerable: true,
    configurable: true,
  });

  WarpDownlink.prototype.command = function (this: WarpDownlink, body: AnyValue): void {
    const model = this.model;
    if (model === null) {
      throw new Error("unopened downlink");
    }
    model.command(body);
  };

  WarpDownlink.prototype.onEvent = function (this: WarpDownlink, body: Value): void {
    // hook
  };

  WarpDownlink.prototype.onCommand = function (this: WarpDownlink, body: Value): void {
    // hook
  };

  WarpDownlink.prototype.willLink = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didLink = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.willSync = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didSync = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.willUnlink = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didUnlink = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didConnect = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didDisconnect = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didClose = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.didFail = function (this: WarpDownlink, error: unknown): void {
    // hook
  };

  WarpDownlink.prototype.onEventMessage = function (this: WarpDownlink, message: EventMessage): void {
    this.onEvent(message.body);
    this.callObservers("onEvent", message.body, this);
  };

  WarpDownlink.prototype.onCommandMessage = function (this: WarpDownlink, body: Value): void {
    this.onCommand(body);
    this.callObservers("onCommand", body, this);
  };

  WarpDownlink.prototype.onLinkRequest = function (this: WarpDownlink, request?: LinkRequest): void {
    this.willLink();
    this.callObservers("willLink", this);
  };

  WarpDownlink.prototype.onLinkedResponse = function (this: WarpDownlink, response?: LinkedResponse): void {
    this.didLink();
    this.callObservers("didLink", this);
  };

  WarpDownlink.prototype.onSyncRequest = function (this: WarpDownlink, request?: SyncRequest): void {
    this.willSync();
    this.callObservers("willSync", this);
  };

  WarpDownlink.prototype.onSyncedResponse = function (this: WarpDownlink, response?: SyncedResponse): void {
    this.didSync();
    this.callObservers("didSync", this);
  };

  WarpDownlink.prototype.onUnlinkRequest = function (this: WarpDownlink, request?: UnlinkRequest): void {
    this.willUnlink();
    this.callObservers("willUnlink", this);
  };

  WarpDownlink.prototype.onUnlinkedResponse = function (this: WarpDownlink, response?: UnlinkedResponse): void {
    this.didUnlink();
    this.callObservers("didUnlink", this);
  };

  WarpDownlink.prototype.hostDidConnect = function (this: WarpDownlink): void {
    this.didConnect();
    this.callObservers("didConnect", this);
  };

  WarpDownlink.prototype.hostDidDisconnect = function (this: WarpDownlink): void {
    this.didDisconnect();
    this.callObservers("didDisconnect", this);
  };

  WarpDownlink.prototype.hostDidFail = function (this: WarpDownlink, error: unknown): void {
    this.didFail(error);
    this.callObservers("didFail", error, this);
  };

  WarpDownlink.prototype.observe = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    let observers = this.observers as Set<Observes<typeof this>> | null;
    if (observers === null) {
      observers = new Set<Observes<typeof this>>();
      (this as Mutable<typeof this>).observers = observers;
    } else if (observers.has(observer)) {
      return;
    }
    this.willObserve(observer);
    observers.add(observer);
    this.onObserve(observer);
    this.didObserve(observer);
  };

  WarpDownlink.prototype.willObserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    // hook
  };

  WarpDownlink.prototype.onObserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    // hook
  };

  WarpDownlink.prototype.didObserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    // hook
  };

  WarpDownlink.prototype.unobserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    const observers = this.observers as Set<Observes<typeof this>> | null;
    if (observers === null || !observers.has(observer)) {
      return;
    }
    this.willUnobserve(observer);
    observers.delete(observer);
    this.onUnobserve(observer);
    this.didUnobserve(observer);
  };

  WarpDownlink.prototype.willUnobserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    // hook
  };

  WarpDownlink.prototype.onUnobserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    // hook
  };

  WarpDownlink.prototype.didUnobserve = function (this: WarpDownlink, observer: Observes<typeof this>): void {
    // hook
  };

  WarpDownlink.prototype.callObservers = function <O, K extends keyof ObserverMethods<O>>(this: {readonly observerType?: Class<O>}, key: K, ...args: ObserverParameters<O, K>): void {
    const observers = (this as WarpDownlink).observers as ReadonlySet<ObserverMethods<O>> | null;
    if (observers === null) {
      return;
    }
    for (const observer of observers) {
      const method = observer[key];
      if (typeof method === "function") {
        method.call(observer, ...args);
      }
    }
  } as any;

  WarpDownlink.prototype.consume = function (this: WarpDownlink, consumer: Consumer): void {
    let consumers = this.consumers as Set<Consumer> | null;
    if (consumers === null) {
      consumers = new Set<Consumer>();
      (this as Mutable<typeof this>).consumers = consumers;
    } else if (consumers.has(consumer)) {
      return;
    }
    this.willConsume(consumer);
    consumers.add(consumer);
    this.onConsume(consumer);
    this.didConsume(consumer);
    if (consumers.size === 1 && this.mounted) {
      this.startConsuming();
    }
  };

  WarpDownlink.prototype.willConsume = function (this: WarpDownlink, consumer: Consumer): void {
    // hook
  };

  WarpDownlink.prototype.onConsume = function (this: WarpDownlink, consumer: Consumer): void {
    // hook
  };

  WarpDownlink.prototype.didConsume = function (this: WarpDownlink, consumer: Consumer): void {
    // hook
  };

  WarpDownlink.prototype.unconsume = function (this: WarpDownlink, consumer: Consumer): void {
    const consumers = this.consumers as Set<Consumer> | null;
    if (consumers === null || !consumers.has(consumer)) {
      return;
    }
    this.willUnconsume(consumer);
    consumers.delete(consumer);
    this.onUnconsume(consumer);
    this.didUnconsume(consumer);
    if (consumers.size === 0) {
      this.stopConsuming();
    }
  };

  WarpDownlink.prototype.willUnconsume = function (this: WarpDownlink, consumer: Consumer): void {
    // hook
  };

  WarpDownlink.prototype.onUnconsume = function (this: WarpDownlink, consumer: Consumer): void {
    // hook
  };

  WarpDownlink.prototype.didUnconsume = function (this: WarpDownlink, consumer: Consumer): void {
    // hook
  };

  Object.defineProperty(WarpDownlink.prototype, "consuming", {
    get(this: WarpDownlink): boolean {
      return (this.flags & WarpDownlink.ConsumingFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  WarpDownlink.prototype.startConsuming = function (this: WarpDownlink): void {
    if ((this.flags & WarpDownlink.ConsumingFlag) !== 0) {
      return;
    }
    this.willStartConsuming();
    this.setFlags(this.flags | WarpDownlink.ConsumingFlag);
    this.onStartConsuming();
    this.didStartConsuming();
  };

  WarpDownlink.prototype.willStartConsuming = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.onStartConsuming = function (this: WarpDownlink): void {
    this.setCoherent(false);
    this.decohere();
  };

  WarpDownlink.prototype.didStartConsuming = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.stopConsuming = function (this: WarpDownlink): void {
    if ((this.flags & WarpDownlink.ConsumingFlag) === 0) {
      return;
    }
    this.willStopConsuming();
    this.setFlags(this.flags & ~WarpDownlink.ConsumingFlag);
    this.onStopConsuming();
    this.didStopConsuming();
  };

  WarpDownlink.prototype.willStopConsuming = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.onStopConsuming = function (this: WarpDownlink): void {
    this.close();
  };

  WarpDownlink.prototype.didStopConsuming = function (this: WarpDownlink): void {
    // hook
  };

  WarpDownlink.prototype.open = function (this: WarpDownlink): WarpDownlink {
    throw new Error("abstract");
  };

  WarpDownlink.prototype.close = function (this: WarpDownlink): void {
    const model = this.model;
    if (model === null) {
      return;
    }
    (this as Mutable<typeof this>).model = null;
    model.removeDownlink(this);

    this.didClose();
    this.callObservers("didClose", this);
  };

  WarpDownlink.prototype.reopen = function (this: WarpDownlink): void {
    this.close();
    if ((this.flags & WarpDownlink.ConsumingFlag) !== 0) {
      this.setCoherent(false);
      this.decohere();
    }
  };

  WarpDownlink.prototype.recohere = function (this: WarpDownlink, t: number): void {
    this.setCoherent(true);
    if ((this.flags & WarpDownlink.ConsumingFlag) !== 0) {
      this.open();
    }
  };

  WarpDownlink.prototype.onMount = function (this: WarpDownlink): void {
    _super.prototype.onMount.call(this);
    if (this.consumers !== null && this.consumers.size !== 0) {
      this.startConsuming();
    }
  };

  WarpDownlink.prototype.onUnmount = function (this: WarpDownlink): void {
    _super.prototype.onUnmount.call(this);
    this.stopConsuming();
  };

  WarpDownlink.construct = function <F extends WarpDownlink<any>>(downlink: F | null, owner: F extends WarpDownlink<infer O> ? O : never): F {
    downlink = _super.construct.call(this, downlink, owner) as F;
    const flagsInit = downlink.flagsInit;
    if (flagsInit !== void 0) {
      downlink.initRelinks((flagsInit & WarpDownlink.RelinksFlag) !== 0);
      downlink.initSyncs((flagsInit & WarpDownlink.SyncsFlag) !== 0);
    }
    (downlink as Mutable<typeof downlink>).observers = null;
    (downlink as Mutable<typeof downlink>).consumers = null;
    (downlink as Mutable<typeof downlink>).hostUri = downlink.initHostUri();
    (downlink as Mutable<typeof downlink>).nodeUri = downlink.initNodeUri();
    (downlink as Mutable<typeof downlink>).laneUri = downlink.initLaneUri();
    (downlink as Mutable<typeof downlink>).prio = downlink.initPrio();
    (downlink as Mutable<typeof downlink>).rate = downlink.initRate();
    (downlink as Mutable<typeof downlink>).body = downlink.initBody();
    (downlink as Mutable<typeof downlink>).model = null;
    return downlink;
  };

  WarpDownlink.refine = function (downlinkClass: WarpDownlinkClass<any>): void {
    _super.refine.call(this, downlinkClass);
    const downlinkPrototype = downlinkClass.prototype;
    let flagsInit = downlinkPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(downlinkPrototype, "relinks")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (downlinkPrototype.relinks) {
        flagsInit |= WarpDownlink.RelinksFlag;
      } else {
        flagsInit &= ~WarpDownlink.RelinksFlag;
      }
      delete (downlinkPrototype as WarpDownlinkDescriptor).relinks;
    }

    if (Object.prototype.hasOwnProperty.call(downlinkPrototype, "syncs")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (downlinkPrototype.syncs) {
        flagsInit |= WarpDownlink.SyncsFlag;
      } else {
        flagsInit &= ~WarpDownlink.SyncsFlag;
      }
      delete (downlinkPrototype as WarpDownlinkDescriptor).syncs;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(downlinkPrototype, "flagsInit", {
        value: flagsInit,
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(downlinkPrototype, "hostUri")) {
      Object.defineProperty(downlinkPrototype, "hostUri", {
        value: Uri.fromAny(downlinkPrototype.hostUri),
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(downlinkPrototype, "nodeUri")) {
      Object.defineProperty(downlinkPrototype, "nodeUri", {
        value: Uri.fromAny(downlinkPrototype.nodeUri),
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(downlinkPrototype, "laneUri")) {
      Object.defineProperty(downlinkPrototype, "laneUri", {
        value: Uri.fromAny(downlinkPrototype.laneUri),
        enumerable: true,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(downlinkPrototype, "body")) {
      Object.defineProperty(downlinkPrototype, "body", {
        value: Value.fromAny(downlinkPrototype.body),
        enumerable: true,
        configurable: true,
      });
    }
  };

  (WarpDownlink as Mutable<typeof WarpDownlink>).RelinksFlag = 1 << (_super.FlagShift + 0);
  (WarpDownlink as Mutable<typeof WarpDownlink>).SyncsFlag = 1 << (_super.FlagShift + 1);
  (WarpDownlink as Mutable<typeof WarpDownlink>).ConsumingFlag = 1 << (_super.FlagShift + 2);

  (WarpDownlink as Mutable<typeof WarpDownlink>).FlagShift = _super.FlagShift + 3;
  (WarpDownlink as Mutable<typeof WarpDownlink>).FlagMask = (1 << WarpDownlink.FlagShift) - 1;

  return WarpDownlink;
})(Fastener);
