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

import {R2Function} from "../vector/R2Function";
import {AnyShape, Shape} from "./Shape";
import {PointR2Init, PointR2Tuple, PointR2} from "./PointR2";
import {SegmentR2Init, SegmentR2} from "./SegmentR2";
import {BoxR2Init, BoxR2} from "./BoxR2";
import {CircleR2Init, CircleR2} from "./CircleR2";

export type AnyShapeR2 = ShapeR2 | PointR2Init | PointR2Tuple | SegmentR2Init | BoxR2Init | CircleR2Init;

export abstract class ShapeR2 implements Shape {
  abstract get xMin(): number;

  abstract get yMin(): number;

  abstract get xMax(): number;

  abstract get yMax(): number;

  abstract contains(that: AnyShape): boolean;

  abstract contains(x: number, y: number): boolean;

  abstract intersects(that: AnyShape): boolean;

  union(that: AnyShapeR2): ShapeR2 {
    that = ShapeR2.fromAny(that);
    return new ShapeR2.Box(Math.min(this.xMin, that.xMin),
                           Math.min(this.yMin, that.yMin),
                           Math.max(this.xMax, that.xMax),
                           Math.max(this.yMax, that.yMax));
  }

  abstract transform(f: R2Function): ShapeR2;

  boundingBox(): BoxR2 {
    return new ShapeR2.Box(this.xMin, this.yMin, this.xMax, this.yMax);
  }

  static fromAny(value: AnyShapeR2): ShapeR2 {
    if (value instanceof ShapeR2) {
      return value;
    } else if (ShapeR2.Point.isInit(value)) {
      return ShapeR2.Point.fromInit(value);
    } else if (ShapeR2.Point.isTuple(value)) {
      return ShapeR2.Point.fromTuple(value);
    } else if (ShapeR2.Segment.isInit(value)) {
      return ShapeR2.Segment.fromInit(value);
    } else if (ShapeR2.Box.isInit(value)) {
      return ShapeR2.Box.fromInit(value);
    } else if (ShapeR2.Circle.isInit(value)) {
      return ShapeR2.Circle.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyShapeR2 {
    return value instanceof ShapeR2
        || ShapeR2.Point.isInit(value)
        || ShapeR2.Point.isTuple(value)
        || ShapeR2.Segment.isInit(value)
        || ShapeR2.Box.isInit(value)
        || ShapeR2.Circle.isInit(value);
  }

  // Forward type declarations
  /** @hidden */
  static Point: typeof PointR2; // defined by PointR2
  /** @hidden */
  static Segment: typeof SegmentR2; // defined by SegmentR2
  /** @hidden */
  static Box: typeof BoxR2; // defined by BoxR2
  /** @hidden */
  static Circle: typeof CircleR2; // defined by CircleR2
}
Shape.R2 = ShapeR2;
