// Copyright 2015-2022 Swim.inc
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

import {Mutable, Proto, AnyTiming, Timing, Easing, Interpolator} from "@swim/util";
import {Affinity} from "../fastener/Affinity";
import type {FastenerFlags, FastenerOwner} from "../fastener/Fastener";
import {PropertyRefinement, PropertyTemplate, PropertyClass, Property} from "../property/Property";

/** @internal */
export type MemberAnimatorInit<O, K extends keyof O> =
  O[K] extends Animator<any, infer T, infer U> ? T | U : never;

/** @internal */
export type MemberAnimatorInitMap<O> =
  {-readonly [K in keyof O as O[K] extends Property<any, any> ? K : never]?: MemberAnimatorInit<O, K>};

/** @public */
export interface AnimatorRefinement extends PropertyRefinement {
}

/** @public */
export type AnimatorValue<R extends AnimatorRefinement | Animator<any, any, any>, D = unknown> =
  R extends {value: infer T} ? T :
  R extends {extends: infer E} ? AnimatorValue<E, D> :
  R extends Animator<any, infer T, any> ? T :
  D;

/** @public */
export type AnimatorValueInit<R extends AnimatorRefinement | Animator<any, any, any>, D = AnimatorValue<R>> =
  R extends {valueInit: infer U} ? U :
  R extends {extends: infer E} ? AnimatorValueInit<E, D> :
  R extends Animator<any, any, infer U> ? U :
  D;

/** @public */
export interface AnimatorTemplate<T = unknown, U = T> extends PropertyTemplate<T, U> {
  extends?: Proto<Animator<any, any, any>> | string | boolean | null;
  transition?: Timing | null;
}

/** @public */
export interface AnimatorClass<A extends Animator<any, any> = Animator<any, any>> extends PropertyClass<A> {
  /** @override */
  specialize(className: string, template: AnimatorTemplate): AnimatorClass;

  /** @override */
  refine(animatorClass: AnimatorClass): void;

  /** @override */
  extend(className: string, template: AnimatorTemplate): AnimatorClass<A>;

  /** @override */
  specify<O, T = unknown, U = T>(className: string, template: ThisType<Animator<O, T, U>> & AnimatorTemplate<T, U> & Partial<Omit<Animator<O, T, U>, keyof AnimatorTemplate>>): AnimatorClass<A>;

  /** @override */
  <O, T = unknown, U = T>(template: ThisType<Animator<O, T, U>> & AnimatorTemplate<T, U> & Partial<Omit<Animator<O, T, U>, keyof AnimatorTemplate>>): PropertyDecorator;

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
export type AnimatorDef<O, R extends AnimatorRefinement> =
  Animator<O, AnimatorValue<R>, AnimatorValueInit<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function AnimatorDef<A extends Animator<any, any, any>>(
  template: A extends AnimatorDef<infer O, infer R>
          ? ThisType<AnimatorDef<O, R>>
          & AnimatorTemplate<AnimatorValue<R>, AnimatorValueInit<R>>
          & Partial<Omit<Animator<O, AnimatorValue<R>, AnimatorValueInit<R>>, keyof AnimatorTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof AnimatorTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return Animator(template);
}

/** @public */
export interface Animator<O = unknown, T = unknown, U = T> extends Property<O, T, U> {
  (): T;
  (newState: T | U, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): O;
  (newState: T | U, timing?: AnyTiming | boolean | null, affinity?: Affinity): O;

  /** @protected @override */
  onDerive(inlet: Property<unknown, T>): void;

  /** @override */
  setValue(newValue: T | U, affinity?: Affinity): void;

  get inletState(): T | undefined;

  getInletState(): NonNullable<T>;

  getInletStateOr<E>(elseState: E): NonNullable<T> | E;

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
  readonly transition: Timing | null; // prototype property

  readonly timing: Timing | null;

  readonly interpolator: Interpolator<T> | null;

  setInterpolatedValue(newValue: T, newState?: T): void;

