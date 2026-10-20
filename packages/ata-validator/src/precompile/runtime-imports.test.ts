import { dirname, relative, resolve } from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const runtimeImportPattern = /^ata-validator(?:\/|$)/;
const precompileDir = import.meta.dirname;
const entryFile = resolve(precompileDir, "index.ts");

function resolveLocalModule(fromFile: string, specifier: string) {
  const base = resolve(dirname(fromFile), specifier);
  return [
    base.replace(/\.js$/, ".ts"),
    `${base}.ts`,
    `${base}.svelte.ts`,
    resolve(base, "index.ts"),
  ].find((candidate) => ts.sys.fileExists(candidate));
}

function isTypeOnlyImport(statement: ts.ImportDeclaration) {
  const importClause = statement.importClause;
  if (!importClause) {
    return false;
  }
  if (importClause.isTypeOnly) {
    return true;
  }
  if (importClause.name !== undefined) {
    return false;
  }
  const namedBindings = importClause.namedBindings;
  return (
    namedBindings !== undefined &&
    ts.isNamedImports(namedBindings) &&
    namedBindings.elements.length > 0 &&
    namedBindings.elements.every((element) => element.isTypeOnly)
  );
}

function isTypeOnlyExport(statement: ts.ExportDeclaration) {
  if (statement.isTypeOnly) {
    return true;
  }
  const exportClause = statement.exportClause;
  return (
    exportClause !== undefined &&
    ts.isNamedExports(exportClause) &&
    exportClause.elements.length > 0 &&
    exportClause.elements.every((element) => element.isTypeOnly)
  );
}

describe("precompile entry", () => {
  it("does not import ata-validator at runtime", () => {
    const runtimeImports: string[] = [];
    const visited = new Set<string>();
    const pending = [entryFile];
    while (pending.length > 0) {
      const file = pending.pop()!;
      if (visited.has(file)) {
        continue;
      }
      visited.add(file);
      const sourceFile = ts.createSourceFile(
        file,
        ts.sys.readFile(file) ?? "",
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
      );
      for (const statement of sourceFile.statements) {
        const isImport = ts.isImportDeclaration(statement);
        if (!isImport && !ts.isExportDeclaration(statement)) {
          continue;
        }
        const moduleSpecifier = statement.moduleSpecifier;
        if (!moduleSpecifier || !ts.isStringLiteral(moduleSpecifier)) {
          continue;
        }
        const isTypeOnly = ts.isImportDeclaration(statement)
          ? isTypeOnlyImport(statement)
          : isTypeOnlyExport(statement);
        if (isTypeOnly) {
          continue;
        }
        const specifier = moduleSpecifier.text;
        if (runtimeImportPattern.test(specifier)) {
          runtimeImports.push(
            `${relative(dirname(precompileDir), file)}: ${specifier}`
          );
        } else if (specifier.startsWith(".")) {
          const importedFile = resolveLocalModule(file, specifier);
          if (importedFile !== undefined) {
            pending.push(importedFile);
          }
        }
      }
    }
    expect(visited.size).toBeGreaterThan(0);
    expect(runtimeImports).toEqual([]);
  });
});
