import { createPage, addToDemoPage, type PathFactory } from "meta/codegen";

import type { Context } from "./model.js";

export function pageSvelte({
  sv,
  directory,
  language,
  isKit,
  options,
  form,
  file,
  lib,
}: Context) {
  if (!options.demo) {
    return;
  }

  if (isKit) {
    sv.file(
      `${directory.kitRoutes}/demo/+page.svelte`,
      addToDemoPage("sjsf", language)
    );
  }

  const filepath = `${directory.kitRoutes}/${isKit ? "demo/sjsf/+page.svelte" : "sjsf.svelte"}`;

  const pageLib: PathFactory = isKit
    ? lib
    : (path) =>
        file.getRelative({
          from: filepath,
          to: `${directory.lib}/${path}`,
        });

  sv.file(
    filepath,
    createPage({
      ...options,
      html5Validation: false,
      language,
      form,
      lib: pageLib,
    })
  );
}
