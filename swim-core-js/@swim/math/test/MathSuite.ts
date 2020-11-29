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

import {LengthSuite} from "./length/LengthSuite";
import {AngleSuite} from "./angle/AngleSuite";
import {TransformSuite} from "./transform/TransformSuite";
import {CurveSuite} from "./curve/CurveSuite";
import {SplineSuite} from "./spline/SplineSuite";
import {PathSuite} from "./path/PathSuite";

@Unit
export class MathSuite extends Spec {
  @Unit
  lengthSuite(): Spec {
    return new LengthSuite();
  }

  @Unit
  angleSuite(): Spec {
    return new AngleSuite();
  }

  @Unit
  transformSuite(): Spec {
    return new TransformSuite();
  }

  @Unit
  curveSuite(): Spec {
    return new CurveSuite();
  }

  @Unit
  splineSuite(): Spec {
    return new SplineSuite();
  }

  @Unit
  pathSuite(): Spec {
    return new PathSuite();
  }
}
