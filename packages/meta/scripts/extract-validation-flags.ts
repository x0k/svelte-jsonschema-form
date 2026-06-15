import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

import { formPackage } from "../src/form.ts";

interface FlagEntry {
  name: string;
  jsdoc: string;
}

function extractFlagEntries(source: string, sourcePath: string): FlagEntry[] {
  const sf = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.ES2022,
    true
  );
  const entries: FlagEntry[] = [];
  for (const stmt of sf.statements) {
    if (
      !ts.isVariableStatement(stmt) ||
      !stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }
    const decl = stmt.declarationList.declarations[0];
    if (!decl || !ts.isIdentifier(decl.name)) {
      continue;
    }
    const jsdoc = (ts.getLeadingCommentRanges(source, stmt.pos) ?? [])
      .filter((r) => source.slice(r.pos, r.end).startsWith("/**"))
      .map((r) => source.slice(r.pos, r.end))
      .join("\n");
    entries.push({ name: decl.name.text, jsdoc });
  }
  return entries;
}

async function main() {
  const sourcePath = path.join(
    import.meta.dirname,
    "../../form/src/form/validation.ts"
  );
  const source = await fs.readFile(sourcePath, "utf-8");
  const entries = extractFlagEntries(source, sourcePath);

  const body = entries
    .map(({ name, jsdoc }, i) => {
      const value = `1 << ${i}`;
      return `${jsdoc ? jsdoc + "\n" : ""}export const ${name} = ${value};`;
    })
    .join("\n\n");

  const flagNames = entries.map((e) => e.name);
  const flagUnion = flagNames.map((n) => `"${n}"`).join(" | ");

  const content = `// auto-generated — do not edit. Run \`npm run extract-validation-flags\` to update.
import type { FieldsValidationMode } from "${formPackage.name}";

${body}

export type FieldValidationFlag = ${flagUnion};

export const FIELD_VALIDATION_FLAGS: Record<FieldValidationFlag, FieldsValidationMode> = {
  ${flagNames.join(",\n  ")},
};
`;

  const outPath = path.join(
    import.meta.dirname,
    "../src/validation.generated.ts"
  );
  await fs.writeFile(outPath, content, "utf-8");
}

await main();
