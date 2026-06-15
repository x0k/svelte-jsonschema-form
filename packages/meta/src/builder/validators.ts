import { createFormValidator as ata } from "@sjsf-lab/ata-validator";
import {
  addFormComponents,
  createFormValidator as ajv8,
} from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import type { FormValidator } from "@sjsf/form";
import { createFormValidator as schemasafe } from "@sjsf/schemasafe-validator";
import _addFormats, { type FormatsPlugin } from "ajv-formats";

import type { BuilderValidator } from "./model.ts";

const addFormats = _addFormats as unknown as FormatsPlugin;

const ajv8Factory = <T>(options: Parameters<typeof ajv8>[0]) =>
  ajv8<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });

export const BUILDER_VALIDATORS = {
  ajv8: ajv8Factory,
  ata,
  cfworker,
  schemasafe,
  valibot: ajv8Factory,
  zod4: ajv8Factory,
} satisfies Record<BuilderValidator, <T>(...args: any) => FormValidator<T>>;
