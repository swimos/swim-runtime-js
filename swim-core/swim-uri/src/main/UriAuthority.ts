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

import type {Mutable} from "@swim/util";
import {Strings} from "@swim/util";
import type {HashCode} from "@swim/util";
import type {Compare} from "@swim/util";
import {Diagnostic} from "@swim/codec";
import type {Input} from "@swim/codec";
import type {Output} from "@swim/codec";
import {Parser} from "@swim/codec";
import type {Debug} from "@swim/codec";
import type {Display} from "@swim/codec";
import {Format} from "@swim/codec";
import {Unicode} from "@swim/codec";
import type {AnyUriUser} from "./UriUser";
import type {UriUserInit} from "./UriUser";
import {UriUser} from "./"; // forward import
import type {AnyUriHost} from "./UriHost";
import {UriHost} from "./"; // forward import
import type {AnyUriPort} from "./UriPort";
import {UriPort} from "./"; // forward import
import {UriUserParser} from "./"; // forward import
import {UriHostParser} from "./"; // forward import
import {UriPortParser} from "./"; // forward import

/** @public */
export type AnyUriAuthority = UriAuthority | UriAuthorityInit | string;

/** @public */
export interface UriAuthorityInit extends UriUserInit {
  /** @internal */
  hashValue?: never, // force type ambiguity between UriAuthorityInit and UriAuthority
  user?: AnyUriUser;
  host?: AnyUriHost;
  port?: AnyUriPort;
}

/** @public */
export class UriAuthority implements HashCode, Compare, Debug, Display {
  /** @internal */
  constructor(user: UriUser, host: UriHost, port: UriPort) {
    this.user = user;
    this.host = host;
    this.port = port;
    this.hashValue = void 0;
    this.stringValue = void 0;
  }

  isDefined(): boolean {
    return this.user.isDefined() || this.host.isDefined() || this.port.isDefined();
  }

  readonly user: UriUser;

  withUser(user: AnyUriUser): UriAuthority {
    user = UriUser.fromAny(user);
    if (user === this.user) {
      return this;
    }
    return this.copy(user as UriUser, this.host, this.port);
  }

  get userPart(): string {
    return this.user.toString();
  }

  withUserPart(userPart: string): UriAuthority {
    return this.withUser(UriUser.parse(userPart));
  }

  get username(): string | undefined {
    return this.user.username;
  }

  withUsername(username: string | undefined, password?: string): UriAuthority {
    if (arguments.length === 1) {
      return this.withUser(this.user.withUsername(username));
    } else if (arguments.length === 2) {
      return this.withUser(UriUser.create(username, password));
    }
    throw new Error(arguments.toString());
  }

  get password(): string | undefined {
    return this.user.password;
  }

  withPassword(password: string | undefined): UriAuthority {
    return this.withUser(this.user.withPassword(password));
  }

  readonly host: UriHost;

  withHost(host: AnyUriHost): UriAuthority {
    host = UriHost.fromAny(host);
    if (host === this.host) {
      return this;
    }
    return this.copy(this.user, host, this.port);
  }

  get hostPart(): string {
    return this.host.toString();
  }

  withHostPart(hostPart: string): UriAuthority {
    return this.withHost(UriHost.parse(hostPart));
  }

  get hostAddress(): string {
    return this.host.address;
  }

  get hostName(): string | undefined {
    return this.host.name;
  }

  withHostName(hostName: string): UriAuthority {
    return this.withHost(UriHost.hostname(hostName));
  }

  get hostIPv4(): string | undefined {
    return this.host.ipv4;
  }

  withHostIPv4(hostIPv4: string): UriAuthority {
    return this.withHost(UriHost.ipv4(hostIPv4));
  }

  get hostIPv6(): string | undefined {
    return this.host.ipv6;
  }

  withHostIPv6(hostIPv5: string): UriAuthority {
    return this.withHost(UriHost.ipv6(hostIPv5));
  }

  readonly port: UriPort;

  withPort(port: AnyUriPort): UriAuthority {
    port = UriPort.fromAny(port);
    if (port === this.port) {
      return this;
    }
    return this.copy(this.user, this.host, port);
  }

  get portPart(): string {
    return this.port.toString();
  }

  withPortPart(portPart: string): UriAuthority {
    return this.withPort(UriPort.parse(portPart));
  }

  get portNumber(): number {
    return this.port.number;
  }

  withPortNumber(portNumber: number): UriAuthority {
    return this.withPort(UriPort.create(portNumber));
  }

  protected copy(user: UriUser, host: UriHost, port: UriPort): UriAuthority {
    return UriAuthority.create(user, host, port);
  }

