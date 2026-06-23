import { addFormComponents, DEFAULT_AJV_CONFIG } from "@sjsf/ajv8-validator";
import {
  createFormValidatorFactory as ajvFactory,
  type ValidateFunctions as AjvValidateFunctions,
} from "@sjsf/ajv8-validator/precompile";
import { fromValidators } from "@sjsf/form/validators/precompile";
import { Ajv } from "ajv";
import _addFormats, { type FormatsPlugin } from "ajv-formats";
import { fullFormats } from "ajv-formats/dist/formats.js";
import equal from "ajv/dist/runtime/equal.js";
import ucs2length from "ajv/dist/runtime/ucs2length.js";
import standaloneCode from "ajv/dist/standalone/index.js";

import { importModule } from "../../modules.ts";
import type { CompileValidator } from "../validator-factory.ts";

const addFormats = _addFormats as unknown as FormatsPlugin;

export const draft07: CompileValidator = async (schemas) => {
  const ajv = new Ajv({
    ...DEFAULT_AJV_CONFIG,
    schemas,
    code: {
      source: true,
      esm: true,
    },
  });
  const modules =
    // @ts-expect-error incompatible module resolution strategy
    standaloneCode(addFormComponents(addFormats(ajv)));
  const code = transformStandaloneCode(modules, {
    "ajv/dist/runtime/equal": equal,
    "ajv/dist/runtime/ucs2length": ucs2length,
    "ajv-formats/dist/formats": { fullFormats },
  });

  const validateFunctions = await importModule<AjvValidateFunctions>(code);
  return ajvFactory({
    validatorRetriever: fromValidators(validateFunctions),
  });
};

export type RuntimeModules = Record<string, unknown>;

export function transformStandaloneCode(
  code: string,
  runtimeModules: RuntimeModules = {}
): string {
  const entries = Object.entries(runtimeModules)
    .map(([k, v]) => {
      const val = typeof v === "function" ? v.toString() : JSON.stringify(v);
      return `${JSON.stringify(k)}: ${val}`;
    })
    .join(", ");
  const shim = `const require = (name) => ({${entries}})[name];\n`;
  return shim + code;
}
