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
import {GeoShape} from "./GeoShape";
import {GeoPoint} from "./GeoPoint";
import {GeoSegment} from "./GeoSegment";
import {GeoBox} from "./GeoBox";
import {GeoPointInterpolator} from "./GeoPointInterpolator";
import {GeoSegmentInterpolator} from "./GeoSegmentInterpolator";
import {GeoBoxInterpolator} from "./GeoBoxInterpolator";

export abstract class GeoShapeInterpolator<S extends GeoShape & AS, AS = S> extends Interpolator<S, AS> {
  static between<S extends GeoShape>(s0: S, s1: S): GeoShapeInterpolator<S>;
  static between(a: unknown, b: unknown): Interpolator<unknown>;
  static between(a: unknown, b: unknown): Interpolator<unknown> {
    if (a instanceof GeoPoint && b instanceof GeoPoint) {
      return new GeoShapeInterpolator.Point(a, b);
    } else if (a instanceof GeoSegment && b instanceof GeoSegment) {
      return new GeoShapeInterpolator.Segment(a, b);
    } else if (a instanceof GeoBox && b instanceof GeoBox) {
      return new GeoShapeInterpolator.Box(a, b);
    } else if (a instanceof GeoShape && b instanceof GeoShape) {
      return new GeoShapeInterpolator.Box(a.boundingBox(), b.boundingBox());
    } else if (GeoPoint.isAny(a) && GeoPoint.isAny(b)) {
      return new GeoShapeInterpolator.Point(GeoPoint.fromAny(a), GeoPoint.fromAny(b));
    } else if (GeoSegment.isAny(a) && GeoSegment.isAny(b)) {
      return new GeoShapeInterpolator.Segment(GeoSegment.fromAny(a), GeoSegment.fromAny(b));
    } else if (GeoBox.isAny(a) && GeoBox.isAny(b)) {
      return new GeoShapeInterpolator.Box(GeoBox.fromAny(a), GeoBox.fromAny(b));
    } else if (GeoShape.isAny(a) && GeoShape.isAny(b)) {
      return new GeoShapeInterpolator.Box(GeoShape.fromAny(a).boundingBox(), GeoShape.fromAny(b).boundingBox());
    }
    return Interpolator.between(a, b);
  }

  static tryBetween(a: unknown, b: unknown): GeoShapeInterpolator<any> | null {
    if (a instanceof GeoPoint && b instanceof GeoPoint) {
      return new GeoShapeInterpolator.Point(a, b);
    } else if (a instanceof GeoSegment && b instanceof GeoSegment) {
      return new GeoShapeInterpolator.Segment(a, b);
    } else if (a instanceof GeoBox && b instanceof GeoBox) {
      return new GeoShapeInterpolator.Box(a, b);
    }
    return null;
  }

  static tryBetweenAny(a: unknown, b: unknown): GeoShapeInterpolator<any> | null {
    if ((a instanceof GeoPoint || GeoPoint.isInit(a)) && (b instanceof GeoPoint || GeoPoint.isInit(b))) {
      return new GeoShapeInterpolator.Point(GeoPoint.fromAny(a), GeoPoint.fromAny(b));
    } else if (GeoSegment.isAny(a) && GeoSegment.isAny(b)) {
      return new GeoShapeInterpolator.Segment(GeoSegment.fromAny(a), GeoSegment.fromAny(b));
    } else if (GeoBox.isAny(a) && GeoBox.isAny(b)) {
      return new GeoShapeInterpolator.Box(GeoBox.fromAny(a), GeoBox.fromAny(b));
    } else if (GeoShape.isAny(a) && GeoShape.isAny(b)) {
      return new GeoShapeInterpolator.Box(GeoShape.fromAny(a).boundingBox(), GeoShape.fromAny(b).boundingBox());
    }
    return null;
  }

  // Forward type declarations
  /** @hidden */
  static Point: typeof GeoPointInterpolator; // defined by GeoPointInterpolator
  /** @hidden */
  static Segment: typeof GeoSegmentInterpolator; // defined by GeoSegmentInterpolator
  /** @hidden */
  static Box: typeof GeoBoxInterpolator; // defined by GeoBoxInterpolator
}
Interpolator.registerFactory(GeoShapeInterpolator);
