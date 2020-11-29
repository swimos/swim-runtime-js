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

import {Interpolator} from "@swim/interpolate";
import {ShapeR2} from "./ShapeR2";
import {PointR2} from "./PointR2";
import {SegmentR2} from "./SegmentR2";
import {BoxR2} from "./BoxR2";
import {CircleR2} from "./CircleR2";
import {PointR2Interpolator} from "./PointR2Interpolator";
import {SegmentR2Interpolator} from "./SegmentR2Interpolator";
import {BoxR2Interpolator} from "./BoxR2Interpolator";
import {CircleR2Interpolator} from "./CircleR2Interpolator";

export abstract class ShapeR2Interpolator<S extends ShapeR2 & AS, AS = S> extends Interpolator<S, AS> {
  static between<S extends ShapeR2>(s0: S, s1: S): ShapeR2Interpolator<S>;
  static between(a: unknown, b: unknown): Interpolator<unknown>;
  static between(a: unknown, b: unknown): Interpolator<unknown> {
    if (a instanceof PointR2 && b instanceof PointR2) {
      return new ShapeR2Interpolator.Point(a, b);
    } else if (a instanceof SegmentR2 && b instanceof SegmentR2) {
      return new ShapeR2Interpolator.Segment(a, b);
    } else if (a instanceof BoxR2 && b instanceof BoxR2) {
      return new ShapeR2Interpolator.Box(a, b);
    } else if (a instanceof CircleR2 && b instanceof CircleR2) {
      return new ShapeR2Interpolator.Circle(a, b);
    } else if (a instanceof ShapeR2 && b instanceof ShapeR2) {
      return new ShapeR2Interpolator.Box(a.boundingBox(), b.boundingBox());
    } else if (PointR2.isAny(a) && PointR2.isAny(b)) {
      return new ShapeR2Interpolator.Point(PointR2.fromAny(a), PointR2.fromAny(b));
    } else if (SegmentR2.isAny(a) && SegmentR2.isAny(b)) {
      return new ShapeR2Interpolator.Segment(SegmentR2.fromAny(a), SegmentR2.fromAny(b));
    } else if (BoxR2.isAny(a) && BoxR2.isAny(b)) {
      return new ShapeR2Interpolator.Box(BoxR2.fromAny(a), BoxR2.fromAny(b));
    } else if (CircleR2.isAny(a) && CircleR2.isAny(b)) {
      return new ShapeR2Interpolator.Circle(CircleR2.fromAny(a), CircleR2.fromAny(b));
    } else if (ShapeR2.isAny(a) && ShapeR2.isAny(b)) {
      return new ShapeR2Interpolator.Box(ShapeR2.fromAny(a).boundingBox(), ShapeR2.fromAny(b).boundingBox());
    }
    return Interpolator.between(a, b);
  }

  static tryBetween(a: unknown, b: unknown): ShapeR2Interpolator<any> | null {
    if (a instanceof PointR2 && b instanceof PointR2) {
      return new ShapeR2Interpolator.Point(a, b);
    } else if (a instanceof SegmentR2 && b instanceof SegmentR2) {
      return new ShapeR2Interpolator.Segment(a, b);
    } else if (a instanceof BoxR2 && b instanceof BoxR2) {
      return new ShapeR2Interpolator.Box(a, b);
    } else if (a instanceof CircleR2 && b instanceof CircleR2) {
      return new ShapeR2Interpolator.Circle(a, b);
    }
    return null;
  }

  static tryBetweenAny(a: unknown, b: unknown): ShapeR2Interpolator<any> | null {
    if ((a instanceof PointR2 || PointR2.isInit(a)) && (b instanceof PointR2 || PointR2.isInit(b))) {
      return new ShapeR2Interpolator.Point(PointR2.fromAny(a), PointR2.fromAny(b));
    } else if (SegmentR2.isAny(a) && SegmentR2.isAny(b)) {
      return new ShapeR2Interpolator.Segment(SegmentR2.fromAny(a), SegmentR2.fromAny(b));
    } else if (BoxR2.isAny(a) && BoxR2.isAny(b)) {
      return new ShapeR2Interpolator.Box(BoxR2.fromAny(a), BoxR2.fromAny(b));
    } else if (CircleR2.isAny(a) && CircleR2.isAny(b)) {
      return new ShapeR2Interpolator.Circle(CircleR2.fromAny(a), CircleR2.fromAny(b));
    } else if (ShapeR2.isAny(a) && ShapeR2.isAny(b)) {
      return new ShapeR2Interpolator.Box(ShapeR2.fromAny(a).boundingBox(), ShapeR2.fromAny(b).boundingBox());
    }
    return null;
  }

  // Forward type declarations
  /** @hidden */
  static Point: typeof PointR2Interpolator; // defined by PointR2Interpolator
  /** @hidden */
  static Segment: typeof SegmentR2Interpolator; // defined by SegmentR2Interpolator
  /** @hidden */
  static Box: typeof BoxR2Interpolator; // defined by BoxR2Interpolator
  /** @hidden */
  static Circle: typeof CircleR2Interpolator; // defined by CircleR2Interpolator
}
Interpolator.registerFactory(ShapeR2Interpolator);