  toAny(authority?: {username?: string, password?: string, host?: string, port?: number}):
      {username?: string, password?: string, host?: string, port?: number} | undefined {
    if (this.isDefined()) {
      if (authority === void 0) {
        authority = {};
      }
      this.user.toAny(authority);
      if (this.host.isDefined()) {
        authority.host = this.host.toAny();
      }
      if (this.port.isDefined()) {
        authority.port = this.port.toAny();
      }
    }
    return authority;
  }

  compareTo(that: unknown): number {
    if (that instanceof UriAuthority) {
      return this.toString().localeCompare(that.toString());
    }
    return NaN;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof UriAuthority) {
      return this.toString() === that.toString();
    }
    return false;
  }

  /** @internal */
  readonly hashValue: number | undefined;

  hashCode(): number {
    let hashValue = this.hashValue;
    if (hashValue === void 0) {
      hashValue = Strings.hash(this.toString());
      (this as Mutable<this>).hashValue = hashValue;
    }
    return hashValue;
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("UriAuthority").write(46/*'.'*/);
    if (this.isDefined()) {
      output = output.write("parse").write(40/*'('*/).write(34/*'"'*/)
                     .display(this).write(34/*'"'*/).write(41/*')'*/);
    } else {
      output = output.write("undefined").write(40/*'('*/).write(41/*')'*/);
    }
    return output;
  }

  display<T>(output: Output<T>): Output<T> {
    const stringValue = this.stringValue;
    if (stringValue !== void 0) {
      output = output.write(stringValue);
    } else {
      const user = this.user;
      if (user.isDefined()) {
        output = output.display(user).write(64/*'@'*/);
      }
      output = output.display(this.host);
      const port = this.port;
      if (port.isDefined()) {
        output = output.write(58/*':'*/).display(port);
      }
    }
    return output;
  }

  /** @internal */
  readonly stringValue: string | undefined;

  toString(): string {
    let stringValue = this.stringValue;
    if (stringValue === void 0) {
      stringValue = Format.display(this);
      (this as Mutable<this>).stringValue = stringValue;
    }
    return stringValue;
  }

  /** @internal */
  static Undefined: UriAuthority | null = null;

  static undefined(): UriAuthority {
    if (this.Undefined === null) {
      this.Undefined = new UriAuthority(UriUser.undefined(), UriHost.undefined(), UriPort.undefined());
    }
    return this.Undefined;
  }

  static create(user: UriUser = UriUser.undefined(),
                host: UriHost = UriHost.undefined(),
                port: UriPort = UriPort.undefined()): UriAuthority {
    if (!user.isDefined() && !host.isDefined() && !port.isDefined()) {
      return UriAuthority.undefined();
    }
    return new UriAuthority(user, host, port);
  }

  static fromInit(init: UriAuthorityInit): UriAuthority {
    let user = UriUser.fromAny(init.user !== void 0 ? init.user : init);
    if (user === void 0 || user === null) {
      user = UriUser.undefined();
    }
    let host = UriHost.fromAny(init.host);
    if (host === void 0 || host === null) {
      host = UriHost.undefined();
    }
    let port = UriPort.fromAny(init.port);
    if (port === void 0 || port === null) {
      port = UriPort.undefined();
    }
    return UriAuthority.create(user, host, port);
  }

  static fromAny(value: AnyUriAuthority): UriAuthority;
  static fromAny(value: AnyUriAuthority | null | undefined): UriAuthority | null | undefined;
  static fromAny(value: AnyUriAuthority | null | undefined): UriAuthority | null | undefined {
    if (value === void 0 || value === null || value instanceof UriAuthority) {
      return value;
    } else if (typeof value === "object") {
      return UriAuthority.fromInit(value);
    } else if (typeof value === "string") {
      return UriAuthority.parse(value);
    }
    throw new TypeError("" + value);
  }

  static user(user: AnyUriUser): UriAuthority {
    user = UriUser.fromAny(user);
    return UriAuthority.create(user as UriUser, void 0, void 0);
  }

  static userPart(userPart: string): UriAuthority {
    const user = UriUser.parse(userPart);
    return UriAuthority.create(user, void 0, void 0);
  }

  static username(username: string, password?: string | undefined): UriAuthority {
    const user = UriUser.create(username, password);
    return UriAuthority.create(user, void 0, void 0);
  }

  static password(password: string): UriAuthority {
    const user = UriUser.create("", password);
    return UriAuthority.create(user, void 0, void 0);
  }

  static host(host: AnyUriHost): UriAuthority {
    host = UriHost.fromAny(host);
    return UriAuthority.create(void 0, host, void 0);
  }

  static hostPart(hostPart: string): UriAuthority {
    const host = UriHost.parse(hostPart);
    return UriAuthority.create(void 0, host, void 0);
  }

  static hostName(hostName: string): UriAuthority {
    const host = UriHost.hostname(hostName);
    return UriAuthority.create(void 0, host, void 0);
  }

  static hostIPv4(hostIPv4: string): UriAuthority {
    const host = UriHost.ipv4(hostIPv4);
    return UriAuthority.create(void 0, host, void 0);
  }

  static hostIPv6(hostIPv6: string): UriAuthority {
    const host = UriHost.ipv6(hostIPv6);
    return UriAuthority.create(void 0, host, void 0);
  }

  static port(port: AnyUriPort): UriAuthority {
    port = UriPort.fromAny(port);
    return UriAuthority.create(void 0, void 0, port);
  }

  static portPart(portPart: string): UriAuthority {
    const port = UriPort.parse(portPart);
    return UriAuthority.create(void 0, void 0, port);
  }

  static portNumber(portNumber: number): UriAuthority {
    const port = UriPort.create(portNumber);
    return UriAuthority.create(void 0, void 0, port);
  }

  static parse(input: Input): Parser<UriAuthority>;
  static parse(string: string): UriAuthority;
  static parse(string: Input | string): Parser<UriAuthority> | UriAuthority {
    const input = typeof string === "string" ? Unicode.stringInput(string) : string;
    let parser = UriAuthorityParser.parse(input);
    if (typeof string === "string" && input.isCont() && !parser.isError()) {
      parser = Parser.error(Diagnostic.unexpected(input));
    }
    return typeof string === "string" ? parser.bind() : parser;
  }
}

