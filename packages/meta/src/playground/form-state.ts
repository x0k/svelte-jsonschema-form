import type {
  FieldsValidationMode,
  FormValue,
  Schema,
  UiSchemaRoot,
} from "@sjsf/form";
import type {
  Experimental_ArrayMinItems,
  Experimental_DefaultFormStateBehavior,
} from "@sjsf/form/core";

import {
  type PlaygroundValidator,
  type PlaygroundTheme,
  type PlaygroundIconSet,
  type PlaygroundResolver,
  normalizeJsonValue,
  type Normalize,
  normalizeValidator,
} from "./model.ts";

// NOTE: We use legacy types in combination with `| string`
// to maintain compatibility with old URLs.
// TODO: This should be removed in v4.
export interface FormState {
  schema: Schema | string;
  uiSchema: UiSchemaRoot | string;
  // TODO: Replace with `formData: string` in v4
  initialValue: FormValue | string;
  //
  disabled: boolean;
  html5Validation: boolean;
  focusOnFirstError: boolean;
  omitExtraData: boolean;
  fieldsValidationMode: FieldsValidationMode;
  validator: PlaygroundValidator;
  theme: PlaygroundTheme;
  icons: PlaygroundIconSet;
  resolver: PlaygroundResolver;
  css?: string;
  // Merger config
  arrayMinItemsPopulate: ArrayMinItemsPopulate;
  arrayMinItemsMergeExtraDefaults: boolean;
  allOf: AllOfStateBehavior;
  constAsDefault: ConstAsDefaultStateBehavior;
  emptyObjectFields: EmptyObjectFieldsStateBehavior;
  mergeDefaultsIntoFormData: MergeDefaultsIntoFormDataStateBehavior;
}

type ArrayMinItemsPopulate = Exclude<
  Experimental_ArrayMinItems["populate"],
  undefined
>;

export const ARRAY_MIN_ITEMS_POPULATE_TITLES: Record<
  ArrayMinItemsPopulate,
  string
> = {
  all: "Populate remaining minItems with default values (legacy behavior)",
  never: "Never populate minItems with default values",
  requiredOnly:
    "Only populate minItems with default values when field is required",
};

export const ARRAY_MIN_ITEMS_POPULATE = Object.keys(
  ARRAY_MIN_ITEMS_POPULATE_TITLES
) as ArrayMinItemsPopulate[];

type AllOfStateBehavior = Exclude<
  Experimental_DefaultFormStateBehavior["allOf"],
  undefined
>;

export const ALL_OF_STATE_BEHAVIOR_TITLES: Record<AllOfStateBehavior, string> =
  {
    populateDefaults: "Populate defaults with allOf",
    skipDefaults: "Skip populating defaults with allOf",
  };

export const ALL_OF_STATE_BEHAVIOR = Object.keys(
  ALL_OF_STATE_BEHAVIOR_TITLES
) as AllOfStateBehavior[];

type ConstAsDefaultStateBehavior = Exclude<
  Experimental_DefaultFormStateBehavior["constAsDefaults"],
  undefined
>;

export const CONST_AS_DEFAULT_STATE_BEHAVIOR_TITLES: Record<
  ConstAsDefaultStateBehavior,
  string
> = {
  always: "A const value will always be merged into the form as a default",
  skipOneOf:
    "If const is in a `oneOf` it will NOT pick the first value as a default",
  never: "A const value will never be used as a default",
};

export const CONST_AS_DEFAULT_STATE_BEHAVIOR = Object.keys(
  CONST_AS_DEFAULT_STATE_BEHAVIOR_TITLES
) as ConstAsDefaultStateBehavior[];

type EmptyObjectFieldsStateBehavior = Exclude<
  Experimental_DefaultFormStateBehavior["emptyObjectFields"],
  undefined
>;

export const EMPTY_OBJECT_FIELDS_BEHAVIOR_TITLES: Record<
  EmptyObjectFieldsStateBehavior,
  string
> = {
  populateAllDefaults:
    "Assign value to formData when default is primitive, non-empty object field, or is required (legacy behavior)",
  populateRequiredDefaults:
    "Assign value to formData when default is an object and parent is required, or default is primitive and is required",
  skipEmptyDefaults: "Assign value to formData when only default is set",
  skipDefaults: "Does not set defaults",
};

export const EMPTY_OBJECT_FIELDS_BEHAVIOR = Object.keys(
  EMPTY_OBJECT_FIELDS_BEHAVIOR_TITLES
) as EmptyObjectFieldsStateBehavior[];

type MergeDefaultsIntoFormDataStateBehavior = Exclude<
  Experimental_DefaultFormStateBehavior["mergeDefaultsIntoFormData"],
  undefined
>;

export const MERGE_DEFAULTS_INTO_FORM_TITLES: Record<
  MergeDefaultsIntoFormDataStateBehavior,
  string
> = {
  useFormDataIfPresent: "Use undefined field value if present",
  useDefaultIfFormDataUndefined: "Use default for undefined field value",
};

export const MERGE_DEFAULTS_INTO_FORM = Object.keys(
  MERGE_DEFAULTS_INTO_FORM_TITLES
) as MergeDefaultsIntoFormDataStateBehavior[];

// TODO: Remove in v4
export type NormalizedFormState = Normalize<FormState>;

// TODO: Remove in v4
export function normalizeFormState(state: FormState): NormalizedFormState {
  return {
    ...state,
    css: state.css ?? "",
    validator: normalizeValidator(state.validator),
    schema: normalizeJsonValue(state.schema),
    uiSchema: normalizeJsonValue(state.uiSchema),
    initialValue: normalizeJsonValue(state.initialValue),
  };
}
