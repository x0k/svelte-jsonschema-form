import { REF_FLAG } from "@/core/schema.js";

import { isConfigEqual, type Config } from "../config.js";
import { FIELD_EXPANDED } from "../field-state.js";
import {
  FORM_CONFIGS_CACHE,
  FORM_FIELDS_STATE_MAP,
  FORM_PATHS_TRIE_REF,
  internalHasFieldState,
  internalIsCycleRef,
} from "../internals.js";
import type { FormState } from "./state.js";

/**
 * @query
 */
export function getStableConfig<T>(ctx: FormState<T>, config: Config): Config {
  const cache = ctx[FORM_CONFIGS_CACHE];
  const cached = cache.get(config.path);
  if (cached !== undefined && isConfigEqual(cached, config)) {
    return cached;
  }
  // NOTE: A snapshot is not needed here because:
  // 1. The function is usually called with a non-proxied value (object literal)
  // 2. A stable reference to FieldPath will be lost
  cache.set(config.path, config);
  return config;
}

/**
 * @query
 */
export function isCycleRef<T>(ctx: FormState<T>, config: Config): boolean {
  const ref = config.schema[REF_FLAG];
  if (ref === undefined) {
    return false;
  }
  const isExpanded = internalHasFieldState(
    ctx[FORM_FIELDS_STATE_MAP],
    config.path,
    FIELD_EXPANDED
  );
  return (
    !isExpanded &&
    config.value?.() === undefined &&
    internalIsCycleRef(
      ctx[FORM_PATHS_TRIE_REF],
      ctx[FORM_CONFIGS_CACHE],
      config.path,
      ref
    )
  );
}
