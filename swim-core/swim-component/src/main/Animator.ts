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
import type {Proto} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import {Easing} from "@swim/util";
import {Interpolator} from "@swim/util";
import {Affinity} from "./Affinity";
import type {FastenerFlags} from "./Fastener";
import type {Fastener} from "./Fastener";
import type {PropertyDescriptor} from "./Property";
import type {PropertyClass} from "./Property";
import {Property} from "./Property";

/** @public */
export interface AnimatorDescriptor<T, U> extends PropertyDescriptor<T, U> {
  extends?: Proto<Animator> | boolean | null;
  transition?: Timing | null;
}

/** @public */
export interface AnimatorClass<A extends Animator = Animator> extends PropertyClass<A> {
  /** @internal */
  readonly TweeningFlag: FastenerFlags;
  /** @internal */
  readonly DivergedFlag: FastenerFlags;
  /** @internal */
  readonly InterruptFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface Animator<O = any, T = any, U = T, I = T> extends Property<O, T, U, I> {
  (): T;
  (newState: T | U, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): O;
  (newState: T | U, timing?: AnyTiming | boolean | null, affinity?: Affinity): O;

  /** @override */
  get descriptorType(): Proto<AnimatorDescriptor<T, U>>;

  /** @protected @override */
  onDerive(inlet: Property<any, I, any, any>): void;

  get inletState(): T | undefined;

  getInletState(): NonNullable<T>;

  getInletStateOr<E>(elseState: E): NonNullable<T> | E;

  getOutletState(outlet: Animator<any, any, any, T>): T;

  /** @override */
  setValue(newValue: T | U, affinity?: Affinity): void;

  readonly state: T;

  getState(): NonNullable<T>;

  getStateOr<E>(elseState: E): NonNullable<T> | E;

  transformState(state: T): T;

  setState(newState: T | U, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setState(newState: T | U, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  /** @protected */
  willSetState(newstate: T, oldState: T): void;

  /** @protected */
  onSetState(newstate: T, oldState: T): void;

  /** @protected */
  didSetState(newstate: T, oldState: T): void;

  /** @internal */
  get transition(): Timing | null;

  readonly timing: Timing | null;

  readonly interpolator: Interpolator<T> | null;

  setInterpolatedValue(newValue: T, newState?: T): void;

  /** @internal @protected @override */
  decohereOutlet(outlet: Property<any, T, any, any>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  tween(t: number): void;

  /** @internal @protected */
  tweenInherited(t: number): void;

  /**
   * Returns `true` if this animator is actively transitioning to a new `state`.
   */
  get tweening(): boolean;

  /** @internal */
  startTweening(): void;

  /** @protected */
  willStartTweening(): void;

  /** @protected */
  onStartTweening(): void;

  /** @protected */
  didStartTweening(): void;

  /** @internal */
  stopTweening(): void;

  /** @protected */
  willStopTweening(): void;

  /** @protected */
  onStopTweening(): void;

  /** @protected */
  didStopTweening(): void;

  /** @internal @protected */
  willTransition(oldValue: T): void;

  /** @internal @protected */
  didTransition(newValue: T): void;

  /** @internal @protected */
  didInterrupt(value: T): void;
}

/** @public */
export const Animator = (<O, T, U, I, A extends Animator>() => Property.extend<Animator<O, T, U, I>, AnimatorClass<A>>("Animator", {
  onDerive(inlet: Property<any, I, any, any>): void {
    let newValue: T;
    let newState: T;
    if (inlet instanceof Animator) {
      newValue = this.transformInletValue(inlet.getOutletValue(this));
      newState = this.transformInletValue(inlet.getOutletState(this));
    } else {
      newValue = this.transformInletValue(inlet.getOutletValue(this));
      newState = newValue;
    }
    const oldState = this.state;
    const stateChanged = !this.equalValues(newState, oldState);
    if (stateChanged) {
      this.willSetState(newState, oldState);
      (this as Mutable<typeof this>).state = newState;
      (this as Mutable<typeof this>).timing = null;
      (this as Mutable<typeof this>).interpolator = null;
      this.onSetState(newState, oldState);
    }

    this.setValue(newValue, Affinity.Reflexive);

    if (stateChanged) {
      this.didSetState(newState, oldState);
      if ((this.flags & Animator.TweeningFlag) !== 0) {
        this.didInterrupt(this.value);
      }
    }

    if (inlet instanceof Animator && (inlet.flags & Animator.TweeningFlag) !== 0) {
      this.startTweening();
    } else {
      this.stopTweening();
    }
  },

  get inletState(): T | undefined {
    const inlet = this.inlet;
    return inlet instanceof Animator ? inlet.getOutletState(this) : void 0;
  },

  getInletState(): NonNullable<T> {
    const inletState = this.inletState;
    if (inletState === void 0 || inletState === null) {
      let message = inletState + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "inlet state";
      throw new TypeError(message);
    }
    return inletState;
  },

  getInletStateOr<E>(elseState: E): NonNullable<T> | E {
    let inletState: T | E | undefined = this.inletState;
    if (inletState === void 0 || inletState === null) {
      inletState = elseState;
    }
    return inletState as NonNullable<T> | E;
  },

  getOutletState(outlet: Animator<unknown, T>): T {
    return this.state;
  },

  setValue(newValue: T | U, affinity?: Affinity): void {
    if (affinity === void 0) {
      affinity = Affinity.Extrinsic;
    }
    if (!this.minAffinity(affinity)) {
      return;
    }
    newValue = this.fromAny(newValue);
    newValue = this.transformValue(newValue);
    const oldValue = this.value;
    if (this.equalValues(newValue, oldValue)) {
      return;
    }
    this.willSetValue(newValue, oldValue!);
    (this as Mutable<typeof this>).value = newValue;
    this.onSetValue(newValue, oldValue!);
    this.didSetValue(newValue, oldValue!);
    this.decohereOutlets();
  },

  getState(): NonNullable<T> {
    const state = this.state;
    if (state === void 0 || state === null) {
      let message = state + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "state";
      throw new TypeError(message);
    }
    return state;
  },

  getStateOr<E>(elseState: E): NonNullable<T> | E {
    let state: T | E = this.state;
    if (state === void 0 || state === null) {
      state = elseState;
    }
    return state as NonNullable<T> | E;
  },

  transformState(state: T): T {
    return state;
  },

  setState(newState: T | U, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    if (affinity === void 0) {
      affinity = Affinity.Extrinsic;
    }
    if (!this.minAffinity(affinity)) {
      return;
    }

    newState = this.fromAny(newState);
    newState = this.transformState(newState);
    const oldState = this.state;
    if (this.equalValues(newState, oldState) && timing === void 0) {
      return;
    }

    if (timing === void 0 || timing === null || timing === false) {
      timing = false;
    } else if (timing === true) {
      timing = this.timing !== null ? this.timing : false;
    } else {
      timing = Timing.fromAny(timing);
    }

    const animated = timing !== false && this.definedValue(oldState);

    this.willSetState(newState, oldState);

    (this as Mutable<typeof this>).state = newState;

    if (animated) {
      (this as Mutable<typeof this>).timing = timing as Timing;
      (this as Mutable<typeof this>).interpolator = Interpolator(this.value, newState);
      if ((this.flags & Animator.TweeningFlag) !== 0) {
        this.setFlags(this.flags | (Animator.DivergedFlag | Animator.InterruptFlag));
      } else {
        this.setFlags(this.flags | Animator.DivergedFlag);
      }
    } else {
      (this as Mutable<typeof this>).timing = null;
      (this as Mutable<typeof this>).interpolator = null;
    }

    this.onSetState(newState, oldState);

    if (!animated) {
      this.setValue(newState, Affinity.Reflexive);
    }

    this.didSetState(newState, oldState);

    if (animated) {
      this.startTweening();
    } else if ((this.flags & Animator.TweeningFlag) !== 0) {
      this.didInterrupt(this.value);
      this.stopTweening();
    }
  },

  willSetState(newState: T, oldState: T): void {
    // hook
  },

  onSetState(newState: T, oldState: T): void {
    // hook
  },

  didSetState(newState: T, oldState: T): void {
    // hook
  },

  get transition(): Timing | null {
    return null;
  },

  setInterpolatedValue(this: Animator<unknown, T>, newValue: T, newState?: T): void {
    const oldState = arguments.length > 1 ? this.state : void 0;
    const stateChanged = arguments.length > 1 && !this.equalValues(newState!, oldState);
    if (stateChanged) {
      this.willSetState(newState!, oldState!);
      (this as Mutable<typeof this>).state = newState!;
      (this as Mutable<typeof this>).timing = null;
      (this as Mutable<typeof this>).interpolator = null;
      this.onSetState(newState!, oldState!);
    }

    this.setValue(newValue, Affinity.Reflexive);

    if (stateChanged) {
      this.didSetState(newState!, oldState!);
      if ((this.flags & Animator.TweeningFlag) !== 0) {
        this.didInterrupt(this.value);
        this.stopTweening();
      }
    }
  },

  decohereOutlet(outlet: Property<any, T, any, any>): void {
    if ((outlet.flags & Animator.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Animator.DerivedFlag) !== 0) {
      if ((this.flags & Animator.TweeningFlag) !== 0 && outlet instanceof Animator) {
        outlet.startTweening();
      }
      if ((outlet.flags & Animator.DecoherentFlag) === 0) {
        outlet.setCoherent(false);
        outlet.decohere();
      }
    }
  },

  recohere(t: number): void {
    const flags = this.flags;
    if ((flags & Animator.DerivedFlag) !== 0) {
      this.tweenInherited(t);
    } else if ((flags & Animator.TweeningFlag) !== 0) {
      this.tween(t);
    }
  },

  tween(t: number): void {
    const oldValue = this.value;

    let timing = this.timing;
    if (timing === null) {
      timing = Easing.linear.withDomain(t, t);
      (this as Mutable<typeof this>).timing = timing;
    }

    let interpolator = this.interpolator;
    if (interpolator === null) {
      interpolator = Interpolator(oldValue, this.state);
      (this as Mutable<typeof this>).interpolator = interpolator;
    }

    if ((this.flags & Animator.InterruptFlag) !== 0) {
      this.setFlags(this.flags & ~Animator.InterruptFlag);
      this.didInterrupt(oldValue);
    }

    if ((this.flags & Animator.DivergedFlag) !== 0) {
      this.setFlags(this.flags & ~Animator.DivergedFlag);
      if (!this.equalValues(this.state, oldValue)) {
        timing = timing.withDomain(t, t + timing.duration);
      } else {
        timing = timing.withDomain(t - timing.duration, t);
      }
      (this as Mutable<typeof this>).timing = timing;
      this.willTransition(oldValue);
    }

    const u = timing(t);
    const newValue = interpolator(u);
    this.setValue(newValue, Affinity.Reflexive);

    if (u < 1) {
      this.decohere();
    } else if ((this.flags & Animator.TweeningFlag) !== 0) {
      this.stopTweening();
      (this as Mutable<typeof this>).interpolator = null;
      this.didTransition(this.value);
    } else {
      this.setCoherent(true);
    }
  },

  tweenInherited(t: number): void {
    const inlet = this.inlet;
    if (inlet === null) {
      this.stopTweening();
      return;
    }
    let newValue: T;
    let newState: T;
    if (inlet instanceof Animator) {
      newValue = this.transformInletValue(inlet.getOutletValue(this));
      newState = this.transformInletValue(inlet.getOutletState(this));
    } else {
      newValue = this.transformInletValue(inlet.getOutletValue(this));
      newState = newValue;
    }
    const oldState = this.state;
    const stateChanged = !this.equalValues(newState, oldState);
    if (stateChanged) {
      this.willSetState(newState, oldState);
      (this as Mutable<typeof this>).state = newState!;
      (this as Mutable<typeof this>).timing = null;
      (this as Mutable<typeof this>).interpolator = null;
      this.onSetState(newState, oldState);
    }

    this.setValue(newValue, Affinity.Reflexive);

    if (stateChanged) {
      this.didSetState(newState, oldState!);
      if ((this.flags & Animator.TweeningFlag) !== 0) {
        this.didInterrupt(this.value);
      }
    }

    if (inlet instanceof Animator && (inlet.flags & Animator.TweeningFlag) !== 0) {
      this.decohere();
    } else if ((this.flags & Animator.TweeningFlag) !== 0) {
      this.stopTweening();
    } else {
      this.setCoherent(true);
    }
  },

  get tweening(): boolean {
    return (this.flags & Animator.TweeningFlag) !== 0;
  },

  startTweening(): void {
    if ((this.flags & Animator.TweeningFlag) !== 0) {
      return;
    }
    this.willStartTweening();
    this.setFlags(this.flags | Animator.TweeningFlag);
    this.onStartTweening();
    this.didStartTweening();
  },

  willStartTweening(): void {
    // hook
  },

  onStartTweening(): void {
    if ((this.flags & Animator.DecoherentFlag) === 0) {
      this.setCoherent(false);
      this.decohere();
    }
    this.decohereOutlets();
  },

  didStartTweening(): void {
    // hook
  },

  stopTweening(): void {
    if ((this.flags & Animator.TweeningFlag) === 0) {
      return;
    }
    this.willStopTweening();
    this.setFlags(this.flags & ~Animator.TweeningFlag);
    this.onStopTweening();
    this.didStopTweening();
  },

  willStopTweening(): void {
    // hook
  },

  onStopTweening(): void {
    this.setCoherent(true);
  },

  didStopTweening(): void {
    // hook
  },

  willTransition(oldValue: T): void {
    // hook
  },

  didTransition(newValue: T): void {
    // hook
  },

  didInterrupt(value: T): void {
    // hook
  },
},
{
  construct(animator: A | null, owner: A extends Fastener<infer O> ? O : never): A {
    if (animator === null) {
      animator = function (state?: A extends Animator<any, infer T, infer U> ? T | U : never, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): A extends Animator<infer O, infer T, any> ? T | O : never {
        if (arguments.length === 0) {
          return animator!.value;
        } else {
          if (arguments.length === 2) {
            animator!.setState(state!, timing);
          } else {
            animator!.setState(state!, timing as AnyTiming | boolean | null | undefined, affinity);
          }
          return animator!.owner;
        }
      } as A;
      Object.defineProperty(animator, "name", {
        value: this.prototype.name,
        enumerable: true,
        configurable: true,
      });
      Object.setPrototypeOf(animator, this.prototype);
    }
    animator = super.construct(animator, owner) as A;
    (animator as Mutable<typeof animator>).state = animator.value;
    (animator as Mutable<typeof animator>).timing = null;
    (animator as Mutable<typeof animator>).interpolator = null;
    return animator;
  },

  TweeningFlag: 1 << (Property.FlagShift + 0),
  DivergedFlag: 1 << (Property.FlagShift + 1),
  InterruptFlag: 1 << (Property.FlagShift + 2),

  FlagShift: Property.FlagShift + 3,
  FlagMask: (1 << (Property.FlagShift + 3)) - 1,
}))();
