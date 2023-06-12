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

/**
 * Decorator that memoizes the computed value of a getter or nullary method.
 * @public
 */
export const Lazy: {
  <T, R>(target: (this: T) => R, context: ClassGetterDecoratorContext<T, R>): (this: T) => R;
  <T, R, F extends (this: T) => R>(target: F, context: ClassMethodDecoratorContext<T, F>): F;
} = function <T, R>(target: (this: T) => R, context: ClassGetterDecoratorContext<T, R> | ClassMethodDecoratorContext<T, (this: T) => R>): (this: T) => R {
  return function (this: T): R {
    const value = target.call(this);
    if (context.kind === "getter") {
      Object.defineProperty(this, context.name, {
        value,
        enumerable: true,
        configurable: true,
      });
    } else if (context.kind === "method") {
      Object.defineProperty(this, context.name, {
        value: function () {
          return value;
        },
        enumerable: true,
        configurable: true,
      });
    }
    return value;
  };
};
