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

import {Lazy} from "@swim/util";
import {AnyItem, Item} from "./Item";
import {Field} from "./Field";
import {Attr} from "./Attr";
import {Slot} from "./Slot";
import {AnyValue, Value} from "./Value";
import {Record} from "./Record";
import {RecordMapView} from "./"; // forward import
import {AnyText, Text} from "./"; // forward import
import {AnyNum, Num} from "./"; // forward import
import {AnyInterpreter, Interpreter} from "./"; // forward import

/** @hidden */
export class RecordMap extends Record {
  constructor(array: Array<Item> | null, table: Array<Field> | null,
              length: number, fieldCount: number, flags: number) {
    super();
    Object.defineProperty(this, "array", {
      value: array,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: table,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: length,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: fieldCount,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: flags,
      enumerable: true,
      configurable: true,
    });
  }

  /** @hidden */
  declare readonly array: Array<Item> | null;

  /** @hidden */
  declare readonly table: Array<Field> | null;

  isEmpty(): boolean {
    return this.length === 0;
  }

  declare readonly length: number;

  // @ts-ignore
  declare readonly fieldCount: number;

  get valueCount(): number {
    return this.length - this.fieldCount;
  }

  /** @hidden */
  declare readonly flags: number;

  isConstant(): boolean {
    const array = this.array;
    for (let i = 0, n = this.length; i < n; i += 1) {
      if (!array![i]!.isConstant()) {
        return false;
      }
    }
    return true;
  }

  get tag(): string | undefined {
    if (this.fieldCount > 0) {
      const head = this.array![0];
      if (head instanceof Attr) {
        return head.key.value;
      }
    }
    return void 0;
  }

  get target(): Value {
    let value: Value | undefined;
    let record: Record | undefined;
    let modified = false;
    const array = this.array!;
    for (let i = 0, n = this.length; i < n; i += 1) {
      const item = array[i];
      if (item instanceof Attr) {
        modified = true;
      } else if (value === void 0 && item instanceof Value) {
        value = item;
      } else {
        if (record === void 0) {
          record = Record.create();
          if (value !== void 0) {
            record.push(value);
          }
        }
        record.push(item);
      }
    }
    if (value === void 0) {
      return Value.extant();
    } else if (record === void 0) {
      return value;
    } else if (modified) {
      return record;
    } else {
      return this;
    }
  }

  head(): Item {
    if (this.length > 0) {
      return this.array![0]!;
    }
    return Item.absent();
  }

  tail(): Record {
    const n = this.length;
    if (n > 0) {
      return new RecordMapView(this, 1, n);
    } else {
      return Record.empty();
    }
  }

  body(): Value {
    const n = this.length;
    if (n > 2) {
      return new RecordMapView(this, 1, n).branch();
    } else if (n === 2) {
      const item = this.array![1];
      if (item instanceof Value) {
        return item;
      } else {
        return Record.of(item);
      }
    }
    return Value.absent();
  }

  has(key: AnyValue): boolean {
    if (this.fieldCount !== 0) {
      key = Value.fromAny(key);
      const table = this.hashTable()!;
      const n = table.length;
      //assert(n > 0);
      const x = Math.abs(key.hashCode() % n);
      let i = x;
      do {
        const field = table[i];
        if (field !== void 0) {
          if (field.key.equals(key)) {
            return true;
          }
        } else {
          break;
        }
        i = (i + 1) % n;
      } while (i !== x);
    }
    return false;
  }

  indexOf(item: AnyItem, index: number = 0): number {
    item = Item.fromAny(item);
    const array = this.array!;
    const n = this.length;
    if (index < 0) {
      index = Math.max(0, n + index);
    }
    while (index < n) {
      if (item.equals(array[index])) {
        return index;
      }
      index += 1;
    }
    return -1;
  }

