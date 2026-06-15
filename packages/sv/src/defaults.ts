import {
  createDefaults,
  KIT_PATH_FACTORY,
  type PathFactory,
} from "meta/codegen";

import { POST_EXTRA_WIDGETS, POST_MODEL_NAME, type Context } from "./model.js";

export function defaultsTs({
  options,
  isTs,
  sv,
  language,
  directory,
  ts,
  js,
  isKit,
  file,
}: Context) {
  const filepath = `${directory.lib}/sjsf/defaults.${language}`;
  const lib: PathFactory = isKit
    ? KIT_PATH_FACTORY
    : (path) =>
        file.getRelative({
          from: filepath,
          to: `${directory.lib}/${path}`,
        });

  sv.file(
    filepath,
    createDefaults({
      ...options,
      isTs,
      ts,
      js,
      lib,
      resolver: "inline",
      modelName: POST_MODEL_NAME,
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
