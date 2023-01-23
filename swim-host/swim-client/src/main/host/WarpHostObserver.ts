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

import type {Observer} from "@swim/util";
import type {Value} from "@swim/structure";
import type {WarpHost} from "./WarpHost";

/** @public */
export interface WarpHostObserver<H extends WarpHost = WarpHost> extends Observer {
  hostDidConnect?(host: H): void;

  hostDidAuthenticate?(body: Value, host: H): void;

  hostDidDeauthenticate?(body: Value, host: H): void;

  hostDidDisconnect?(host: H): void;

  hostDidFail?(error: unknown, host: H): void;
}
