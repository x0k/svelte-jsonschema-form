import { tick } from "svelte";

import {
  type Id,
  type FormState,
  createIdByPath,
  encodePseudoElement,
  type FailureValidationResult,
} from "./form/index.js";

export interface GetFocusableElementOptions {
  /**
   * @default false
   */
  checkVisibility?: boolean;
}

export function getFocusableElement(
  form: HTMLElement,
  instanceId: Id,
  { checkVisibility = false }: GetFocusableElementOptions = {}
) {
  const item = form.querySelector(`[id="${instanceId}"]`);
  if (
    (item instanceof HTMLElement || item instanceof SVGElement) &&
    item.tabIndex >= 0 &&
    "disabled" in item &&
    item.disabled !== true &&
    (!checkVisibility || window.getComputedStyle(item).visibility !== "hidden")
  ) {
    return item;
  }
  return null;
}

export function getErrorsList(form: HTMLElement, pseudoId: Id) {
  return form.querySelector(`#${pseudoId}`);
}

export function getFocusAction(
  focusableElement: ReturnType<typeof getFocusableElement>,
  getErrorsList: () => Element | null
) {
  if (focusableElement !== null) {
    return () => focusableElement.focus();
  }
  const errorsList = getErrorsList();
  if (errorsList !== null) {
    return () =>
      errorsList.scrollIntoView({ behavior: "auto", block: "center" });
  }
  return null;
}

export function createFocusOnFirstError(
  options: GetFocusableElementOptions = {}
) {
  return (
    { errors }: FailureValidationResult,
    e: SubmitEvent,
    ctx: FormState<any, any>
  ) => {
    if (errors.length === 0) {
      return false;
    }
    const form = e.target;
    if (!(form instanceof HTMLElement)) {
      console.warn("Expected form to be an HTMLElement, got", form);
      return false;
    }
    const { path } = errors[0]!;
    const focusAction = getFocusAction(
      getFocusableElement(form, createIdByPath(ctx, path), options),
      () =>
        getErrorsList(
          form,
          createIdByPath(ctx, path.concat(encodePseudoElement("errors")))
        )
    );
    if (focusAction === null) {
      return false;
    }
    // NOTE: We use tick here because new errors may produce layout changes.
    return tick().then(focusAction);
  };
}
