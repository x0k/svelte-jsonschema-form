import type { Snippet } from "svelte";

import type { Ref } from "@/lib/svelte.svelte.js";
import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";
import type { FormState } from "./state/state.js";

export interface FieldActionTypes {}

export type FieldActionType = keyof FieldActionTypes;

export type FieldAction<V> = Snippet<
  [FormState<unknown>, Config, Ref<V>]
>;

export type FieldActions = Resolver<
  Partial<Record<FieldActionType, Config>>,
  Partial<Record<FieldActionType, FieldAction>>
>;
