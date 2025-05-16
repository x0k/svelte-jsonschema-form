import { overrideByRecord } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import { createTranslate } from "../translation.js";

import type { FormInternalContext } from "./context.js";
import { uiOptionProps } from "./ui-schema.js";

export function retrieveTranslate<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config
) {
  const translations = uiOptionProps("translations")({}, config, ctx);
  return createTranslate(overrideByRecord(ctx.translation, translations));
}
