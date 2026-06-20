import { convert } from "@sjsf/form/converters/draft-2020-12";
import { isObject } from "@sjsf/form/lib/object";
import { tsPlugin } from "@sveltejs/acorn-typescript";
import { toJsonSchema as valibotToJsonSchema } from "@valibot/to-json-schema";
import * as acorn from "acorn";
import { jsonSchemaToValibot } from "json-schema-to-valibot";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { $ZodType, toJSONSchema } from "zod/v4/core";

import { neverError } from "../errors.ts";
import type { TypedSchema, SchemaType, CodegenValidator } from "./model.ts";
import { parseDefaultJsValue } from "./parse.ts";

const tsParser = acorn.Parser.extend(tsPlugin());

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
  if (
    source.type === target.type &&
    (target.type !== "json" || target.draft2020 === true)
  ) {
    return source.schema;
  }

  const sourceObject = await parseDefaultJsValue(source.schema);
  if (!isObject(sourceObject)) {
    throw new Error("Invalid source schema, expected object");
  }

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
      return targetDraft2020 ? sourceObject : convert(sourceObject);
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

export interface ExtractedSchemaCode {
  code: string;
  expression: string;
}

export function extractSchemaCode(schemaCode: string): ExtractedSchemaCode {
  const program = tsParser.parse(schemaCode, {
    ecmaVersion: "latest",
    sourceType: "module",
  }) as acorn.Node & { body: acorn.Node[] };

  const defaultExportIndex = program.body.findIndex(
    (node: any) => node.type === "ExportDefaultDeclaration"
  );

  if (defaultExportIndex === -1) {
    return { code: schemaCode, expression: schemaCode.trim() };
  }

  const defaultExport = program.body[defaultExportIndex] as any;
  const expressionSource = schemaCode.slice(
    defaultExport.declaration.start,
    defaultExport.declaration.end
  );

  const nonExportStatements = program.body
    .filter((_: any, i: number) => i !== defaultExportIndex)
    .map((node: any) => schemaCode.slice(node.start, node.end))
    .join("\n");

  const code = nonExportStatements ? `${nonExportStatements}\n` : "";

  return { code, expression: expressionSource };
}
