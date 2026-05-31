import { createDefaults } from "meta/codegen";

import { type Context } from "./model.js";

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
    createDefaults({ ...options, isTs, ts }),
  );
}
