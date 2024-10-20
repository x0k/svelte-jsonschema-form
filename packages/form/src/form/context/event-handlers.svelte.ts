import {
  AFTER_SUBMITTED,
  AFTER_CHANGED,
  AFTER_TOUCHED,
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
} from "../validation.js";

import type { FormContext } from './context.js';

export function makeEventHandlers(ctx: FormContext, validate: () => void) {
  let changed = $state(false);
  let touched = $state(false);

  // Clear on reset
  $effect(() => {
    if (ctx.isSubmitted) {
      return;
    }
    changed = false;
    touched = false;
  });

  const makeHandler = (event: number, validate: () => void) => {
    const m = ctx.inputsValidationMode;
    if (
      !(m & event) ||
      (m & AFTER_SUBMITTED && !ctx.isSubmitted) ||
      (m & AFTER_CHANGED && !changed) ||
      (m & AFTER_TOUCHED && !touched)
    ) {
      return;
    }
    return validate;
  };
  const onInput = $derived(makeHandler(ON_INPUT, validate));
  const onChange = $derived(makeHandler(ON_CHANGE, validate));
  const onBlur = $derived(makeHandler(ON_BLUR, validate));

  return {
    oninput() {
      onInput?.();
    },
    onchange() {
      changed = true;
      onChange?.();
    },
    onblur() {
      touched = true;
      onBlur?.();
    },
  };
}
