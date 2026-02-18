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
  // TODO: Create a separate function for comparing configs
  if (
    isOrderedSchemaDeepEqual(
      cached as unknown as Schema,
      config as unknown as Schema
    )
  ) {
    return cached!;
  }
  // NOTE: A snapshot is not needed here because:
  // 1. The function is usually called with a non-proxied value (object literal)
  // 2. A stable reference to FieldPath will be lost
  cache.set(config.path, config);
  return config;
}
