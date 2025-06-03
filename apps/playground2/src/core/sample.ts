import type { FormValue, Schema, UiSchemaRoot } from "@sjsf/form";

import type { validators } from "./validators.js";
import type { themes } from "./themes.js";
import type { icons } from "./icons.js";
import type { resolvers } from "./resolvers.js";

type Validators = typeof validators;
type Themes = typeof themes;
type Icons = typeof icons;
type Resolvers = typeof resolvers;

export interface PlaygroundState {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  initialValue: FormValue;
  disabled: boolean;
  html5Validation: boolean;
  focusOnFirstError: boolean;
  fieldsValidationMode: 0;
  validator: keyof Validators;
  theme: keyof Themes;
  icons: keyof Icons;
  resolver: keyof Resolvers;
}

type RequiredSampleProperties = "schema" | "uiSchema" | "initialValue";

export type Sample = Pick<PlaygroundState, RequiredSampleProperties> &
  Partial<Omit<PlaygroundState, RequiredSampleProperties>>;
