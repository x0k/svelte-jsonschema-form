import { onMount } from "svelte";

import type { Validator } from "@/core/index.js";

import {
  AFTER_SUBMITTED,
  AFTER_CHANGED,
  AFTER_TOUCHED,
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
} from "../validation.js";
import {
  FORM_FIELDS_STATE_MAP,
  FORM_FIELDS_VALIDATION_MODE,
} from "../internals.js";
import type { Id } from "../id.js";
import type { FormState } from "./state.js";
import type { Config } from "../config.js";
import {
  FIELD_BLURRED,
  FIELD_CHANGED,
  FIELD_FOCUSED,
  FIELD_INPUTTED,
  type FieldState,
} from "../field-state.js";

export function setFieldState<T, V extends Validator>(
  ctx: FormState<T, V>,
  id: Id,
  state: FieldState
) {
  const currentFlags = ctx[FORM_FIELDS_STATE_MAP].get(id) ?? 0;
  ctx[FORM_FIELDS_STATE_MAP].set(id, currentFlags | state);
}

export function hasFieldState<T, V extends Validator>(
  ctx: FormState<T, V>,
  id: Id,
  state: FieldState
) {
  return ((ctx[FORM_FIELDS_STATE_MAP].get(id) ?? 0) & state) > 0;
}

export function makeEventHandlers<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: () => Config,
  validate: () => void
) {
  const id = $derived(config().id);

  onMount(() => () => {
    ctx[FORM_FIELDS_STATE_MAP].delete(id);
  });

  const mode = $derived(ctx[FORM_FIELDS_VALIDATION_MODE]);
  const flag = $derived(ctx[FORM_FIELDS_STATE_MAP].get(id) ?? 0);

  const makeHandler = (event: number) => {
    if (
      !(mode & event) ||
      (mode & AFTER_SUBMITTED && !ctx.isSubmitted) ||
      (mode & AFTER_CHANGED && !(flag & FIELD_CHANGED)) ||
      (mode & AFTER_TOUCHED && !(flag & FIELD_BLURRED))
    ) {
      return;
    }
    return validate;
  };
  const onInput = $derived(makeHandler(ON_INPUT));
  const onChange = $derived(makeHandler(ON_CHANGE));
  const onBlur = $derived(makeHandler(ON_BLUR));

  return {
    onfocus() {
      setFieldState(ctx, id, FIELD_FOCUSED);
    },
    oninput() {
      setFieldState(ctx, id, FIELD_INPUTTED);
      onInput?.();
    },
    onchange() {
      setFieldState(ctx, id, FIELD_CHANGED);
      onChange?.();
    },
    onblur() {
      setFieldState(ctx, id, FIELD_BLURRED);
      onBlur?.();
    },
  };
}
