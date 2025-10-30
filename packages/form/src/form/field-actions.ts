import type { Snippet } from "svelte";

import type { Ref } from "@/lib/svelte.svelte.js";

import type { Config } from "./config.js";
import type { FormState } from "./state/state.js";
import type { FieldErrors } from "./errors.js";

export interface FieldActionTypes {}

export interface ActionFields {}

export type ActionField = keyof ActionFields;

export type FieldActionType = keyof FieldActionTypes;

export type FieldAction<V> = Snippet<
  [FormState<unknown, unknown>, Config, Ref<V>, FieldErrors]
>;
