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

// Scan demos directory
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

// Ensure output directory exists
fs.mkdirSync(LIB_DEMOS_DIR, { recursive: true });

const demoEntries: { name: string; importPath: string }[] = [];

for (const folder of demoFolders) {
  const demoDir = path.join(DEMOS_DIR, folder);

  // Check for +page.svelte
  if (!fs.existsSync(path.join(demoDir, "+page.svelte"))) {
    console.warn(`Warning: Demo "${folder}" has no +page.svelte, skipping`);
    continue;
  }

  // Read all files in the demo directory
  const allFiles = readFilesRecursive(demoDir).sort();

  const rawImports: {
    variable: string;
    relativePath: string;
    filename: string;
  }[] = [];
  let componentImport: string | null = null;

  for (const filePath of allFiles) {
    const relativePath = path.relative(demoDir, filePath);
    const filename = path.basename(filePath);
    const variable = toVariableName(filename);

    // Check if this is +page.svelte (the component)
    if (relativePath === "+page.svelte") {
      componentImport = `import Component from "../../demos/${folder}/${relativePath}";`;
    }

    // Add raw import for code display
    rawImports.push({
      variable,
      relativePath,
      filename,
    });
  }

  // Generate demo definition file
  const imports: string[] = [
    'import { type DemoData, cleanPage } from "../demo.ts";',
  ];

  if (componentImport) {
    // Use PageComponent to avoid naming conflict with the Component type
    imports.push(
      `import PageComponent from "../../demos/${folder}/+page.svelte";`
    );
  }

  // Add raw imports
  const rawImportLines = rawImports.map(
    (r) =>
      `import ${r.variable} from "../../demos/${folder}/${r.relativePath}?raw";`
  );
  imports.push(...rawImportLines);

  // Build files record entries (sorted by filename)
  const filesEntries = rawImports
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

export default { files, Component: PageComponent } satisfies DemoData;
`
    : `${imports.join("\n")}

const files: Record<string, string> = {
${filesEntries}
};

export default { files } satisfies {
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

// Generate the main file
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
