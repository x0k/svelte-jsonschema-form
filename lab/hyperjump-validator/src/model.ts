import type { FormValue, Schema } from "@sjsf/form";
import { DEFAULT_AUGMENT_SUFFIX } from "@sjsf/form/validators/precompile";
import {
  BASIC,
  interpret,
  type AST,
} from "@hyperjump/json-schema/experimental";
import {
  fromJs,
  type JsonNode,
} from "@hyperjump/json-schema/instance/experimental";
import {
  evaluateSchema,
  getErrors,
  type ErrorIndex,
  type Localization,
  type OutputFormat,
  type OutputUnit,
  type Json as HyperjumpJson,
} from "@hyperjump/json-schema-errors";
import { step, type Browser } from "@hyperjump/browser";
import { pointerSegments } from "@hyperjump/json-pointer";

export interface ValidatorOptions {
  ast: AST;
  localization: Localization;
  augmentSuffix?: string;
}

export interface Context {
  ast: AST;
  schemaUri: string;
  value: JsonNode;
}

export function createContext(
  { ast, augmentSuffix = DEFAULT_AUGMENT_SUFFIX }: ValidatorOptions,
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
    value: fromJs(value as HyperjumpJson),
  };
}

export function validate(ctx: Context) {
  return interpret(ctx, ctx.value, BASIC);
}

async function constructErrorIndex(
  outputUnit: OutputUnit,
  schema: Browser,
  errorIndex: ErrorIndex = {},
) {
  if (outputUnit.valid) {
    return errorIndex;
  }

  for (const errorOutputUnit of outputUnit.errors ?? []) {
    if (errorOutputUnit.valid) {
      continue;
    }

    if (!("instanceLocation" in errorOutputUnit)) {
      throw Error("Missing instanceLocation in output node");
    }

    if (
      !(
        "keywordLocation" in errorOutputUnit ||
        "absoluteKeywordLocation" in errorOutputUnit
      )
    ) {
      throw new Error("Missing absoluteKeywordLocation or keywordLocation");
    }

    const absoluteKeywordLocation =
      errorOutputUnit.absoluteKeywordLocation ??
      (await toAbsoluteKeywordLocation(
        schema,
        errorOutputUnit.keywordLocation!,
      ));
    const instanceLocation = errorOutputUnit.instanceLocation!.replace(
      /^#?\*?/,
      "#",
    );

    errorIndex[absoluteKeywordLocation] ??= {};
    errorIndex[absoluteKeywordLocation][instanceLocation] = true;
    await constructErrorIndex(errorOutputUnit, schema, errorIndex);
  }

  return errorIndex;
}

async function toAbsoluteKeywordLocation(
  schema: Browser,
  keywordLocation: string,
) {
  if (keywordLocation.startsWith("#")) {
    keywordLocation = keywordLocation.slice(1);
  }

  for (const segment of pointerSegments(keywordLocation)) {
    schema = await step(segment, schema);
  }

  return `${schema.document.baseUri}#${schema.cursor}`;
}

export async function jsonSchemaErrors(
  ctx: Context,
  errorOutput: OutputFormat,
  schema: Schema,
  localization: Localization,
) {
  const errorIndex = await constructErrorIndex(errorOutput, schema as Browser);
  const normalizedErrors = evaluateSchema(ctx.schemaUri, ctx.value, {
    ast: ctx.ast,
    errorIndex,
    plugins: [...ctx.ast.plugins],
  });
  return getErrors(normalizedErrors, ctx.value, localization, ctx.ast);
}
