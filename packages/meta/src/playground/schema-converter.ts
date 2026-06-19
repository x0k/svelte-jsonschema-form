import { convert } from "@sjsf/form/converters/draft-2020-12";
import { toJsonSchema as valibotToJsonSchema } from "@valibot/to-json-schema";
import { jsonSchemaToValibot } from "json-schema-to-valibot";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { toJSONSchema } from "zod/v4/core";

import { normalizeValidator, type PlaygroundValidator2 } from "./model.ts";

export type SchemaFormat = "zod" | "valibot";

export function getValidatorFormat(
  validator: PlaygroundValidator2,
): SchemaFormat | "json-schema" {
  const v = normalizeValidator(validator);
  if (v.name === "zod4") return "zod";
  if (v.name === "valibot") return "valibot";
  return "json-schema";
}

export function isDraft2020Validator(validator: PlaygroundValidator2): boolean {
  return normalizeValidator(validator).draft2020;
}

export function detectSchemaFormat(
  schema: string,
): SchemaFormat | "json-schema" {
  if (schema.includes('"zod"') || schema.includes("'zod'")) {
    return "zod";
  }
  if (schema.includes('"valibot"') || schema.includes("'valibot'")) {
    return "valibot";
  }
  return "json-schema";
}

export function toJsonSchema(schemaObj: object, format: SchemaFormat): string {
  let jsonSchema: object;
  if (format === "zod") {
    jsonSchema = toJSONSchema(schemaObj as any, {
      target: "draft-7",
      unrepresentable: "any",
    });
  } else {
    jsonSchema = valibotToJsonSchema(schemaObj as any, {
      typeMode: "input",
      errorMode: "ignore",
    }) as object;
  }
  return JSON.stringify(jsonSchema, null, 2);
}

export function fromJsonSchema(
  jsonSchemaStr: string,
  format: SchemaFormat,
  sourceDraft2020 = false,
): string {
  let jsonSchema = JSON.parse(jsonSchemaStr);
  if (sourceDraft2020) {
    jsonSchema = convert(jsonSchema as any);
  }
  if (format === "zod") {
    const expr = jsonSchemaToZod(jsonSchema);
    return `import * as z from "zod";\n\nexport default ${expr}`;
  }
  const code = jsonSchemaToValibot(jsonSchema);
  return code.replace("export const schema = ", "export default ");
}
