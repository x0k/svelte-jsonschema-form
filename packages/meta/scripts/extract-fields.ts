import fs from "node:fs/promises";
import path from "node:path";

import type { TSESTree } from "@typescript-eslint/types";
import { parse } from "svelte/compiler";

import { resolveComponentName, extractComponentPropsIndex } from "./analyze.ts";

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

async function analyzeComponent(filepath: string) {
  const source = await fs.readFile(filepath, "utf-8");
  const ast = parse(source, { modern: true });

  if (ast.instance === null) {
    throw new Error(
      `Unexpected component without instance script "${filepath}"`,
    );
  }

  const constants = ast.module
    ? collectModuleConstants(ast.module.content as TSESTree.Program)
    : undefined;

  const instanceContent = source.slice(ast.instance.start, ast.instance.end);
  const componentPropsValue = extractComponentPropsIndex(instanceContent);
  const name =
    componentPropsValue && resolveComponentName(componentPropsValue, constants);

  if (!name) {
    throw new Error(`Failed to detect component name for "${filepath}"`);
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
  const meta: Record<
    string,
    {
      name: string;
      filename: string;
      wrapperOf: string | null;
    }
  > = {};
  const dir = path.join(import.meta.dirname, "../../form/src/fields/extra");
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (!e.isFile() || !e.name.endsWith(".svelte")) {
      continue;
    }
    const filepath = path.join(dir, e.name);
    const { name, wrapperOf } = await analyzeComponent(filepath);
    const filename = path.basename(e.name, ".svelte");
    meta[filename] = {
      name,
      filename,
      wrapperOf,
    };
  }
  //
  const fieldsOutPath = path.join(
    import.meta.dirname,
    "../src/fields.generated.ts",
  );
  const fieldsContent = `export const EXTRA_FIELDS = ${JSON.stringify(meta, null, 2)} as const;`;
  await fs.writeFile(fieldsOutPath, fieldsContent, "utf-8");
  //
  const preludeOutPath = path.join(
    import.meta.dirname,
    "../src/playground/prelude.generated.d.ts",
  );
  const preludeContent = Object.values(meta)
    .map(
      ({ filename }) => `import "@sjsf/form/fields/extra/${filename}.svelte";`,
    )
    .join("\n");
  await fs.writeFile(preludeOutPath, preludeContent, "utf-8");
}

await main();
