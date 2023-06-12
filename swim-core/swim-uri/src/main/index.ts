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

export {UriException} from "./UriException";

export type {AnyUri} from "./Uri";
export type {UriInit} from "./Uri";
export {Uri} from "./Uri";

export type {AnyUriScheme} from "./UriScheme";
export {UriScheme} from "./UriScheme";

export type {AnyUriAuthority} from "./UriAuthority";
export type {UriAuthorityInit} from "./UriAuthority";
export {UriAuthority} from "./UriAuthority";

export type {AnyUriUser} from "./UriUser";
export type {UriUserInit} from "./UriUser";
export {UriUser} from "./UriUser";

export type {AnyUriHost} from "./UriHost";
export {UriHost} from "./UriHost";
export {UriHostName} from "./UriHostName";
export {UriHostIPv4} from "./UriHostIPv4";
export {UriHostIPv6} from "./UriHostIPv6";
export {UriHostUndefined} from "./UriHostUndefined";

export type {AnyUriPort} from "./UriPort";
export {UriPort} from "./UriPort";

export type {AnyUriPath} from "./UriPath";
export {UriPath} from "./UriPath";
export {UriPathSegment} from "./UriPathSegment";
export {UriPathSlash} from "./UriPathSlash";
export {UriPathEmpty} from "./UriPathEmpty";
export {UriPathBuilder} from "./UriPathBuilder";
export {UriPathForm} from "./UriPathForm";

export type {AnyUriQuery} from "./UriQuery";
export {UriQuery} from "./UriQuery";
export {UriQueryParam} from "./UriQueryParam";
export {UriQueryUndefined} from "./UriQueryUndefined";
export {UriQueryBuilder} from "./UriQueryBuilder";

export type {AnyUriFragment} from "./UriFragment";
export {UriFragment} from "./UriFragment";

export {UriForm} from "./UriForm";

export {UriCache} from "./UriCache";

export * from "./parser";
