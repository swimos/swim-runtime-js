// Copyright 2015-2021 Swim Inc.
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

import {AnimatorClass, Animator} from "./Animator";

/** @internal */
export const BooleanAnimator = (function (_super: typeof Animator) {
  const BooleanAnimator = _super.extend() as AnimatorClass<Animator<any, boolean | null | undefined, boolean | string | null | undefined>>;

  BooleanAnimator.prototype.fromAny = function (value: boolean | string | null | undefined): boolean | null | undefined {
    return !!value;
  };

  BooleanAnimator.prototype.equalState = function (newState: boolean | null | undefined, oldState: boolean | null | undefined): boolean {
    return newState === oldState;
  };

  return BooleanAnimator;
})(Animator);