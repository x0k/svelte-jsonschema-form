import { convert } from "@sjsf/form/converters/draft-2020-12";
import { toJsonSchema as valibotToJsonSchema } from "@valibot/to-json-schema";
import { jsonSchemaToValibot } from "json-schema-to-valibot";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { toJSONSchema } from "zod/v4/core";

import { normalizeValidator, type PlaygroundValidator2 } from "./model.ts";

export type SchemaFormat = "zod" | "valibot";

export function getValidatorFormat(
  validator: PlaygroundValidator2
): SchemaFormat | "json-schema" {
  const v = normalizeValidator(validator);
  if (v.name === "zod4") return "zod";
  if (v.name === "valibot") return "valibot";
  return "json-schema";
}

export function isDraft2020Validator(validator: PlaygroundValidator2): boolean {
  return normalizeValidator(validator).draft2020;
}

export interface ToJsonSchemaOptions {
  schema: object;
  format: SchemaFormat;
  targetDraft2020: boolean;
}

export function toJsonSchema({
  schema,
  format,
  targetDraft2020,
}: ToJsonSchemaOptions): string {
  let jsonSchema: object;
  if (format === "zod") {
    jsonSchema = toJSONSchema(schema as any, {
      target: targetDraft2020 ? "draft-2020-12" : "draft-7",
      unrepresentable: "any",
    });
  } else {
    jsonSchema = valibotToJsonSchema(schema as any, {
      typeMode: "input",
      errorMode: "ignore",
      target: targetDraft2020 ? "draft-2020-12" : "draft-07",
    }) as object;
  }
  return JSON.stringify(jsonSchema, null, 2);
}

export interface FromJsonSchemaOptions {
  schema: string;
  format: SchemaFormat;
  sourceDraft2020: boolean;
}

export function fromJsonSchema({
  schema,
  format,
  sourceDraft2020,
}: FromJsonSchemaOptions): string {
  let jsonSchema = JSON.parse(schema);
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
