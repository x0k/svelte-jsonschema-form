import {
  createPage,
  addToDemoPage,
  type PathFactory,
  KIT_PATH_FACTORY,
} from "meta/codegen";

import type { Context } from "./model.js";

export function pageSvelte({
  sv,
  directory,
  language,
  isKit,
  options,
  form,
  file,
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

  const lib: PathFactory = isKit
    ? KIT_PATH_FACTORY
    : (path) =>
        file.getRelative({
          from: `${directory.kitRoutes}/sjsf.svelte`,
          to: `${directory.lib}/${path}`,
        });

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