  lastIndexOf(item: AnyItem, index?: number): number {
    item = Item.fromAny(item);
    const array = this.array!;
    const n = this.length;
    if (index === void 0) {
      index = n - 1;
    } else if (index < 0) {
      index = n + index;
    }
    index = Math.min(index, n - 1);
    while (index >= 0) {
      if (item.equals(array[index])) {
        return index;
      }
      index -= 1;
    }
    return -1;
  }

  get(key: AnyValue): Value {
    if (this.fieldCount > 0) {
      key = Value.fromAny(key);
      const table = this.hashTable()!;
      const n = table.length;
      //assert(n > 0);
      const x = Math.abs(key.hashCode() % n);
      let i = x;
      do {
        const field = table[i];
        if (field !== void 0) {
          if (field.key.equals(key)) {
            return field.value;
          }
        } else {
          break;
        }
        i = (i + 1) % n;
      } while (i !== x);
    }
    return Value.absent();
  }

  getAttr(key: AnyText): Value {
    if (this.fieldCount > 0) {
      key = Text.fromAny(key);
      const table = this.hashTable()!;
      const n = table.length;
      //assert(n > 0);
      const x = Math.abs(key.hashCode() % n);
      let i = x;
      do {
        const field = table[i];
        if (field !== void 0) {
          if (field instanceof Attr && field.key.equals(key)) {
            return field.value;
          }
        } else {
          break;
        }
        i = (i + 1) % n;
      } while (i !== x);
    }
    return Value.absent();
  }

  getSlot(key: AnyValue): Value {
    if (this.fieldCount > 0) {
      key = Value.fromAny(key);
      const table = this.hashTable()!;
      const n = table.length;
      //assert(n > 0);
      const x = Math.abs(key.hashCode() % n);
      let i = x;
      do {
        const field = table[i];
        if (field !== void 0) {
          if (field instanceof Slot && field.key.equals(key)) {
            return field.value;
          }
        } else {
          break;
        }
        i = (i + 1) % n;
      } while (i !== x);
    }
    return Value.absent();
  }

  getField(key: AnyValue): Field | undefined {
    if (this.fieldCount > 0) {
      key = Value.fromAny(key);
      const table = this.hashTable()!;
      const n = table.length;
      //assert(n > 0);
      const x = Math.abs(key.hashCode() % n);
      let i = x;
      do {
        const field = table[i];
        if (field !== void 0) {
          if (field.key.equals(key)) {
            return field;
          }
        } else {
          break;
        }
        i = (i + 1) % n;
      } while (i !== x);
    }
    return void 0;
  }

  getItem(index: AnyNum): Item {
    if (index instanceof Num) {
      index = index.value;
    }
    const n = this.length;
    if (index < 0) {
      index = n + index;
    }
    if (index >= 0 && index < n) {
      return this.array![index]!;
    } else {
      return Item.absent();
    }
  }

  set(key: AnyValue, newValue: Value): this {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    key = Value.fromAny(key);
    newValue = Value.fromAny(newValue);
    if ((this.flags & Record.AliasedFlag) !== 0) {
      if (this.fieldCount > 0) {
        this.setAliased(key, newValue);
      } else {
        this.pushAliased(new Slot(key, newValue));
      }
    } else {
      if (this.fieldCount > 0) {
        if (this.table !== null) {
          this.setMutable(key, newValue);
        } else {
          this.updateMutable(key, newValue);
        }
      } else {
        this.pushMutable(new Slot(key, newValue));
      }
    }
    return this;
  }

