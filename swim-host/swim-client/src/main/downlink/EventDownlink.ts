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

import type {Mutable, Class, Proto} from "@swim/util";
import {Value} from "@swim/structure";
import {WarpDownlinkContext} from "./WarpDownlinkContext";
import {WarpDownlinkRefinement, WarpDownlinkTemplate, WarpDownlinkClass, WarpDownlink} from "./WarpDownlink";
import {EventDownlinkModel} from "./EventDownlinkModel";
import type {EventDownlinkObserver} from "./EventDownlinkObserver";

/** @public */
export interface EventDownlinkRefinement extends WarpDownlinkRefinement {
}

/** @public */
export interface EventDownlinkTemplate extends WarpDownlinkTemplate {
  extends?: Proto<EventDownlink<any>> | string | boolean | null;
}

/** @public */
export interface EventDownlinkClass<D extends EventDownlink<any> = EventDownlink<any>> extends WarpDownlinkClass<D> {
  /** @override */
  specialize(className: string, template: EventDownlinkTemplate): EventDownlinkClass;

  /** @override */
  refine(downlinkClass: EventDownlinkClass): void;

  /** @override */
  extend(className: string, template: EventDownlinkTemplate): EventDownlinkClass<D>;

  /** @override */
  specify<O>(className: string, template: ThisType<EventDownlink<O>> & EventDownlinkTemplate & Partial<Omit<EventDownlink<O>, keyof EventDownlinkTemplate>>): EventDownlinkClass<D>;

  /** @override */
  <O>(template: ThisType<EventDownlink<O>> & EventDownlinkTemplate & Partial<Omit<EventDownlink<O>, keyof EventDownlinkTemplate>>): PropertyDecorator;
}

/** @public */
export type EventDownlinkDef<O, R extends EventDownlinkRefinement> =
  EventDownlink<O> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function EventDownlinkDef<D extends EventDownlink<any>>(
  template: D extends EventDownlinkDef<infer O, infer R>
          ? ThisType<EventDownlinkDef<O, R>>
          & EventDownlinkTemplate
          & Partial<Omit<EventDownlink<O>, keyof EventDownlinkTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof EventDownlinkTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return EventDownlink(template);
}

/** @public */
export interface EventDownlink<O = unknown> extends WarpDownlink<O> {
  /** @override */
  readonly observerType?: Class<EventDownlinkObserver>;

  /** @internal @override */
  readonly model: EventDownlinkModel | null;

  /** @override */
  open(): this;
}

/** @public */
export const EventDownlink = (function (_super: typeof WarpDownlink) {
  const EventDownlink = _super.extend("EventDownlink", {
    relinks: true,
  }) as EventDownlinkClass;

  EventDownlink.prototype.open = function (this: EventDownlink): EventDownlink {
    if (this.model === null) {
      const laneUri = this.getLaneUri();
      if (laneUri === null) {
        throw new Error("no laneUri");
      }
      let nodeUri = this.getNodeUri();
      if (nodeUri === null) {
        throw new Error("no nodeUri");
      }
      let hostUri = this.getHostUri();
      if (hostUri === null) {
        hostUri = nodeUri.endpoint();
        nodeUri = hostUri.unresolve(nodeUri);
      }
      let prio = this.getPrio();
      if (prio === void 0) {
        prio = 0;
      }
      let rate = this.getRate();
      if (rate === void 0) {
        rate = 0;
      }
      let body = this.getBody();
      if (body === null) {
        body = Value.absent();
      }
      const owner = this.owner;
      if (WarpDownlinkContext.is(owner)) {
        let model = owner.getDownlink(hostUri, nodeUri, laneUri);
        if (model !== null) {
          if (!(model instanceof EventDownlinkModel)) {
            throw new Error("downlink type mismatch");
          }
          model.addDownlink(this);
        } else {
          model = new EventDownlinkModel(hostUri, nodeUri, laneUri, prio, rate, body);
          model.addDownlink(this);
          owner.openDownlink(model);
        }
        (this as Mutable<typeof this>).model = model as EventDownlinkModel;
      } else {
        throw new Error("no downlink context");
      }
    }
    return this;
  };

  return EventDownlink;
})(WarpDownlink);
