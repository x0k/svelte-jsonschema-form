import fs from "node:fs/promises";
import path from "node:path";

import type { TSESTree } from "@typescript-eslint/types";
import { parse } from "svelte/compiler";

function collectModuleConstants(
  moduleAst: TSESTree.Program,
): Map<string, string> {
  const map = new Map<string, string>();

  for (const node of moduleAst.body) {
    if (node.type !== "VariableDeclaration") continue;

    for (const decl of node.declarations) {
      if (
        decl.id.type === "Identifier" &&
        decl.init?.type === "Literal" &&
        typeof decl.init.value === "string"
      ) {
        map.set(decl.id.name, decl.init.value);
      }
    }
  }

  return map;
}

function extractComponentPropsIndex(code: string): string | null {
  const start = code.indexOf("ComponentProps[");
  if (start === -1) return null;

  let i = start + "ComponentProps[".length;
  let depth = 1;
  let result = "";

  while (i < code.length) {
    const char = code[i];

    if (char === "[") depth++;
    else if (char === "]") depth--;

    if (depth === 0) break;

    result += char;
    i++;
  }

  return result.trim() || null;
}

function resolveComponentName(
  raw: string,
  moduleConstants: Map<string, string>,
): string | null {
  // "arrayFilesField"
  if (raw.startsWith('"') || raw.startsWith("'")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw.slice(1, -1);
    }
  }

  // typeof field
  const typeofMatch = raw.match(/^typeof\s+(\w+)$/);
  if (typeofMatch) {
    return moduleConstants.get(typeofMatch[1]!) ?? null;
  }

  return null;
}

function getWrappedComponent(instanceAst: TSESTree.Program): string | null {
  for (const node of instanceAst.body) {
    if (node.type !== "ImportDeclaration") continue;

    const source = node.source.value;
    if (typeof source !== "string") continue;

    // strict: only same-directory .svelte imports
    if (source.startsWith("./") && source.endsWith(".svelte")) {
      // return filename only (without "./")
      return source.slice(2, -7);
    }
  }

  return null;
}

function analyzeComponent(source: string) {
  const ast = parse(source, { modern: true });

  if (ast.instance === null) {
    throw new Error("Unexpected component without instance script");
  }

  const constants = ast.module
    ? collectModuleConstants(ast.module.content as TSESTree.Program)
    : new Map();

  const instanceContent = source.slice(ast.instance.start, ast.instance.end);
  const componentPropsValue = extractComponentPropsIndex(instanceContent);
  const name = componentPropsValue
    ? resolveComponentName(componentPropsValue, constants)
    : null;

  if (name === null) {
    throw new Error("Failed to detect component name");
  }

  const wrapperOf = getWrappedComponent(
    ast.instance.content as TSESTree.Program,
  );

  return {
    name,
    wrapperOf,
  };
}

async function main() {
  const meta: {
    name: string;
    file: string;
    wrapperOf: string | null;
  }[] = [];
  const dir = path.join(import.meta.dirname, "../../form/src/fields/extra");
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (!e.isFile() || !e.name.endsWith(".svelte")) {
      continue;
    }
    const filepath = path.join(dir, e.name);
    const content = await fs.readFile(filepath, "utf-8");
    const { name, wrapperOf } = analyzeComponent(content);
    meta.push({
      file: path.basename(e.name, ".svelte"),
      name,
      wrapperOf,
    });
  }
  const outDir = path.join(
    import.meta.dirname,
    "../src/extra-fields.generated.ts",
  );
  const output = `export const extraFields = ${JSON.stringify(meta, null, 2)} as const`;
  await fs.writeFile(outDir, output, "utf-8");
}

await main();