  private setAliased(key: Value, newValue: Value): void {
    const n = this.length;
    const oldArray = this.array!;
    const newArray = new Array(Record.expand(n + 1));
    for (let i = 0; i < n; i += 1) {
      const item = oldArray[i];
      if (item instanceof Field && item.key.equals(key)) {
        newArray[i] = item.updatedValue(newValue);
        i += 1;
        while (i < n) {
          newArray[i] = oldArray[i];
          i += 1;
        }
        Object.defineProperty(this, "array", {
          value: newArray,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "flags", {
          value: this.flags & ~Record.AliasedFlag,
          enumerable: true,
          configurable: true,
        });
        return;
      }
      newArray[i] = item;
    }
    newArray[n] = new Slot(key, newValue);
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: n + 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: this.fieldCount + 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: this.flags & ~Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  private setMutable(key: Value, newValue: Value): void {
    const table = this.table!;
    const n = table.length;
    //assert(n > 0);
    const x = Math.abs(key.hashCode() % n);
    let i = x;
    do {
      const field = table[i];
      if (field !== void 0) {
        if (field.key.equals(key)) {
          if (field.isMutable()) {
            field.setValue(newValue);
            return;
          } else {
            this.updateMutable(key, newValue);
            return;
          }
        }
      } else {
        break;
      }
      i = (i + 1) % n;
    } while (i !== x);
    const field = new Slot(key, newValue);
    this.pushMutable(field);
    RecordMap.put(table, field);
  }

  private updateMutable(key: Value, newValue: Value): void {
    const array = this.array!;
    for (let i = 0, n = this.length; i < n; i += 1) {
      const item = array[i];
      if (item instanceof Field && item.key.equals(key)) {
        array[i] = item.updatedValue(newValue);
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        return;
      }
    }
    const field = new Slot(key, newValue);
    this.pushMutable(field);
    RecordMap.put(this.table, field);
  }

  setAttr(key: AnyText, newValue: Value): this {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    key = Text.fromAny(key);
    newValue = Value.fromAny(newValue);
    if ((this.flags & Record.AliasedFlag) !== 0) {
      if (this.fieldCount > 0) {
        this.setAttrAliased(key, newValue);
      } else {
        this.pushAliased(new Attr(key, newValue));
      }
    } else {
      if (this.fieldCount > 0) {
        if (this.table !== null) {
          this.setAttrMutable(key, newValue);
        } else {
          this.updateAttrMutable(key, newValue);
        }
      } else {
        this.pushMutable(new Attr(key, newValue));
      }
    }
    return this;
  }

  private setAttrAliased(key: Text, newValue: Value): void {
    const n = this.length;
    const oldArray = this.array!;
    const newArray = new Array(Record.expand(n + 1));
    for (let i = 0; i < n; i += 1) {
      const item = oldArray[i];
      if (item instanceof Field && item.key.equals(key)) {
        newArray[i] = new Attr(key, newValue);
        i += 1;
        while (i < n) {
          newArray[i] = oldArray[i];
          i += 1;
        }
        Object.defineProperty(this, "array", {
          value: newArray,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "flags", {
          value: this.flags & ~Record.AliasedFlag,
          enumerable: true,
          configurable: true,
        });
        return;
      }
      newArray[i] = item;
    }
    newArray[n] = new Attr(key, newValue);
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: n + 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: this.fieldCount + 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: this.flags & ~Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  private setAttrMutable(key: Text, newValue: Value): void {
    const table = this.table!;
    const n = table.length;
    //assert(n > 0);
    const x = Math.abs(key.hashCode() % n);
    let i = x;
    do {
      const field = table[i];
      if (field !== void 0) {
        if (field.key.equals(key)) {
          if (field instanceof Attr && field.isMutable()) {
            field.setValue(newValue);
          } else {
            this.updateAttrMutable(key, newValue);
          }
          return;
        }
      } else {
        break;
      }
      i = (i + 1) % n;
    } while (i !== x);
    const field = new Attr(key, newValue);
    this.push(field);
    RecordMap.put(table, field);
  }

  private updateAttrMutable(key: Text, newValue: Value): void {
    const array = this.array!;
    for (let i = 0, n = this.length; i < n; i += 1) {
      const item = array[i];
      if (item instanceof Field && item.key.equals(key)) {
        array[i] = new Attr(key, newValue);
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        return;
      }
    }
    const field = new Attr(key, newValue);
    this.push(field);
    RecordMap.put(this.table, field);
  }

  setSlot(key: AnyValue, newValue: Value): this {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    key = Value.fromAny(key);
    newValue = Value.fromAny(newValue);
    if ((this.flags & Record.AliasedFlag) !== 0) {
      if (this.fieldCount > 0) {
        this.setSlotAliased(key, newValue);
      } else {
        this.pushAliased(new Slot(key, newValue));
      }
    } else {
      if (this.fieldCount > 0) {
        if (this.table !== null) {
          this.setSlotMutable(key, newValue);
        } else {
          this.updateSlotMutable(key, newValue);
        }
      } else {
        this.pushMutable(new Slot(key, newValue));
      }
    }
    return this;
  }

  private setSlotAliased(key: Value, newValue: Value): void {
    const n = this.length;
    const oldArray = this.array!;
    const newArray = new Array(Record.expand(n + 1));
    for (let i = 0; i < n; i += 1) {
      const item = oldArray[i];
      if (item instanceof Field && item.key.equals(key)) {
        newArray[i] = new Slot(key, newValue);
        i += 1;
        while (i < n) {
          newArray[i] = oldArray[i];
          i += 1;
        }
        Object.defineProperty(this, "array", {
          value: newArray,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "flags", {
          value: this.flags & ~Record.AliasedFlag,
          enumerable: true,
          configurable: true,
        });
        return;
      }
      newArray[i] = item;
    }
    newArray[n] = new Slot(key, newValue);
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: n + 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: this.fieldCount + 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: this.flags & ~Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  private setSlotMutable(key: Value, newValue: Value): void {
    const table = this.table!;
    const n = table.length;
    //assert(n > 0);
    const x = Math.abs(key.hashCode() % n);
    let i = x;
    do {
      const field = table[i];
      if (field !== void 0) {
        if (field.key.equals(key)) {
          if (field instanceof Slot && field.isMutable()) {
            field.setValue(newValue);
          } else {
            this.updateSlotMutable(key, newValue);
          }
          return;
        }
      } else {
        break;
      }
      i = (i + 1) % n;
    } while (i !== x);
    const field = new Slot(key, newValue);
    this.push(field);
    RecordMap.put(table, field);
  }

  private updateSlotMutable(key: Value, newValue: Value): void {
    const array = this.array!;
    for (let i = 0, n = this.length; i < n; i += 1) {
      const item = array[i];
      if (item instanceof Field && item.key.equals(key)) {
        array[i] = new Slot(key, newValue);
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        return;
      }
    }
    const field = new Slot(key, newValue);
    this.push(field);
    RecordMap.put(this.table, field);
  }

  setItem(index: number, newItem: AnyItem): this {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    newItem = Item.fromAny(newItem);
    const n = this.length;
    if (index < 0) {
      index = n + index;
    }
    if (index < 0 || index > n) {
      throw new RangeError("" + index);
    }
    if ((this.flags & Record.AliasedFlag) !== 0) {
      this.setItemAliased(index, newItem);
    } else {
      this.setItemMutable(index, newItem);
    }
    return this;
  }

  private setItemAliased(index: number, newItem: Item): void {
    const n = this.length;
    const oldArray = this.array!;
    const newArray = new Array(Record.expand(n));
    for (let i = 0; i < n; i += 1) {
      newArray[i] = oldArray[i];
    }
    const oldItem = oldArray[index];
    newArray[index] = newItem;
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    if (newItem instanceof Field) {
      if (!(oldItem instanceof Field)) {
        Object.defineProperty(this, "fieldCount", {
          value: this.fieldCount + 1,
          enumerable: true,
          configurable: true,
        });
      }
    } else if (oldItem instanceof Field) {
      Object.defineProperty(this, "fieldCount", {
        value: this.fieldCount - 1,
        enumerable: true,
        configurable: true,
      });
    }
    Object.defineProperty(this, "flags", {
      value: this.flags & ~Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  private setItemMutable(index: number, newItem: Item): void {
    const array = this.array!;
    const oldItem = array[index];
    array[index] = newItem;
    if (newItem instanceof Field) {
      Object.defineProperty(this, "table", {
        value: null,
        enumerable: true,
        configurable: true,
      });
      if (!(oldItem instanceof Field)) {
        Object.defineProperty(this, "fieldCount", {
          value: this.fieldCount + 1,
          enumerable: true,
          configurable: true,
        });
      }
    } else if (oldItem instanceof Field) {
      Object.defineProperty(this, "table", {
        value: null,
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(this, "fieldCount", {
        value: this.fieldCount - 1,
        enumerable: true,
        configurable: true,
      });
    }
  }

  updated(key: AnyValue, newValue: AnyValue): Record {
    key = Value.fromAny(key);
    newValue = Value.fromAny(newValue);
    const record = (this.flags & Record.ImmutableFlag) === 0 ? this : this.branch();
    if ((record.flags & Record.AliasedFlag) !== 0) {
      if (record.fieldCount > 0) {
        record.setAliased(key, newValue);
      } else {
        record.pushAliased(new Slot(key, newValue));
      }
    } else {
      if (record.fieldCount > 0) {
        if (record.table !== null) {
          record.setMutable(key, newValue);
        } else {
          record.updateMutable(key, newValue);
        }
      } else {
        record.pushMutable(new Slot(key, newValue));
      }
    }
    return record;
  }

  updatedAttr(key: AnyText, newValue: AnyValue): Record {
    key = Text.fromAny(key);
    newValue = Value.fromAny(newValue);
    const record = (this.flags & Record.ImmutableFlag) === 0 ? this : this.branch();
    if ((record.flags & Record.AliasedFlag) !== 0) {
      if (record.fieldCount > 0) {
        record.setAttrAliased(key, newValue);
      } else {
        record.pushAliased(new Attr(key, newValue));
      }
    } else {
      if (record.fieldCount > 0) {
        if (record.table !== null) {
          record.setAttrMutable(key, newValue);
        } else {
          record.updateAttrMutable(key, newValue);
        }
      } else {
        record.pushMutable(new Attr(key, newValue));
      }
    }
    return record;
  }

  updatedSlot(key: AnyValue, newValue: AnyValue): Record {
    key = Value.fromAny(key);
    newValue = Value.fromAny(newValue);
    const record = (this.flags & Record.ImmutableFlag) === 0 ? this : this.branch();
    if ((record.flags & Record.AliasedFlag) !== 0) {
      if (record.fieldCount > 0) {
        record.setSlotAliased(key, newValue);
      } else {
        record.pushAliased(new Slot(key, newValue));
      }
    } else {
      if (record.fieldCount > 0) {
        if (record.table !== null) {
          record.setSlotMutable(key, newValue);
        } else {
          record.updateSlotMutable(key, newValue);
        }
      } else {
        record.pushMutable(new Slot(key, newValue));
      }
    }
    return record;
  }

  push(...newItems: AnyItem[]): number {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    if ((this.flags & Record.AliasedFlag) !== 0) {
      this.pushAliased(...newItems);
    } else {
      this.pushMutable(...newItems);
    }
    return this.length;
  }

  private pushAliased(...newItems: AnyItem[]): void {
    const k = newItems.length;
    let m = this.length;
    let n = this.fieldCount;
    const oldArray = this.array;
    const newArray = new Array(Record.expand(m + k));
    if (oldArray !== null) {
      for (let i = 0; i < m; i += 1) {
        newArray[i] = oldArray[i];
      }
    }
    for (let i = 0; i < k; i += 1) {
      const newItem = Item.fromAny(newItems[i]);
      newArray[m] = newItem;
      m += 1;
      if (newItem instanceof Field) {
        n += 1;
      }
    }
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: m,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: n,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: this.flags & ~Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  private pushMutable(...newItems: AnyItem[]): void {
    const k = newItems.length;
    let m = this.length;
    let n = this.fieldCount;
    const oldArray = this.array;
    let newArray;
    if (oldArray === null || m + k > oldArray.length) {
      newArray = new Array(Record.expand(m + k));
      if (oldArray !== null) {
        for (let i = 0; i < m; i += 1) {
          newArray[i] = oldArray[i];
        }
      }
    } else {
      newArray = oldArray;
    }
    for (let i = 0; i < k; i += 1) {
      const newItem = Item.fromAny(newItems[i]);
      newArray[m] = newItem;
      m += 1;
      if (newItem instanceof Field) {
        n += 1;
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
      }
    }
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: m,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: n,
      enumerable: true,
      configurable: true,
    });
  }

  splice(start: number, deleteCount: number = 0, ...newItems: AnyItem[]): Item[] {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    const n = this.length;
    if (start < 0) {
      start = n + start;
    }
    start = Math.min(Math.max(0, start), n);
    deleteCount = Math.min(Math.max(0, deleteCount), n - start);
    if ((this.flags & Record.AliasedFlag) !== 0) {
      return this.spliceAliased(start, deleteCount, ...newItems);
    } else {
      return this.spliceMutable(start, deleteCount, ...newItems);
    }
  }

  /** @hidden */
  spliceAliased(start: number, deleteCount: number, ...newItems: AnyItem[]): Item[] {
    const k = newItems.length;
    let m = this.length;
    let n = this.fieldCount;
    const oldArray = this.array!;
    const newArray = new Array(Record.expand(m - deleteCount + k));
    for (let i = 0; i < start; i += 1) {
      newArray[i] = oldArray[i];
    }
    const oldItems: Item[] = [];
    for (let i = start; i < start + deleteCount; i += 1) {
      const oldItem = oldArray[i]!;
      oldItems.push(oldItem);
      m -= 1;
      if (oldItem instanceof Field) {
        n -= 1;
      }
    }
    for (let i = start; i < m; i += 1) {
      newArray[i + k] = oldArray[i + deleteCount];
    }
    for (let i = 0; i < k; i += 1) {
      const newItem = Item.fromAny(newItems[i]);
      newArray[i + start] = newItem;
      m += 1;
      if (newItem instanceof Field) {
        n += 1;
      }
    }
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: m,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: n,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: this.flags & ~Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
    return oldItems;
  }

  /** @hidden */
  spliceMutable(start: number, deleteCount: number, ...newItems: AnyItem[]): Item[] {
    const k = newItems.length;
    let m = this.length;
    let n = this.fieldCount;
    const oldArray = this.array!;
    let newArray;
    if (oldArray === null || m - deleteCount + k > oldArray.length) {
      newArray = new Array(Record.expand(m - deleteCount + k));
      if (oldArray !== null) {
        for (let i = 0; i < start; i += 1) {
          newArray[i] = oldArray[i];
        }
      }
    } else {
      newArray = oldArray;
    }
    const oldItems: Item[] = [];
    for (let i = start; i < start + deleteCount; i += 1) {
      const oldItem = oldArray[i]!;
      oldItems.push(oldItem);
      m -= 1;
      if (oldItem instanceof Field) {
        n -= 1;
      }
    }
    if (k > deleteCount) {
      for (let i = m - 1; i >= start; i -= 1) {
        newArray[i + k] = oldArray[i + deleteCount];
      }
    } else {
      for (let i = start; i < m; i += 1) {
        newArray[i + k] = oldArray[i + deleteCount];
      }
    }
    for (let i = 0; i < k; i += 1) {
      const newItem = Item.fromAny(newItems[i]);
      newArray[i + start] = newItem;
      m += 1;
      if (newItem instanceof Field) {
        n += 1;
      }
    }
    Object.defineProperty(this, "array", {
      value: newArray,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: m,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: n,
      enumerable: true,
      configurable: true,
    });
    return oldItems;
  }

  delete(key: AnyValue): Item {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    key = Value.fromAny(key);
    if ((this.flags & Record.AliasedFlag) !== 0) {
      return this.deleteAliased(key);
    } else {
      return this.deleteMutable(key);
    }
  }

  private deleteAliased(key: Value): Item {
    const n = this.length;
    const oldArray = this.array!;
    const newArray = new Array(Record.expand(n));
    for (let i = 0; i < n; i += 1) {
      const item = oldArray[i];
      if (item instanceof Field && item.key.equals(key)) {
        for (let j = i + 1; j < n; j += 1, i += 1) {
          newArray[i] = oldArray[j];
        }
        Object.defineProperty(this, "array", {
          value: newArray,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "length", {
          value: n - 1,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "fieldCount", {
          value: this.fieldCount - 1,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "flags", {
          value: this.flags & ~Record.AliasedFlag,
          enumerable: true,
          configurable: true,
        });
        return item;
      }
      newArray[i] = item;
    }
    return Item.absent();
  }

  private deleteMutable(key: Value): Item {
    const n = this.length;
    const array = this.array!;
    for (let i = 0; i < n; i += 1) {
      const item = array[i]!;
      if (item instanceof Field && item.key.equals(key)) {
        for (let j = i + 1; j < n; j += 1, i += 1) {
          array[i] = array[j]!;
        }
        array[n - 1] = void 0 as any;
        Object.defineProperty(this, "table", {
          value: null,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "length", {
          value: n - 1,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, "fieldCount", {
          value: this.fieldCount - 1,
          enumerable: true,
          configurable: true,
        });
        return item;
      }
    }
    return Item.absent();
  }

  clear(): void {
    if ((this.flags & Record.ImmutableFlag) !== 0) {
      throw new Error("immutable");
    }
    Object.defineProperty(this, "array", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "table", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "length", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "fieldCount", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "flags", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
  }

  isAliased(): boolean {
    return (this.flags & Record.AliasedFlag) !== 0;
  }

  isMutable(): boolean {
    return (this.flags & Record.ImmutableFlag) === 0;
  }

  alias(): void {
    Object.defineProperty(this, "flags", {
      value: this.flags | Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  branch(): RecordMap {
    if ((this.flags & (Record.AliasedFlag | Record.ImmutableFlag)) === 0) {
      const array = this.array!;
      for (let i = 0, n = this.length; i < n; i += 1) {
        array[i]!.alias();
      }
    }
    Object.defineProperty(this, "flags", {
      value: this.flags | Record.AliasedFlag,
      enumerable: true,
      configurable: true,
    });
    return new RecordMap(this.array, this.table, this.length, this.fieldCount, Record.AliasedFlag);
  }

  clone(): RecordMap {
    const itemCount = this.length;
    const oldArray = this.array!;
    const newArray = new Array(itemCount);
    for (let i = 0; i < itemCount; i += 1) {
      newArray[i] = oldArray[i]!.clone();
    }
    return new RecordMap(newArray, null, itemCount, this.fieldCount, 0);
  }

  commit(): this {
    if ((this.flags & Record.ImmutableFlag) === 0) {
      Object.defineProperty(this, "flags", {
        value: this.flags | Record.ImmutableFlag,
        enumerable: true,
        configurable: true,
      });
      const array = this.array!;
      for (let i = 0, n = this.length; i < n; i += 1) {
        array[i]!.commit();
      }
    }
    return this;
  }

  hashTable(): Array<Field> | null {
    const n = this.fieldCount;
    let table = this.table;
    if (n !== 0 && table === null) {
      table = new Array(Record.expand(Math.max(n, n * 10 / 7)));
      const array = this.array!;
      for (let i = 0, m = this.length; i < m; i += 1) {
        const item = array[i];
        if (item instanceof Field) {
          RecordMap.put(table, item);
        }
      }
      Object.defineProperty(this, "table", {
        value: table,
        enumerable: true,
        configurable: true,
      });
    }
    return table;
  }

  /** @hidden */
  static put(table: Field[] | null, field: Field): void {
    if (table !== null) {
      const n = table.length;
      const x = Math.abs(field.key.hashCode() % n);
      let i = x;
      do {
        const item = table[i];
        if (item !== void 0) {
          if (field.key.equals(item.key)) {
            table[i] = field;
            return;
          }
        } else {
          table[i] = field;
          return;
        }
        i = (i + 1) % n;
      } while (i !== x);
      throw new Error();
    }
  }

  evaluate(interpreter: AnyInterpreter): Record {
    interpreter = Interpreter.fromAny(interpreter);
    const array = this.array!;
    const n = this.length;
    const scope = Record.create(n);
    interpreter.pushScope(scope);
    let changed = false;
    for (let i = 0; i < n; i += 1) {
      const oldItem = array[i]!;
      const newItem = oldItem.evaluate(interpreter);
      if (newItem.isDefined()) {
        scope.push(newItem);
      }
      if (oldItem !== newItem) {
        changed = true;
      }
    }
    interpreter.popScope();
    return changed ? scope : this;
  }

  substitute(interpreter: AnyInterpreter): Record {
    interpreter = Interpreter.fromAny(interpreter);
    const array = this.array!;
    const n = this.length;
    const scope = Record.create(n);
    interpreter.pushScope(scope);
    let changed = false;
    for (let i = 0; i < n; i += 1) {
      const oldItem = array[i]!;
      const newItem = oldItem.substitute(interpreter);
      if (newItem.isDefined()) {
        scope.push(newItem);
      }
      if (oldItem !== newItem) {
        changed = true;
      }
    }
    interpreter.popScope();
    return changed ? scope : this;
  }

  subRecord(lower?: number, upper?: number): Record {
    const n = this.length;
    if (lower === void 0) {
      lower = 0;
    } else if (lower < 0) {
      lower = n + lower;
    }
    if (upper === void 0) {
      upper = n;
    } else if (upper < 0) {
      upper = n + upper;
    }
    if (lower < 0 || upper > n || lower > upper) {
      throw new RangeError(lower + ", " + upper);
    }
    return new RecordMapView(this, lower, upper);
  }

  forEach<T>(callback: (item: Item, index: number) => T | void): T | undefined;
  forEach<T, S>(callback: (this: S, item: Item, index: number) => T | void,
                thisArg: S): T | undefined;
  forEach<T, S>(callback: (this: S | undefined, item: Item, index: number) => T | void,
                thisArg?: S): T | undefined {
    const array = this.array!;
    for (let i = 0, n = this.length; i < n; i += 1) {
      const result = callback.call(thisArg, array[i]!, i);
      if (result !== void 0) {
        return result;
      }
    }
    return void 0;
  }

  @Lazy
  static empty(): RecordMap {
    return new RecordMap(null, null, 0, 0, Record.AliasedFlag | Record.ImmutableFlag);
  }

  static create(initialCapacity?: number): RecordMap {
    if (initialCapacity === void 0) {
      return new RecordMap(null, null, 0, 0, Record.AliasedFlag);
    } else {
      return new RecordMap(new Array(initialCapacity), null, 0, 0, 0);
    }
  }

  static of(...items: AnyItem[]): RecordMap {
    const n = items.length;
    if (n === 0) {
      return new RecordMap(null, null, 0, 0, Record.AliasedFlag);
    } else {
      const array = new Array(n);
      let itemCount = 0;
      let fieldCount = 0;
      for (let i = 0; i < n; i += 1) {
        const item = Item.fromAny(items[i]);
        array[i] = item;
        itemCount += 1;
        if (item instanceof Field) {
          fieldCount += 1;
        }
      }
      return new RecordMap(array, null, itemCount, fieldCount, 0);
    }
  }
}
