import { InjectionToken, Signal } from '@angular/core';

/**
 * What a radio item needs from the group it sits in. The group provides it;
 * an item outside a group gets none and keeps its own `name`/`selected` inputs.
 * A token (not the group class) keeps the two components free of an import cycle.
 */
export interface RadioGroupHost {
  readonly groupName: string;
  /** The group's value, or null when the consumer wires `selected` on each item. */
  readonly value: Signal<string | null>;
  readonly disabled: Signal<boolean>;
  select(value: string): void;
}

export const RADIO_GROUP = new InjectionToken<RadioGroupHost>('RADIO_GROUP');
