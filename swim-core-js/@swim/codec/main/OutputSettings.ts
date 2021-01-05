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

import {Murmur3, HashCode, Booleans, Numbers, Strings, Constructors} from "@swim/util";
import {Output} from "./Output";
import {Format} from "./Format";
import {Debug} from "./Debug";

/**
 * Either an [[OutputSettings]] instance, or an [[OutputSettingsInit]] object
 * initializer.
 */
export type AnyOutputSettings = OutputSettings | OutputSettingsInit;

/**
 * [[OutputSettings]] object initializer.
 */
export interface OutputSettingsInit {
  lineSeparator?: string | null;
  isPretty?: boolean;
  isStyled?: boolean;
  precision?: number;
}

/**
 * [[Output]] production parameters.  `OutputSettings` provide contextual
 * configuration parameters to output producers, such as [[Writer Writers]].
 * Uses include enabling pretty printing and styling generated output.
 * Subclasses can provide additional parameters understood by specialized
 * output producers.
 */
export class OutputSettings implements Debug, HashCode {
  /** @hidden */
  readonly _lineSeparator: string;
  /** @hidden */
  readonly _isPretty: boolean;
  /** @hidden */
  readonly _isStyled: boolean;
  /** @hidden */
  readonly _precision: number;

  protected constructor(lineSeparator: string, isPretty: boolean,
                        isStyled: boolean, precision: number) {
    this._lineSeparator = lineSeparator;
    this._isPretty = isPretty;
    this._isStyled = isStyled;
    this._precision = precision;
  }

  /**
   * Returns the code point sequence used to separate lines of text.
   * Defaults to the operating system's line separator.
   */
  lineSeparator(): string;

  /**
   * Returns a copy of these settings with the given `lineSeparator`.
   */
  lineSeparator(lineSeparator: string | null): OutputSettings;

  lineSeparator(lineSeparator?: string | null): string | OutputSettings {
    if (lineSeparator === void 0) {
      return this._lineSeparator;
    } else {
      return this.copy(lineSeparator, this._isPretty, this._isStyled, this._precision);
    }
  }

  /**
   * Returns `true` if output producers should pretty print their output,
   * when possible.
   */
  isPretty(): boolean;

  /**
   * Returns a copy of these settings with the given `isPretty` flag.
   */
  isPretty(isPretty: boolean): OutputSettings;

  isPretty(isPretty?: boolean): boolean | OutputSettings {
    if (isPretty === void 0) {
      return this._isPretty;
    } else {
      return this.copy(this._lineSeparator, isPretty, this._isStyled, this._precision);
    }
  }

  /**
   * Returns `true` if output producers should style their output,
   * when possible.
   */
  isStyled(): boolean;

  /**
   * Returns a copy of these settings with the given `isStyled` flag.
   */
  isStyled(isStyled: boolean): OutputSettings;

  isStyled(isStyled?: boolean): boolean | OutputSettings {
    if (isStyled === void 0) {
      return this._isStyled;
    } else {
      return this.copy(this._lineSeparator, this._isPretty, isStyled, this._precision);
    }
  }

  /**
   * Returns the numeric precision output producers should use
   * when formatting numbers.
   */
  precision(): number;

  /**
   * Returns a copy of these settings with the given numeric `precision`.
   */
  precision(precision: number): OutputSettings;

  precision(precision?: number): number | OutputSettings {
    if (precision === void 0) {
      return this._precision;
    } else {
      return this.copy(this._lineSeparator, this._isPretty, this._isStyled, precision);
    }
  }

  protected copy(lineSeparator: string | null, isPretty: boolean,
                 isStyled: boolean, precision: number): OutputSettings {
    return OutputSettings.create(lineSeparator, isPretty, isStyled, precision);
  }

