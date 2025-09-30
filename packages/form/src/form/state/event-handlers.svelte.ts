import { onMount } from "svelte";

import type { RPath } from "@/core/index.js";

import {
  AFTER_SUBMITTED,
  AFTER_CHANGED,
  AFTER_TOUCHED,
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
} from "../validation.js";
import {
  FORM_ERRORS,
  FORM_FIELDS_STATE_MAP,
  FORM_FIELDS_VALIDATION_MODE,
  FORM_PATHS_TRIE_REF,
  internalHasFieldState,
  internalRegisterFieldPath,
} from "../internals.js";
import type { FieldPath } from "../id.js";
import type { Config } from "../config.js";
import {
  FIELD_BLURRED,
  FIELD_CHANGED,
  FIELD_FOCUSED,
  FIELD_INPUTTED,
  type FieldState,
} from "../field-state.js";
import type { FormState } from "./state.js";

export function setFieldState<T>(
  ctx: FormState<T>,
  path: FieldPath,
  state: FieldState
) {
  const currentFlags = ctx[FORM_FIELDS_STATE_MAP].get(path) ?? 0;
  ctx[FORM_FIELDS_STATE_MAP].set(path, currentFlags | state);
}

export function setFieldStateByPath<T>(
  ctx: FormState<T>,
  path: RPath,
  state: FieldState
) {
  setFieldState(
    ctx,
    internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path),
    state
  );
}

export function hasFieldState<T>(
  ctx: FormState<T>,
  path: FieldPath,
  state: FieldState
) {
  return internalHasFieldState(ctx[FORM_FIELDS_STATE_MAP], path, state);
}

export function hasFieldStateByPath<T>(
  ctx: FormState<T>,
  path: RPath,
  state: FieldState
) {
  return hasFieldState(
    ctx,
    internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path),
    state
  );
}

export function makeEventHandlers<T>(
  ctx: FormState<T>,
  config: () => Config,
  validate: () => void
) {
  const path = $derived(config().path);

  onMount(() => {
    // WARN: Read of derived during teardown will lead to
    // re-evaluation of all form state.
    // Let's assume that field cannot change own id
    // without unmount.
    // https://github.com/sveltejs/svelte/pull/16278
    const initialPath = path;
    return () => {
      ctx[FORM_FIELDS_STATE_MAP].delete(initialPath);
      ctx[FORM_ERRORS].delete(initialPath);
    };
  });

  const mode = $derived(ctx[FORM_FIELDS_VALIDATION_MODE]);
  const flag = $derived(ctx[FORM_FIELDS_STATE_MAP].get(path) ?? 0);

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
      setFieldState(ctx, path, FIELD_FOCUSED);
    },
    oninput() {
      setFieldState(ctx, path, FIELD_INPUTTED);
      onInput?.();
    },
    onchange() {
      setFieldState(ctx, path, FIELD_CHANGED);
      onChange?.();
    },
    onblur() {
      setFieldState(ctx, path, FIELD_BLURRED);
      onBlur?.();
    },
  };
}
