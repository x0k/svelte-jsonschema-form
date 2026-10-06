import { createPage, type PathFactory } from "meta/codegen";

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
  demoPage,
}: Context) {
  if (!options.demo) {
    return;
  }

  if (demoPage) {
    sv.file(...demoPage.links);
    sv.file(...demoPage.layout);
  }

  const filepath = demoPage
    ? `${demoPage.addonPath}/+page.svelte`
    : `${directory.kitRoutes}/sjsf.svelte`;

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
