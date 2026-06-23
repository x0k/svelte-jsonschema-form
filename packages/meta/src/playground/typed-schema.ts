import { convert } from "@sjsf/form/converters/draft-2020-12";
import { toJsonSchema as valibotToJsonSchema } from "@valibot/to-json-schema";
import { jsonSchemaToValibot } from "json-schema-to-valibot";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { $ZodType, toJSONSchema } from "zod/v4/core";

import type { CodegenValidator } from "../codegen/index.ts";
import { neverError } from "../errors.ts";
import type { DistributiveOmit } from "../types.ts";
import { convertDraft07To2020 } from "./convert-draft07.ts";
import { isDraft2020 } from "./model.ts";
import { parseSchemaObject } from "./parse.ts";

export type SchemaType =
  | { type: "json"; draft2020: boolean }
  | { type: "zod" }
  | { type: "valibot" };

export type TypedSchema = DistributiveOmit<SchemaType, "draft2020"> & {
  schema: string;
};

export function schemaTypeFromValidator(
  validator: CodegenValidator
): SchemaType {
  if (validator.name === "zod4") return { type: "zod" };
  if (validator.name === "valibot") return { type: "valibot" };
  return { type: "json", draft2020: validator.draft2020 };
}

export interface ConvertTypedSchemaOptions {
  source: TypedSchema;
  target: SchemaType;
}

export async function convertTypedSchema({
  source,
  target,
}: ConvertTypedSchemaOptions): Promise<string> {
  if (target.type !== "json" && source.type === target.type) {
    return source.schema;
  }

  const sourceObject = await parseSchemaObject(source.schema);

  const jsonSchemaObject = toJsonSchema({
    sourceType: source.type,
    sourceObject: sourceObject,
    targetDraft2020: target.type === "json" && target.draft2020,
  });

  return fromJsonSchema({
    jsonSchemaObject,
    targetType: target.type,
  });
}

interface ToJsonSchemaOptions {
  sourceObject: object;
  sourceType: SchemaType["type"];
  targetDraft2020: boolean;
}

function toJsonSchema({
  sourceObject,
  sourceType,
  targetDraft2020,
}: ToJsonSchemaOptions): object {
  switch (sourceType) {
    case "zod":
      return toJSONSchema(sourceObject as $ZodType, {
        target: targetDraft2020 ? "draft-2020-12" : "draft-7",
        unrepresentable: "any",
      });
    case "valibot":
      return valibotToJsonSchema(sourceObject as any, {
        typeMode: "input",
        errorMode: "ignore",
        target: targetDraft2020 ? "draft-2020-12" : "draft-07",
      });
    case "json": {
      const sourceDraft2020 = isDraft2020(sourceObject);
      if (sourceDraft2020 && !targetDraft2020) {
        return convert(sourceObject);
      }
      if (!sourceDraft2020 && targetDraft2020) {
        return convertDraft07To2020(sourceObject);
      }
      return sourceObject;
    }
    default:
      throw neverError(sourceType, "unexpected source type");
  }
}

interface FromJsonSchemaOptions {
  jsonSchemaObject: object;
  targetType: SchemaType["type"];
}

function fromJsonSchema({
  jsonSchemaObject,
  targetType,
}: FromJsonSchemaOptions): string {
  switch (targetType) {
    case "zod": {
      const expr = jsonSchemaToZod(jsonSchemaObject);
      return `import * as z from "zod";\n\nexport default ${expr}`;
    }
    case "valibot": {
      const code = jsonSchemaToValibot(jsonSchemaObject);
      return code.replace("export const schema = ", "export default ");
    }
    case "json":
      return JSON.stringify(jsonSchemaObject);
    default:
      throw neverError(targetType, "unexpected target type");
  }
}
