// Copyright 2015-2021 Swim.inc
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

/** @public */
export type FilterFieldsFunction<K, V> = (key: K, value: V) => boolean;

/** @public */
export type MapValueFunction<I, O> = (value: I) => O;

/** @public */
export type MapFieldValuesFunction<K, VI, VO> = (key: K, value: VI) => VO;

/** @public */
export type WatchValueFunction<I> = (value: I) => void;

/** @public */
export type WatchFieldsFunction<K, V> = (key: K, value: V) => void;