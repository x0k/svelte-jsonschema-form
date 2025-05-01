import { tick } from "svelte";

import {
  createPseudoId,
  DEFAULT_ID_SEPARATOR,
  type FieldErrorsMap,
  type Id,
  type IdPseudoSeparatorOption,
} from "./form/main.js";

export function getFocusableElement(form: HTMLElement, instanceId: Id) {
  const item = form.querySelector(`#${instanceId}`);
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
  instanceId: Id,
  options: Required<IdPseudoSeparatorOption>
) {
  return form.querySelector(
    `#${createPseudoId(instanceId, "errors", options)}`
  );
}

export function getFocusAction(
  form: HTMLElement,
  instanceId: Id,
  options: Required<IdPseudoSeparatorOption>
) {
  const focusableElement = getFocusableElement(form, instanceId);
  if (focusableElement !== null) {
    return () => focusableElement.focus();
  }
  const errorsList = getErrorsList(form, instanceId, options);
  if (errorsList !== null) {
    return () =>
      errorsList.scrollIntoView({ behavior: "auto", block: "center" });
  }
  return null;
}

export function createFocusOnFirstError({
  idPseudoSeparator = DEFAULT_ID_SEPARATOR,
}: IdPseudoSeparatorOption = {}) {
  const options = { idPseudoSeparator };
  return <E>(errors: FieldErrorsMap<E>, e: SubmitEvent) => {
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
    const focusAction = getFocusAction(form, error[0], options);
    if (focusAction === null) {
      return false;
    }
    // NOTE: We use tick here because new errors may produce layout changes.
    return tick().then(focusAction);
  };
}
