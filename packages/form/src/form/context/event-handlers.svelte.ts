import {
  AFTER_SUBMITTED,
  AFTER_CHANGED,
  AFTER_TOUCHED,
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
} from "../validation.js";
import type { FormValidator } from "../validator.js";

import type { FormContext } from "./context.js";

export function makeEventHandlers<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  validate: () => void
) {
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

  const makeHandler = (event: number) => {
    const m = ctx.fieldsValidationMode;
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
  const onInput = $derived(makeHandler(ON_INPUT));
  const onChange = $derived(makeHandler(ON_CHANGE));
  const onBlur = $derived(makeHandler(ON_BLUR));

  return {
    oninput() {
      onInput?.();
    },
    onchange() {
      changed = true;
      ctx.isChanged = true;
      onChange?.();
    },
    onblur() {
      touched = true;
      onBlur?.();
    },
  };
}
