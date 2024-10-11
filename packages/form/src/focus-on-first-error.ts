import { tick } from "svelte";

import {
  ValidatorErrorType,
  type ValidatorError,
  type ValidationError,
} from "@/core/validator.js";

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
  errors: ValidatorError<unknown>[],
  e: SubmitEvent
) {
  const form = e.target;
  if (!(form instanceof HTMLElement)) {
    console.warn("Expected form to be an HTMLFormElement, got", form);
    return false;
  }
  const error = errors.find(
    (err) => err.type === ValidatorErrorType.ValidationError
  );
  if (!error) {
    return false;
  }
  const focusAction = getFocusAction(form, error);
  if (focusAction === null) {
    return false;
  }
  // NOTE: We use tick here because new errors may produce layout changes.
  return tick().then(focusAction);
}
