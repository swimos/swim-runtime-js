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
import {Value} from "@swim/structure";
import {WarpDownlinkContext} from "./WarpDownlinkContext";
import type {WarpDownlinkDescriptor} from "./WarpDownlink";
import type {WarpDownlinkClass} from "./WarpDownlink";
import type {WarpDownlinkObserver} from "./WarpDownlink";
import {WarpDownlink} from "./WarpDownlink";
import {EventDownlinkModel} from "./EventDownlinkModel";

/** @public */
export interface EventDownlinkDescriptor extends WarpDownlinkDescriptor {
  extends?: Proto<EventDownlink<any>> | boolean | null;
}

/** @public */
export interface EventDownlinkClass<F extends EventDownlink<any> = EventDownlink<any>> extends WarpDownlinkClass<F> {
}

/** @public */
export interface EventDownlinkObserver<F extends EventDownlink<any> = EventDownlink> extends WarpDownlinkObserver<F> {
}

/** @public */
export interface EventDownlink<O = unknown> extends WarpDownlink<O> {
  /** @override */
  get descriptorType(): Proto<EventDownlinkDescriptor>;

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
    if (this.model !== null) {
      return this;
    }
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
    if (!WarpDownlinkContext.is(owner)) {
      throw new Error("no downlink context");
    }
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
    return this;
  };

  return EventDownlink;
})(WarpDownlink);
