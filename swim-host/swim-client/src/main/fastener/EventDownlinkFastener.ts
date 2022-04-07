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

import type {Proto} from "@swim/util";
import type {EventDownlinkObserver, EventDownlink} from "../downlink/EventDownlink";
import type {WarpRef} from "../ref/WarpRef";
import {
  DownlinkFastenerRefinement,
  DownlinkFastenerTemplate,
  DownlinkFastenerClass,
  DownlinkFastener,
} from "./DownlinkFastener";

/** @public */
export interface EventDownlinkFastenerRefinement extends DownlinkFastenerRefinement {
}

/** @public */
export interface EventDownlinkFastenerTemplate extends DownlinkFastenerTemplate {
  extends?: Proto<EventDownlinkFastener<any>> | string | boolean | null;
}

/** @public */
export interface EventDownlinkFastenerClass<F extends EventDownlinkFastener<any> = EventDownlinkFastener<any>> extends DownlinkFastenerClass<F> {
  /** @override */
  specialize(className: string, template: EventDownlinkFastenerTemplate): EventDownlinkFastenerClass;

  /** @override */
  refine(fastenerClass: EventDownlinkFastenerClass): void;

  /** @override */
  extend(className: string, template: EventDownlinkFastenerTemplate): EventDownlinkFastenerClass<F>;

  /** @override */
  specify<O>(className: string, template: ThisType<EventDownlinkFastener<O>> & EventDownlinkFastenerTemplate & Partial<Omit<EventDownlinkFastener<O>, keyof EventDownlinkFastenerTemplate>>): EventDownlinkFastenerClass<F>;

  /** @override */
  <O>(template: ThisType<EventDownlinkFastener<O>> & EventDownlinkFastenerTemplate & Partial<Omit<EventDownlinkFastener<O>, keyof EventDownlinkFastenerTemplate>>): PropertyDecorator;
}

/** @public */
export type EventDownlinkFastenerDef<O, R extends EventDownlinkFastenerRefinement> =
  EventDownlinkFastener<O> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function EventDownlinkFastenerDef<F extends EventDownlinkFastener<any>>(
  template: F extends EventDownlinkFastenerDef<infer O, infer R>
          ? ThisType<EventDownlinkFastenerDef<O, R>>
          & EventDownlinkFastenerTemplate
          & Partial<Omit<EventDownlinkFastener<O>, keyof EventDownlinkFastenerTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof EventDownlinkFastenerTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return EventDownlinkFastener(template);
}

/** @public */
export interface EventDownlinkFastener<O = unknown> extends DownlinkFastener<O>, EventDownlinkObserver {
  /** @override */
  readonly downlink: EventDownlink | null;

  /** @internal @override */
  createDownlink(warp: WarpRef): EventDownlink;

  /** @override */
  initDownlink?(downlink: EventDownlink): EventDownlink;

  /** @internal @override */
  bindDownlink(downlink: EventDownlink): EventDownlink;
}

/** @public */
export const EventDownlinkFastener = (function (_super: typeof DownlinkFastener) {
  const EventDownlinkFastener: EventDownlinkFastenerClass = _super.extend("EventDownlinkFastener", {}) as EventDownlinkFastenerClass;

  EventDownlinkFastener.prototype.createDownlink = function <V, VU>(this: EventDownlinkFastener<unknown>, warp: WarpRef): EventDownlink {
    return warp.downlink();
  };

  return EventDownlinkFastener;
})(DownlinkFastener);
