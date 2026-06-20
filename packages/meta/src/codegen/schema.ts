import { tsPlugin } from "@sveltejs/acorn-typescript";
import * as acorn from "acorn";

const tsParser = acorn.Parser.extend(tsPlugin());

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
