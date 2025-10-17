import type { Snippet } from "svelte";

import type { Expand } from "@/lib/types.js";
import type { Ref } from "@/lib/svelte.svelte.js";
import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";
import type { FormState } from "./state/state.js";
import type { FieldErrors } from "./errors.js";

export interface FieldActionTypes {}

export interface ActionFields {}

export type ActionField = keyof ActionFields;

export type FieldActionType = keyof FieldActionTypes;

export type FieldAction<V> = Snippet<
  [FormState<unknown>, Config, Ref<V>, FieldErrors]
>;

export type CompatibleFieldActions<V> = keyof {
  [T in FieldActionType as Expand<V> extends FieldActionTypes[T]
    ? T
    : never]: T;
};

export type FieldActions = Resolver<
  Partial<Record<FieldActionType, Config>>,
  Partial<{ [T in FieldActionType]: FieldAction<FieldActionTypes[T]> }>
>;
