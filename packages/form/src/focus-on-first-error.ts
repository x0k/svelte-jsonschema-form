import { tick } from "svelte";

import { ERRORS_FOR_KEY, type FieldErrorsMap, type Id } from './form/main.js';

export function getFocusableElement(
  form: HTMLElement,
  instanceId: Id
) {
  const item = form.querySelector(`[id="${instanceId}"]`);
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
  instanceId: Id
) {
  return form.querySelector(`[${ERRORS_FOR_KEY}="${instanceId}"]`);
}

export function getFocusAction(
  form: HTMLElement,
  instanceId: Id
) {
  const focusableElement = getFocusableElement(form, instanceId);
  if (focusableElement !== null) {
    return () => focusableElement.focus();
  }
  const errorsList = getErrorsList(form, instanceId);
  if (errorsList !== null) {
    return () =>
      errorsList.scrollIntoView({ behavior: "auto", block: "center" });
  }
  return null;
}

export function focusOnFirstError<E>(
  errors: FieldErrorsMap<E>,
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
  const error = errors.entries().next().value;
  if (error === undefined || error[1].length === 0) {
    return false;
  }
  const focusAction = getFocusAction(form, error[0]);
  if (focusAction === null) {
    return false;
  }
  // NOTE: We use tick here because new errors may produce layout changes.
  return tick().then(focusAction);
}
