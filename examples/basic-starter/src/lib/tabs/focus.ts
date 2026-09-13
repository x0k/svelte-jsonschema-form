import type { FailureValidationResult } from "@sjsf/form";

import type { TabsContext } from "./context.svelte";

export function createFocusOnFirstErrorTab(ctx: TabsContext) {
  return <R>(focus: (result: FailureValidationResult) => R) =>
    (result: FailureValidationResult) => {
      const { errors } = result;
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
      return focus(result);
    };
}
