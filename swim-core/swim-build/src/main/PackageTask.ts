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

import type {Class} from "@swim/util";
import type {TaskOptions} from "./Task";
import {Task} from "./Task";
import {PackageScope} from "./"; // forward import

/** @public */
export interface PackageTaskOptions extends TaskOptions {
}

/** @public */
export abstract class PackageTask extends Task {
  override readonly optionsType?: Class<PackageTaskOptions>;

  get packageScope(): PackageScope | null {
    return this.getParent(PackageScope);
  }
}