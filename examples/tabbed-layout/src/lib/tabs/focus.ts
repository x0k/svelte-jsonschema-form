import {
  createIdByPath,
  type FormState,
  type FormValue,
  type ValidationError,
} from "@sjsf/form";
import {
  createFocusOnFirstError,
  type GetFocusableElementOptions,
} from "@sjsf/form/focus-on-first-error";

import type { TabsContext } from "./context.svelte";

export function createTabbedFocusOnFirstError<E>(
  ctx: TabsContext,
  options: GetFocusableElementOptions = {}
) {
  const focus = createFocusOnFirstError(options);
  return (
    errors: ValidationError[],
    e: SubmitEvent,
    snap: FormValue,
    form: FormState<any>
  ) => {
    if (errors.length === 0) {
      return;
    }
    // NOTE: For simplicity, we will switch to the tab with the first error,
    // although it would be nice to take into account the current tab selection
    const { path } = errors[0];
    let children = ctx.current;
    for (let i = 0; i < path.length && children; i++) {
      const node = children.value;
      if (node !== undefined) {
        node.selectedTab = Number(path[i]);
      }
      children = children.values.get(path[i]);
    }
    return focus(errors, e, snap, form);
  };
}
