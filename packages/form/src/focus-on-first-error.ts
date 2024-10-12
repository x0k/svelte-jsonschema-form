import { tick } from "svelte";

import type { Errors, ValidationError } from './form/index.js';

export function getFocusableElement(
  form: HTMLElement,
  error: ValidationError<unknown>
) {
  const item = form.querySelector(`[id="${error.instanceId}"]`);
  if (
    !(
      (item instanceof HTMLInputElement && item.type !== "checkbox") ||
      item instanceof HTMLTextAreaElement ||
      item instanceof HTMLSelectElement ||
      item instanceof HTMLButtonElement
    )
  ) {
    return null;
  }
  return item;
}

export function getErrorsList(
  form: HTMLElement,
  error: ValidationError<unknown>
) {
  return form.querySelector(`[data-errors-for="${error.instanceId}"]`);
}

export function getFocusAction(
  form: HTMLElement,
  error: ValidationError<unknown>
) {
  const focusableElement = getFocusableElement(form, error);
  if (focusableElement !== null) {
    return () => focusableElement.focus();
  }
  const errorsList = getErrorsList(form, error);
  if (errorsList !== null) {
    return () =>
      errorsList.scrollIntoView({ behavior: "auto", block: "center" });
  }
  return null;
}

export function focusOnFirstError(
  errors: Errors,
  e: SubmitEvent
) {
  if (errors.size === 0) {
    return false;
  }
  const form = e.target;
  if (!(form instanceof HTMLElement)) {
    console.warn("Expected form to be an HTMLElement, got", form);
    return false;
  }
  const error = errors.values().next().value?.[0];
  if (error === undefined) {
    return false;
  }
  const focusAction = getFocusAction(form, error);
  if (focusAction === null) {
    return false;
  }
  // NOTE: We use tick here because new errors may produce layout changes.
  return tick().then(focusAction);
}
