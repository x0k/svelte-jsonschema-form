import { isOrderedSchemaDeepEqual, type Schema } from "@/core/index.js";

import { FORM_CONFIGS_CACHE } from "../internals.js";
import type { Config } from "../config.js";
import type { FormState } from "./state.js";

/**
 * @query
 */
export function getStableConfig<T>(ctx: FormState<T>, config: Config): Config {
  const cache = ctx[FORM_CONFIGS_CACHE];
  const cached = cache.get(config.path);
  if (
    isOrderedSchemaDeepEqual(
      cached as unknown as Schema,
      config as unknown as Schema
    )
  ) {
    return cached!;
  }
  // TODO: Snapshot?
  cache.set(config.path, config);
  return config;
}
