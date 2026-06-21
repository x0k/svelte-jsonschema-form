import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import _addFormats, { type FormatsPlugin } from "ajv-formats";
import { Ajv2020 } from "ajv/dist/2020.js";

import type { CreatableValidator } from "../validator-factory.ts";

const addFormats = _addFormats as unknown as FormatsPlugin;

export const draft07: CreatableValidator = (options) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });

export const draft2020: CreatableValidator = (options) =>
  createFormValidator({
    ...options,
    Ajv: Ajv2020,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });
