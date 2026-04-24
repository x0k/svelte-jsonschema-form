import type { FormValue, Schema, SchemaValue } from "@sjsf/form";
import { DEFAULT_AUGMENT_SUFFIX } from "@sjsf/form/validators/precompile";
import { Validation, type AST } from "@hyperjump/json-schema/experimental";
import {
  fromJs,
  type JsonNode,
} from "@hyperjump/json-schema/instance/experimental";
import {
  getErrors,
  type Localization,
  type Json as HyperjumpJson,
} from "@hyperjump/json-schema-errors";

import { JsonSchemaErrorsOutputPlugin } from "./output-plugin.js";

export interface ValidatorOptions {
  ast: AST;
  localization: Localization;
  augmentSuffix?: string;
  valueToJSON?: (value: FormValue) => SchemaValue;
}

export interface Context {
  ast: AST;
  schemaUri: string;
  value: JsonNode;
}

const defaultValueToJson = (v: FormValue): SchemaValue =>
  v === undefined || v === null
    ? null
    : typeof v === "object"
      ? JSON.parse(JSON.stringify(v))
      : v;

export function createContext(
  {
    ast,
    augmentSuffix = DEFAULT_AUGMENT_SUFFIX,
    valueToJSON = defaultValueToJson,
  }: ValidatorOptions,
  { $id: id, allOf }: Schema,
  value: FormValue,
): Context {
  if (id === undefined) {
    const firstAllOfItem = allOf?.[0];
    if (
      typeof firstAllOfItem === "object" &&
      firstAllOfItem.$id !== undefined
    ) {
      id = firstAllOfItem.$id + augmentSuffix;
    } else {
      throw new Error("Schema id not found");
    }
  }
  return {
    ast,
    schemaUri: `${id}#`,
    value: fromJs(valueToJSON(value) as HyperjumpJson),
  };
}

export function validate(ctx: Context) {
  return Validation.interpret(ctx.schemaUri, ctx.value, {
    ast: ctx.ast,
    plugins: [...ctx.ast.plugins],
  });
}

export function evaluateCompiledSchema(
  ctx: Context,
  localization: Localization,
) {
  const outputPlugin = new JsonSchemaErrorsOutputPlugin();
  const context = {
    ast: ctx.ast,
    plugins: [...ctx.ast.plugins, outputPlugin],
  };
  const valid = Validation.interpret(ctx.schemaUri, ctx.value, context);
  return valid
    ? { valid }
    : {
        valid,
        errors: getErrors(
          outputPlugin.output,
          ctx.value,
          localization,
          ctx.ast,
        ),
      };
}