/** @internal */
export class UriAuthorityParser extends Parser<UriAuthority> {
  private readonly userParser: Parser<UriUser> | undefined;
  private readonly hostParser: Parser<UriHost> | undefined;
  private readonly portParser: Parser<UriPort> | undefined;
  private readonly step: number | undefined;

  constructor(userParser?: Parser<UriUser>, hostParser?: Parser<UriHost>,
              portParser?: Parser<UriPort>, step?: number) {
    super();
    this.userParser = userParser;
    this.hostParser = hostParser;
    this.portParser = portParser;
    this.step = step;
  }

  override feed(input: Input): Parser<UriAuthority> {
    return UriAuthorityParser.parse(input, this.userParser, this.hostParser,
                                    this.portParser, this.step);
  }

  static parse(input: Input, userParser?: Parser<UriUser>, hostParser?: Parser<UriHost>,
               portParser?: Parser<UriPort>, step: number = 1): Parser<UriAuthority> {
    let c = 0;
    if (step === 1) {
      if (input.isCont()) {
        const look = input.clone();
        while (look.isCont() && (c = look.head(), c !== 64/*'@'*/ && c !== 47/*'/'*/)) {
          look.step();
        }
        if (look.isCont() && c === 64/*'@'*/) {
          step = 2;
        } else {
          step = 3;
        }
      } else if (input.isDone()) {
        step = 3;
      }
    }
    if (step === 2) {
      if (userParser === void 0) {
        userParser = UriUserParser.parse(input);
      } else {
        userParser = userParser.feed(input);
      }
      if (userParser.isDone()) {
        if (input.isCont() && input.head() === 64/*'@'*/) {
          input = input.step();
          step = 3;
        } else if (!input.isEmpty()) {
          return Parser.error(Diagnostic.expected(64/*'@'*/, input));
        }
      } else if (userParser.isError()) {
        return userParser.asError();
      }
    }
    if (step === 3) {
      if (hostParser === void 0) {
        hostParser = UriHostParser.parse(input);
      } else {
        hostParser = hostParser.feed(input);
      }
      if (hostParser.isDone()) {
        if (input.isCont() && input.head() === 58/*':'*/) {
          input = input.step();
          step = 4;
        } else if (!input.isEmpty()) {
          return Parser.done(UriAuthority.create(userParser !== void 0 ? userParser.bind() : void 0,
                                                 hostParser.bind()));
        }
      } else if (hostParser.isError()) {
        return hostParser.asError();
      }
    }
    if (step === 4) {
      if (portParser === void 0) {
        portParser = UriPortParser.parse(input);
      } else {
        portParser = portParser.feed(input);
      }
      if (portParser.isDone()) {
        return Parser.done(UriAuthority.create(userParser !== void 0 ? userParser.bind() : void 0,
                                               hostParser!.bind(),
                                               portParser.bind()));
      } else if (portParser.isError()) {
        return portParser.asError();
      }
    }
    return new UriAuthorityParser(userParser, hostParser, portParser, step);
  }
}
