import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

import { resolveExactVersion, type AbstractPackage } from "../src/package.ts";

interface ExtraPackageMeta {
  name: string;
  catalog?: string;
  dev: boolean;
}

const EXTRA_PACKAGES_META: Record<string, ExtraPackageMeta> = {
  ajvFormat: { name: "ajv-formats", dev: false },
  jsonSchemaToTs: { name: "json-schema-to-ts", dev: true },
  esbuild: { name: "esbuild", dev: true },
  devalue: { name: "devalue", dev: true },
  pico: { name: "@picocss/pico", dev: true },
  vite: { name: "vite", dev: true },
  typescript: { name: "typescript", dev: true },
  svelteVitePlugin: { name: "@sveltejs/vite-plugin-svelte", dev: true },
  svelteAdapterAuto: { name: "@sveltejs/adapter-auto", dev: true },
  tailwindcss3: { name: "tailwindcss", catalog: "legacy", dev: true },
  postcss: { name: "postcss", dev: true },
  autoprefixer: { name: "autoprefixer", dev: true },
  tailwindcss4: { name: "tailwindcss", dev: true },
  tailwindcss4Vite: { name: "@tailwindcss/vite", dev: true },
  typebox: { name: "typebox", dev: false },
  arktype: { name: "arktype", dev: false },
  jsonSchemaTyped: { name: "json-schema-typed", dev: true },
  svelteExmarkdown: { name: "svelte-exmarkdown", dev: false },
  fontsourceVariableInter: { name: "@fontsource-variable/inter", dev: true },
  tailwindcssAnimate: {
    name: "tailwindcss-animate",
    catalog: "legacy",
    dev: true,
  },
  twAnimateCss: { name: "tw-animate-css", catalog: "shadcn", dev: true },
  lucideSvelte: { name: "@lucide/svelte", dev: false },
};

async function main() {
  const yamlPath = path.join(
    import.meta.dirname,
    "../../../pnpm-workspace.yaml",
  );
  const doc = parse(await fs.readFile(yamlPath, "utf-8")) as {
    catalog: Record<string, string>;
    catalogs?: Record<string, Record<string, string>>;
  };

  const versions: Record<string, AbstractPackage> = {};
  for (const [key, meta] of Object.entries(EXTRA_PACKAGES_META)) {
    const map = meta.catalog ? doc.catalogs?.[meta.catalog] : doc.catalog;
    const rawVersion = map?.[meta.name];
    if (!rawVersion) {
      throw new Error(
        `Package "${meta.name}" not found in ${
          meta.catalog ? `catalogs.${meta.catalog}` : "catalog"
        }`,
      );
    }
    versions[key] = {
      name: meta.name,
      version: resolveExactVersion(rawVersion),
      dev: meta.dev,
    };
  }

  const outPath = path.join(
    import.meta.dirname,
    "../src/packages.generated.ts",
  );
  const content = `// auto-generated -- do not edit. Run \`npm run extract-versions\` to update.
import type { AbstractPackage } from "./package.ts";
export const EXTRA_PACKAGES = ${JSON.stringify(versions, null, 2)} as const satisfies Record<string, AbstractPackage>;
`;
  await fs.writeFile(outPath, content, "utf-8");
}

await main();
