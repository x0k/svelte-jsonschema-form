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
      addToDemoPage("sjsf", language)
    );
  }

  const filepath = `${directory.kitRoutes}/${isKit ? "demo/sjsf/+page.svelte" : "sjsf.svelte"}`;

  const lib: PathFactory = isKit
    ? KIT_PATH_FACTORY
    : (path) =>
        file.getRelative({
          from: filepath,
          to: `${directory.lib}/${path}`,
        });

  sv.file(
    filepath,
    createPage({
      ...options,
      language,
      form,
      lib,
    })
  );
}
