import { createDefaults } from "meta/codegen";

import { POST_EXTRA_WIDGETS, type Context } from "./model.js";

export function defaultsTs({
  options,
  isTs,
  sv,
  language,
  directory,
  ts,
  js,
}: Context) {
  const filepath = `${directory.lib}/sjsf/defaults.${language}`;

  sv.file(
    filepath,
    createDefaults({
      ...options,
      isTs,
      ts,
      js,
      resolver: "inline",
      widgets: POST_EXTRA_WIDGETS,
      focusOnFirstError: true,
      merger: {},
      fields: [],
      themeExtension: [],
      moduleAugmentation: {},
      uiOptionsRegistry: {},
    })
  );
}
