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

import type {AnyValue} from "@swim/structure";
import type {Value} from "@swim/structure";
import type {AnyUri} from "@swim/uri";
import type {WarpDownlinkContext} from "./WarpDownlinkContext";
import type {EventDownlinkDescriptor} from "./EventDownlink";
import type {EventDownlink} from "./EventDownlink";
import type {ValueDownlinkDescriptor} from "./ValueDownlink";
import type {ValueDownlink} from "./ValueDownlink";
import type {ListDownlinkDescriptor} from "./ListDownlink";
import type {ListDownlink} from "./ListDownlink";
import type {MapDownlinkDescriptor} from "./MapDownlink";
import type {MapDownlink} from "./MapDownlink";

/** @public */
export interface WarpRef extends WarpDownlinkContext {
  downlink(template?: ThisType<EventDownlink<this>> & EventDownlinkDescriptor & Partial<Omit<EventDownlink<this>, keyof EventDownlinkDescriptor>>): EventDownlink<this>;

  downlinkValue<V = Value, VU = V extends Value ? AnyValue : V>(template?: ThisType<ValueDownlink<this, V, VU>> & ValueDownlinkDescriptor<V, VU> & Partial<Omit<ValueDownlink<this, V, VU>, keyof ValueDownlinkDescriptor<V, VU>>>): ValueDownlink<this, V, VU>;

  downlinkList<V = Value, VU = V extends Value ? AnyValue : V>(template?: ThisType<ListDownlink<this, V, VU>> & ListDownlinkDescriptor<V, VU> & Partial<Omit<ListDownlink<this, V, VU>, keyof ListDownlinkDescriptor<V, VU>>>): ListDownlink<this, V, VU>;

  downlinkMap<K = Value, V = Value, KU = K extends Value ? AnyValue : K, VU = V extends Value ? AnyValue : V>(template?: ThisType<MapDownlink<this, K, V, KU, VU>> & MapDownlinkDescriptor<K, V, KU, VU> & Partial<Omit<MapDownlink<this, K, V, KU, VU>, keyof MapDownlinkDescriptor<K, V, KU, VU>>>): MapDownlink<this, K, V, KU, VU>;

  command(hostUri: AnyUri, nodeUri: AnyUri, laneUri: AnyUri, body: AnyValue): void;
  command(nodeUri: AnyUri, laneUri: AnyUri, body: AnyValue): void;
  command(laneUri: AnyUri, body: AnyValue): void;
  command(body: AnyValue): void;

  authenticate(hostUri: AnyUri, credentials: AnyValue): void;
  authenticate(credentials: AnyValue): void;

  hostRef(hostUri: AnyUri): WarpRef;

  nodeRef(hostUri: AnyUri, nodeUri: AnyUri): WarpRef;
  nodeRef(nodeUri: AnyUri): WarpRef;

  laneRef(hostUri: AnyUri, nodeUri: AnyUri, laneUri: AnyUri): WarpRef;
  laneRef(nodeUri: AnyUri, laneUri: AnyUri): WarpRef;
  laneRef(laneUri: AnyUri): WarpRef;
}

/** @public */
export const WarpRef = (function () {
  const WarpRef = {} as {
    /** @internal */
    has<K extends keyof WarpRef>(object: unknown, key: K): object is Required<Pick<WarpRef, K>>;

    /** @internal */
    is(object: unknown): object is WarpRef;
  };

  WarpRef.has = function <K extends keyof WarpRef>(object: unknown, key: K): object is Required<Pick<WarpRef, K>> {
    if (typeof object === "object" && object !== null || typeof object === "function") {
      return key in object;
    }
    return false;
  };

  WarpRef.is = function (object: unknown): object is WarpRef {
    if (typeof object === "object" && object !== null || typeof object === "function") {
      const warpRef = object as WarpRef;
      return "downlink" in warpRef
          && "downlinkValue" in warpRef
          && "downlinkList" in warpRef
          && "downlinkMap" in warpRef;
    }
    return false;
  };

  return WarpRef;
})();
