import type { Snippet } from "svelte";

import type { Ref } from "@/lib/svelte.svelte.js";
import type { Resolver } from "@/lib/resolver.js";
import type { SchemaValue } from "@/core/index.js";

import type { Config } from "./config.js";
import type { FormState } from "./state/state.js";

export interface FieldActionTypes {}

export type FieldActionType = keyof FieldActionTypes;

export type FieldAction = Snippet<
  [FormState<unknown>, Config, Ref<SchemaValue | undefined>]
>;

export type FieldActions = Resolver<
  Partial<Record<FieldActionType, Config>>,
  Partial<Record<FieldActionType, FieldAction>>
>;