  protected canEqual(that: unknown): boolean {
    return that instanceof OutputSettings;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof OutputSettings) {
      return that.canEqual(this) && this._lineSeparator === that._lineSeparator
          && this._isPretty === that._isPretty && this._isStyled === that._isStyled
          && this._precision === that._precision;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(
        Constructors.hash(OutputSettings), Strings.hash(this._lineSeparator)),
        Booleans.hash(this._isPretty)), Booleans.hash(this._isStyled)),
        Numbers.hash(this._precision)));
  }

  debug(output: Output): void {
    output = output.write("OutputSettings").write(46/*'.'*/);
    if (!this._isPretty && !this._isStyled) {
      output = output.write("standard");
    } else if (this._isPretty && !this._isStyled) {
      output = output.write("pretty");
    } else if (!this._isPretty && this._isStyled) {
      output = output.write("styled");
    } else {
      output = output.write("prettyStyled");
    }
    output = output.write(40/*'('*/).write(41/*')'*/);
    if (this._lineSeparator !== Format.lineSeparator) {
      output = output.write(46/*'.'*/).write("lineSeparator").write(40/*'('*/)
          .display(this._lineSeparator).write(41/*')'*/);
    }
    if (this._precision !== -1) {
      output = output.write(46/*'.'*/).write("precision").write(40/*'('*/)
          .display(this._precision).write(41/*')'*/);
    }
  }

  toString(): string {
    return Format.debug(this);
  }

  private static _standard?: OutputSettings;
  private static _pretty?: OutputSettings;
  private static _styled?: OutputSettings;
  private static _prettyStyled?: OutputSettings;

  /**
   * Returns `OutputSettings` configured with the system line separator,
   * pretty printing disabled, and styling disabled.
   */
  static standard(): OutputSettings {
    if (OutputSettings._standard === void 0) {
      OutputSettings._standard = new OutputSettings(Format.lineSeparator, false, false, -1);
    }
    return OutputSettings._standard;
  }

  /**
   * Returns `OutputSettings` configured with the system line separator,
   * pretty printing enabled, and styling disabled.
   */
  static pretty(): OutputSettings {
    if (OutputSettings._pretty === void 0) {
      OutputSettings._pretty = new OutputSettings(Format.lineSeparator, true, false, -1);
    }
    return OutputSettings._pretty;
  }

  /**
   * Returns `OutputSettings` configured with the system line separator,
   * pretty printing disabled, and styling enabled.
   */
  static styled(): OutputSettings {
    if (OutputSettings._styled === void 0) {
      OutputSettings._styled = new OutputSettings(Format.lineSeparator, false, true, -1);
    }
    return OutputSettings._styled;
  }

  /**
   * Returns `OutputSettings` configured with the system line separator,
   * pretty printing enabled, and styling enabled.
   */
  static prettyStyled(): OutputSettings {
    if (OutputSettings._prettyStyled === void 0) {
      OutputSettings._prettyStyled = new OutputSettings(Format.lineSeparator, true, true, -1);
    }
    return OutputSettings._prettyStyled;
  }

  /**
   * Returns `OutputSettings` configured with the given `lineSeparator`, pretty
   * rinting enabled if `isPretty` is `true`, styling enabled if `isStyled` is
   * `true`, and with the given numeric `precision`.
   */
  static create(lineSeparator?: string | null, isPretty?: boolean,
                isStyled?: boolean, precision?: number): OutputSettings {
    if (typeof lineSeparator !== "string") {
      lineSeparator = Format.lineSeparator;
    }
    if (typeof isPretty !== "boolean") {
      isPretty = false;
    }
    if (typeof isStyled !== "boolean") {
      isStyled = false;
    }
    if (typeof precision !== "number") {
      precision = -1;
    }
    if (lineSeparator === Format.lineSeparator && precision === -1) {
      if (!isPretty && !isStyled) {
        return OutputSettings.standard();
      } else if (isPretty && !isStyled) {
        return OutputSettings.pretty();
      } else if (!isPretty && isStyled) {
        return OutputSettings.styled();
      } else {
        return OutputSettings.prettyStyled();
      }
    }
    return new OutputSettings(lineSeparator, isPretty, isStyled, precision);
  }

  /**
   * Converts the loosely typed `settings` to an instance of `OutputSettings`.
   */
  static fromAny(settings: AnyOutputSettings | undefined): OutputSettings {
    if (settings instanceof OutputSettings) {
      return settings;
    } else if (typeof settings === "object" && settings !== null) {
      return OutputSettings.create(settings.lineSeparator, settings.isPretty,
                                   settings.isStyled, settings.precision);
    }
    return OutputSettings.standard();
  }
}
