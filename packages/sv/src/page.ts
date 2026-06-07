import { createPage, addToDemoPage } from "meta/codegen";

import type { Context } from "./model.js";

export function pageSvelte({
  sv,
  directory,
  language,
  isKit,
  lib,
  options,
  form,
}: Context) {
  if (!options.demo) {
    return;
  }

  if (isKit) {
    sv.file(
      `${directory.kitRoutes}/demo/+page.svelte`,
      addToDemoPage("sjsf", language),
    );
  }

  sv.file(
    `${directory.kitRoutes}/${isKit ? "demo/sjsf/+page.svelte" : "sjsf.svelte"}`,
    createPage({
      ...options,
      language,
      form,
      lib,
    }),
  );
}
