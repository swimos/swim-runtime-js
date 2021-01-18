// Copyright 2015-2020 Swim inc.
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

import {Spec, Unit} from "@swim/unit";

import {LazySpec} from "./LazySpec";
import {Murmur3Spec} from "./Murmur3Spec";

@Unit
export class UtilSuite extends Spec {
  @Unit
  lazySpec(): Spec {
    return new LazySpec();
  }

  @Unit
  murmur3Spec(): Spec {
    return new Murmur3Spec();
  }
}
