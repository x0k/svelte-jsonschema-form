import fs from "node:fs/promises";
import path from "node:path";

const EXAMPLES_DIR = path.join(import.meta.dirname, "../src/demos/examples");

const OUT_PATH = path.join(
  import.meta.dirname,
  "../src/demos/example.generated.ts",
);

async function main() {
  const files = await fs.readdir(EXAMPLES_DIR);

  const examples = files
    .filter((f) => f.endsWith(".ts"))
    .map((f) => `./${f}`)
    .sort();

  const examplesStr = examples.map((e) => `  "${e}"`).join(",\n");

  const content = `// auto-generated -- do not edit. Run \`npm run extract-examples\` to update.
export const EXAMPLES = [
${examplesStr},
] as const;

export type Example = (typeof EXAMPLES)[number];
`;

  await fs.writeFile(OUT_PATH, content, "utf-8");
}

await main();
