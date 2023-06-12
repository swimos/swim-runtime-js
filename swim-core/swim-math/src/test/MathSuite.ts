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

import {Unit} from "@swim/unit";
import {Suite} from "@swim/unit";
import {LengthSuite} from "./length/LengthSuite";
import {AngleSuite} from "./angle/AngleSuite";
import {R2Suite} from "./r2/R2Suite";
import {TransformSuite} from "./transform/TransformSuite";

export class MathSuite extends Suite {
  @Unit
  lengthSuite(): Suite {
    return new LengthSuite();
  }

  @Unit
  angleSuite(): Suite {
    return new AngleSuite();
  }

  @Unit
  r2Suite(): Suite {
    return new R2Suite();
  }

  @Unit
  transformSuite(): Suite {
    return new TransformSuite();
  }
}
