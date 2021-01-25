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

import {AnyItem, Item} from "../Item";
import {Form} from "./Form";

/** @hidden */
export class AnyForm extends Form<AnyItem> {
  constructor(unit?: AnyItem) {
    super();
    Object.defineProperty(this, "unit", {
      value: unit,
      enumerable: true,
    });
  }

  // @ts-ignore
  declare readonly unit: AnyItem | undefined;

  withUnit(unit: AnyItem | undefined): Form<AnyItem> {
    if (unit !== this.unit) {
      return new AnyForm(unit);
    } else {
      return this;
    }
  }

  mold(object: AnyItem, item?: Item): Item {
    object = Item.fromAny(object);
    if (item !== void 0) {
      object = item.concat(object);
    }
    return object;
  }

  cast(item: Item, object?: AnyItem): AnyItem | undefined {
    return item.toAny();
  }
}