  /** @internal @protected @override */
  decohereOutlet(outlet: Property<unknown, T>): void;

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
export const Animator = (function (_super: typeof Property) {
  const Animator = _super.extend("Animator", {}) as AnimatorClass;

  Animator.prototype.onDerive = function <T>(this: Animator<unknown, T>, inlet: Property<unknown, T>): void {
    let newValue: T;
    let newState: T;
    if (inlet instanceof Animator) {
      newValue = this.transformInletValue(inlet.value);
      newState = this.transformInletValue(inlet.state);
    } else {
      newValue = this.transformInletValue(inlet.value);
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
  };

  Animator.prototype.setValue = function <T, U>(this: Animator<unknown, T, U>, newValue: T | U, affinity?: Affinity): void {
    if (affinity === void 0) {
      affinity = Affinity.Extrinsic;
    }
    if (this.minAffinity(affinity)) {
      newValue = this.fromAny(newValue);
      newValue = this.transformValue(newValue);
      const oldValue = this.value;
      if (!this.equalValues(newValue, oldValue)) {
        this.willSetValue(newValue, oldValue!);
        (this as Mutable<typeof this>).value = newValue;
        this.onSetValue(newValue, oldValue!);
        this.didSetValue(newValue, oldValue!);
        this.decohereOutlets();
      }
    }
  };

  Object.defineProperty(Animator.prototype, "inletState", {
    get: function <T>(this: Animator<unknown, T>): T | undefined {
      const inlet = this.inlet;
      return inlet instanceof Animator ? inlet.state : void 0;
    },
    configurable: true,
  });

  Animator.prototype.getInletState = function <T>(this: Animator<unknown, T>): NonNullable<T> {
    const inletState = this.inletState;
    if (inletState === void 0 || inletState === null) {
      let message = inletState + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "inlet state";
      throw new TypeError(message);
    }
    return inletState as NonNullable<T>;
  };

  Animator.prototype.getInletStateOr = function <T, E>(this: Animator<unknown, T>, elseState: E): NonNullable<T> | E {
    let inletState: T | E | undefined = this.inletState;
    if (inletState === void 0 || inletState === null) {
      inletState = elseState;
    }
    return inletState as NonNullable<T> | E;
  };

  Animator.prototype.getState = function <T>(this: Animator<unknown, T>): NonNullable<T> {
    const state = this.state;
    if (state === void 0 || state === null) {
      let message = state + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "state";
      throw new TypeError(message);
    }
    return state as NonNullable<T>;
  };

  Animator.prototype.getStateOr = function <T, E>(this: Animator<unknown, T>, elseState: E): NonNullable<T> | E {
    let state: T | E = this.state;
    if (state === void 0 || state === null) {
      state = elseState;
    }
    return state as NonNullable<T> | E;
  };

  Animator.prototype.transformState = function <T>(this: Animator<unknown, T>, state: T): T {
    return state;
  };

  Animator.prototype.setState = function <T, U>(this: Animator<unknown, T, U>, newState: T | U, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    if (affinity === void 0) {
      affinity = Affinity.Extrinsic;
    }

    if (this.minAffinity(affinity)) {
      newState = this.fromAny(newState);
      newState = this.transformState(newState);
      const oldState = this.state;
      if (!this.equalValues(newState, oldState)) {
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
      }
    }
  };

  Animator.prototype.willSetState = function <T>(this: Animator<unknown, T>, newState: T, oldState: T): void {
    // hook
  };

  Animator.prototype.onSetState = function <T>(this: Animator<unknown, T>, newState: T, oldState: T): void {
    // hook
  };

  Animator.prototype.didSetState = function <T>(this: Animator<unknown, T>, newState: T, oldState: T): void {
    // hook
  };

  Object.defineProperty(Animator.prototype, "transition", {
    value: null,
    configurable: true,
  });

  Animator.prototype.setInterpolatedValue = function <T>(this: Animator<unknown, T>, newValue: T, newState?: T): void {
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
  };

  Animator.prototype.decohereOutlet = function (this: Animator, outlet: Property): void {
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
  };

  Animator.prototype.recohere = function <T>(this: Animator<unknown, T>, t: number): void {
    const flags = this.flags;
    if ((flags & Animator.DerivedFlag) !== 0) {
      this.tweenInherited(t);
    } else if ((flags & Animator.TweeningFlag) !== 0) {
      this.tween(t);
    }
  };

  Animator.prototype.tween = function <T>(this: Animator<unknown, T>, t: number): void {
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
  };

  Animator.prototype.tweenInherited = function <T>(this: Animator<unknown, T>, t: number): void {
    const inlet = this.inlet;
    if (inlet !== null) {
      let newValue: T;
      let newState: T;
      if (inlet instanceof Animator) {
        newValue = this.transformInletValue(inlet.value);
        newState = this.transformInletValue(inlet.state);
      } else {
        newValue = this.transformInletValue(inlet.value);
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
    } else {
      this.stopTweening();
    }
  };

  Object.defineProperty(Animator.prototype, "tweening", {
    get: function (this: Animator): boolean {
      return (this.flags & Animator.TweeningFlag) !== 0;
    },
    configurable: true,
  });

  Animator.prototype.startTweening = function (this: Animator): void {
    if ((this.flags & Animator.TweeningFlag) === 0) {
      this.willStartTweening();
      this.setFlags(this.flags | Animator.TweeningFlag);
      this.onStartTweening();
      this.didStartTweening();
    }
  };

  Animator.prototype.willStartTweening = function (this: Animator): void {
    // hook
  };

  Animator.prototype.onStartTweening = function (this: Animator): void {
    if ((this.flags & Animator.DecoherentFlag) === 0) {
      this.setCoherent(false);
      this.decohere();
    }
    this.decohereOutlets();
  };

  Animator.prototype.didStartTweening = function (this: Animator): void {
    // hook
  };

  Animator.prototype.stopTweening = function (this: Animator): void {
    if ((this.flags & Animator.TweeningFlag) !== 0) {
      this.willStopTweening();
      this.setFlags(this.flags & ~Animator.TweeningFlag);
      this.onStopTweening();
      this.didStopTweening();
    }
  };

  Animator.prototype.willStopTweening = function (this: Animator): void {
    // hook
  };

  Animator.prototype.onStopTweening = function (this: Animator): void {
    this.setCoherent(true);
  };

  Animator.prototype.didStopTweening = function (this: Animator): void {
    // hook
  };

  Animator.prototype.willTransition = function <T>(this: Animator<unknown, T>, oldValue: T): void {
    // hook
  };

  Animator.prototype.didTransition = function <T>(this: Animator<unknown, T>, newValue: T): void {
    // hook
  };

  Animator.prototype.didInterrupt = function <T>(this: Animator<unknown, T>, value: T): void {
    // hook
  };

  Animator.construct = function <A extends Animator<any, any>>(animator: A | null, owner: FastenerOwner<A>): A {
    if (animator === null) {
      animator = function (state?: AnimatorValueInit<A>, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): AnimatorValue<A> | FastenerOwner<A> {
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
      delete (animator as Partial<Mutable<A>>).name; // don't clobber prototype name
      Object.setPrototypeOf(animator, this.prototype);
    }
    animator = _super.construct.call(this, animator, owner) as A;
    (animator as Mutable<typeof animator>).state = animator.value;
    (animator as Mutable<typeof animator>).timing = null;
    (animator as Mutable<typeof animator>).interpolator = null;
    return animator;
  };

  (Animator as Mutable<typeof Animator>).TweeningFlag = 1 << (_super.FlagShift + 0);
  (Animator as Mutable<typeof Animator>).DivergedFlag = 1 << (_super.FlagShift + 1);
  (Animator as Mutable<typeof Animator>).InterruptFlag = 1 << (_super.FlagShift + 2);

  (Animator as Mutable<typeof Animator>).FlagShift = _super.FlagShift + 3;
  (Animator as Mutable<typeof Animator>).FlagMask = (1 << Animator.FlagShift) - 1;

  return Animator;
})(Property);
