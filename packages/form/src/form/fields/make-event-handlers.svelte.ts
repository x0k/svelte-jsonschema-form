import type { FormContext } from "../context.js";
import {
  ON_SUBMITTED,
  ON_CHANGED,
  ON_TOUCHED,
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
} from "../validation.js";

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
      (m & ON_SUBMITTED && !ctx.isSubmitted) ||
      (m & ON_CHANGED && !changed) ||
      (m & ON_TOUCHED && !touched)
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
