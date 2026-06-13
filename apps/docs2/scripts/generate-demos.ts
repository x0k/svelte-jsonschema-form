import fs from "node:fs";
import path from "node:path";

const DEMOS_DIR = path.resolve(import.meta.dirname, "../src/demos");
const LIB_DEMOS_DIR = path.resolve(import.meta.dirname, "../src/lib/demos");
const GENERATED_FILE = path.resolve(
  import.meta.dirname,
  "../src/lib/demo.generated.ts"
);

function toVariableName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^(\d)/, "_$1")
    .replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function parseRelativeImports(content: string): string[] {
  const importRegex = /from\s+["'](\.\.[^"']+|\.\/[^"']+)["']/g;
  const imports: string[] = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]!);
  }
  return imports;
}

function resolveImport(fromDir: string, importPath: string): string | null {
  const resolved = path.resolve(fromDir, importPath);
  if (fs.existsSync(resolved)) return resolved;
  for (const ext of [".ts", ".js", ".svelte"]) {
    if (fs.existsSync(resolved + ext)) return resolved + ext;
  }
  return null;
}

function readFilesRecursive(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  if (!fs.existsSync(DEMOS_DIR)) {
    console.error(`Demos directory not found: ${DEMOS_DIR}`);
    process.exit(1);
  }

  const demoFolders = fs
    .readdirSync(DEMOS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (demoFolders.length === 0) {
    console.warn("No demo folders found in", DEMOS_DIR);
  }

  fs.mkdirSync(LIB_DEMOS_DIR, { recursive: true });

  const demoEntries: { name: string; importPath: string }[] = [];

  for (const folder of demoFolders) {
    const demoDir = path.join(DEMOS_DIR, folder);

    if (!fs.existsSync(path.join(demoDir, "+page.svelte"))) {
      console.warn(`Warning: Demo "${folder}" has no +page.svelte, skipping`);
      continue;
    }

    const allFiles = readFilesRecursive(demoDir).sort();

    const externalFiles = new Set<string>();
    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, "utf-8");
      for (const importPath of parseRelativeImports(content)) {
        const resolved = resolveImport(path.dirname(filePath), importPath);
        if (
          resolved &&
          !resolved.startsWith(demoDir + path.sep) &&
          resolved !== demoDir
        ) {
          externalFiles.add(resolved);
        }
      }
    }
    allFiles.push(...[...externalFiles].filter((f) => !allFiles.includes(f)));
    allFiles.sort();

    const rawImports: {
      variable: string;
      relativePath: string;
      filename: string;
      absolutePath: string;
    }[] = [];
    let componentImport: string | null = null;

    const metaPath = path.join(demoDir, "_meta.ts");
    let metaContent: string | null = null;
    if (fs.existsSync(metaPath)) {
      const metaModule = await import(metaPath);
      metaContent = JSON.stringify(metaModule.default ?? metaModule, null, 2);
    }

    for (const filePath of allFiles) {
      const relativePath = path.relative(demoDir, filePath);
      const filename = path.basename(filePath);

      if (filename === "_meta.ts") continue;

      const variable = toVariableName(filename);

      if (relativePath === "+page.svelte") {
        componentImport = `import Component from "../../demos/${folder}/${relativePath}";`;
      }

      rawImports.push({
        variable,
        relativePath,
        filename,
        absolutePath: filePath,
      });
    }

    const imports: string[] = [
      'import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";',
    ];

    if (componentImport) {
      imports.push(
        `import PageComponent from "../../demos/${folder}/+page.svelte";`
      );
    }

    const rawImportLines = rawImports.map(
      (r) =>
        `import ${r.variable} from "${path.relative(LIB_DEMOS_DIR, r.absolutePath).replaceAll("\\", "/")}?raw";`
    );
    imports.push(...rawImportLines);

    const sortedImports = [...rawImports].sort((a, b) => {
      if (a.relativePath.endsWith("+page.svelte")) return -1;
      if (b.relativePath.endsWith("+page.svelte")) return 1;
      return a.filename.localeCompare(b.filename);
    });

    const filesEntries = sortedImports
      .map(
        (r) =>
          `  "${path.join("src", "routes", r.relativePath)}": ${
            r.relativePath.endsWith("+page.svelte")
              ? `cleanPage(${r.variable})`
              : r.variable
          },`
      )
      .join("\n");

    const demoFileContent = componentImport
      ? `${imports.join("\n")}

const files: Record<string, string> = {
${filesEntries}
};
${`const meta: DemoMeta = ${metaContent ?? "{}"};`}
export default { files, Component: PageComponent, meta } satisfies DemoData;
`
      : `${imports.join("\n")}

const files: Record<string, string> = {
${filesEntries}
};
${`const meta: DemoMeta = ${metaContent ?? "{}"};`}
export default { files, meta } satisfies {
  files: Record<string, string>;
};
`;

    const outputPath = path.join(LIB_DEMOS_DIR, `${folder}.ts`);
    fs.writeFileSync(outputPath, demoFileContent);

    demoEntries.push({
      name: folder,
      importPath: `./demos/${folder}.ts`,
    });
  }

  const typeEntries = demoEntries.map((e) => `  | "${e.name}"`).join("\n");
  const importEntries = demoEntries
    .map((e) => `  "${e.name}": () => import("${e.importPath}"),`)
    .join("\n");

  const generatedContent = `import type { DemoData } from "./demo.ts";

export type DemoName =
${typeEntries || '  ""'};

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
${importEntries}
};
`;

  fs.writeFileSync(GENERATED_FILE, generatedContent);

  console.log(`Generated ${demoEntries.length} demo(s) in ${LIB_DEMOS_DIR}`);
  console.log(`Generated ${GENERATED_FILE}`);
}

await main();
