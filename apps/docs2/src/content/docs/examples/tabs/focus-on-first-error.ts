import { SvelteMap } from "svelte/reactivity";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  type FieldErrorsMap,
} from "@sjsf/form";
import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

import type { TabsContext } from "./context.svelte";

interface Options {
  idPrefix?: string;
  idSeparator?: string;
}

export function makeTabbedFocusOnFirstError<E>(
  ctx: TabsContext,
  {
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
  }: Options = {}
) {
  const l = idPrefix.length + 1;
  return (errors: FieldErrorsMap<E>, e: SubmitEvent) => {
    // if (errors.size === 0) {
    //   return;
    // }
    // const selected = ctx.selectedTab;
    // let firstPage = -1;
    // for (const err of errors) {
    //   const key = err[0];
    //   const indexEnd = key.indexOf(idSeparator, l);
    //   const index = Number(key.substring(l, indexEnd));
    //   if (index === selected) {
    //     const errors = new SvelteMap([err]);
    //     return focusOnFirstError(errors, e);
    //   } else if (firstPage === -1) {
    //     firstPage = index;
    //   }
    // }
    // ctx.selectedTab = firstPage;
    return focusOnFirstError(errors, e);
  };
}
