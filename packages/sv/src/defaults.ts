import { createDefaults } from "meta/codegen";

import { POST_EXTRA_WIDGETS, type Context } from "./model.js";

export function defaultsTs({
  options,
  isTs,
  sv,
  language,
  directory,
  ts,
}: Context) {
  sv.file(
    `${directory.lib}/sjsf/defaults.${language}`,
    createDefaults({
      ...options,
      isTs,
      ts,
      resolver: "inline",
      widgets: POST_EXTRA_WIDGETS,
      focusOnFirstError: true,
      merger: {},
      fields: [],
      themeExtension: [],
      moduleAugmentation: {},
      uiOptionsRegistry: {},
    }),
  );
}
