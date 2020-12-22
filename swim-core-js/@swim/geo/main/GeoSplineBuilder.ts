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

import {GeoCurve} from "./GeoCurve";
import {GeoSegment} from "./GeoSegment";
import {GeoSplineContext} from "./GeoSplineContext";
import {GeoSpline} from "./GeoSpline";

export class GeoSplineBuilder implements GeoSplineContext {
  /** @hidden */
  _curves: GeoCurve[];
  /** @hidden */
  _closed: boolean;
  /** @hidden */
  _aliased: boolean;
  /** @hidden */
  _lng0: number;
  /** @hidden */
  _lat0: number;
  /** @hidden */
  _lng: number;
  /** @hidden */
  _lat: number;

  constructor() {
    this._curves = [];
    this._closed = false;
    this._aliased = false;
    this._lng0 = 0;
    this._lat0 = 0;
    this._lng = 0;
    this._lat = 0;
  }

  private dealias(): void {
    if (this._aliased) {
      this._curves = this._curves.slice(0);
      this._aliased = false;
    }
  }

  moveTo(lng: number, lat: number): void {
    if (this._aliased) {
      this._curves = [];
      this._aliased = false;
    } else {
      this._curves.length = 0;
    }
    this._closed = false;
    this._lng0 = lng;
    this._lat0 = lat;
    this._lng = lng;
    this._lat = lat;
  }

  closePath(): void {
    this.dealias();
    this._curves.push(new GeoSegment(this._lng, this._lat, this._lng0, this._lat0));
    this._closed = true;
    this._lng = this._lng0;
    this._lat = this._lat0;
  }

  lineTo(lng: number, lat: number): void {
    this.dealias();
    this._curves.push(new GeoSegment(this._lng, this._lat, lng, lat));
    this._lng = lng;
    this._lat = lat;
  }

  bind(): GeoSpline {
    this._aliased = true;
    return new GeoSpline(this._curves, this._closed);
  }
}
GeoSpline.Builder = GeoSplineBuilder;
