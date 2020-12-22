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

import {ShapeR2} from "@swim/math";
import {GeoPoint, GeoPointInit, GeoPointTuple} from "./GeoPoint";
import {GeoProjection} from "./GeoProjection";
import {GeoSegmentInit, GeoSegment} from "./GeoSegment";
import {GeoBoxInit, GeoBox} from "./GeoBox";

export type AnyGeoShape = GeoShape | GeoPointInit | GeoPointTuple | GeoSegmentInit | GeoBoxInit;

export abstract class GeoShape {
  abstract get lngMin(): number;

  abstract get latMin(): number;

  abstract get lngMax(): number;

  abstract get latMax(): number;

  abstract contains(that: AnyGeoShape): boolean;

  abstract contains(lng: number, lat: number): boolean;

  abstract intersects(that: AnyGeoShape): boolean;

  union(that: AnyGeoShape): GeoShape {
    that = GeoShape.fromAny(that);
    return new GeoShape.Box(Math.min(this.lngMin, that.lngMin),
                            Math.min(this.latMin, that.latMin),
                            Math.max(this.lngMax, that.lngMax),
                            Math.max(this.latMax, that.latMax));
  }

  abstract project(f: GeoProjection): ShapeR2;

  boundingBox(): GeoBox {
    return new GeoShape.Box(this.lngMin, this.latMin, this.lngMax, this.latMax);
  }

  static fromAny(value: AnyGeoShape): GeoShape {
    if (value instanceof GeoShape) {
      return value;
    } else if (GeoShape.Point.isInit(value)) {
      return GeoShape.Point.fromInit(value);
    } else if (GeoShape.Point.isTuple(value)) {
      return GeoShape.Point.fromTuple(value);
    } else if (GeoShape.Segment.isInit(value)) {
      return GeoShape.Segment.fromInit(value);
    } else if (GeoShape.Box.isInit(value)) {
      return GeoShape.Box.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyGeoShape {
    return value instanceof GeoShape
        || GeoShape.Point.isInit(value)
        || GeoShape.Point.isTuple(value)
        || GeoShape.Segment.isInit(value)
        || GeoShape.Box.isInit(value);
  }

  // Forward type declarations
  /** @hidden */
  static Point: typeof GeoPoint; // defined by GeoPoint
  /** @hidden */
  static Segment: typeof GeoSegment; // defined by GeoSegment
  /** @hidden */
  static Box: typeof GeoBox; // defined by GeoBox
}
