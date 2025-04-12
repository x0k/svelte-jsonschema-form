import {
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type FieldErrorsMap,
  type PathToIdOptions,
} from "@sjsf/form";
import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

import type { TabsContext } from "./context.svelte";

export function makeTabbedFocusOnFirstError<E>(
  ctx: TabsContext,
  options: PathToIdOptions = {}
) {
  return (errors: FieldErrorsMap<E>, e: SubmitEvent) => {
    if (errors.size === 0) {
      return;
    }
    // NOTE: For simplicity, we will switch to the tab with the first error,
    // although it would be nice to take into account the current tab selection
    const [key] = errors.entries().next().value!;
    const path = key
      .split(options.idSeparator ?? DEFAULT_ID_SEPARATOR)
      .slice(1);
    let children = ctx;
    for (let i = 0; i < path.length && children.size; i++) {
      const id = pathToId(path.slice(0, i), options);
      const node = children.get(id);
      if (node === undefined) {
        continue;
      }
      node.selectedTab = Number(path[i]);
      children = node.children;
    }
    return focusOnFirstError(errors, e);
  };
}
