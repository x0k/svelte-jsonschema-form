import path from "node:path";
import fs from "node:fs/promises";

import { extractComponentPropsIndex, resolveComponentName } from "./analyze.ts";

async function extractExtraWidgets(extraWidgetsDir: string) {
  const widgets: Record<string, string> = {};
  for (const e of await fs.readdir(extraWidgetsDir, { withFileTypes: true })) {
    if (!e.isFile() || !e.name.endsWith(".svelte")) {
      continue;
    }
    const widgetFilepath = path.join(extraWidgetsDir, e.name);
    const content = await fs.readFile(widgetFilepath, { encoding: "utf-8" });
    const componentPropsValue = extractComponentPropsIndex(content);
    const name =
      componentPropsValue && resolveComponentName(componentPropsValue);

    if (!name) {
      throw new Error(
        `Failed to detect component name for "${widgetFilepath}"`,
      );
    }
    widgets[path.basename(e.name, ".svelte")] = name;
  }
  return widgets;
}

async function main() {
  const packagesDir = path.join(import.meta.dirname, "../..");
  const labDir = path.join(import.meta.dirname, "../../../lab");
  const legacyDir = path.join(import.meta.dirname, "../../../legacy");
  const libs: Record<string, Record<string, string>> = {};
  const THEME_SUFFIX = "-theme";

  for (const e of (
    await Promise.all([
      fs.readdir(packagesDir, { withFileTypes: true }),
      fs.readdir(labDir, { withFileTypes: true }),
      fs.readdir(legacyDir, { withFileTypes: true }),
    ])
  ).flat()) {
    if (!e.isDirectory() || !e.name.endsWith(THEME_SUFFIX)) {
      continue;
    }
    const theme = e.name.slice(0, -THEME_SUFFIX.length);
    const packagePath = (...paths: string[]) =>
      path.join(e.parentPath, e.name, ...paths);
    const packageJsonPath = packagePath("package.json");
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, { encoding: "utf-8" }),
    );
    const exportPath = packageJson.exports["./extra-widgets/*"]["svelte"];
    const DIST_PREFIX = "./dist/";
    const STAR_SUFFIX = "/*";
    if (
      typeof exportPath !== "string" ||
      !exportPath.startsWith(DIST_PREFIX) ||
      !exportPath.endsWith(STAR_SUFFIX)
    ) {
      throw new Error(
        `Unexpected extra widgets export path: "${exportPath}", expected string starting with '${DIST_PREFIX}' and ends with '${STAR_SUFFIX}' in "${theme}" theme`,
      );
    }
    const svelteConfigPath = packagePath("svelte.config.js");
    const svelteConfig = await import(svelteConfigPath);
    const extraWidgetsPath = packagePath(
      svelteConfig.default.kit?.files?.lib ?? "src/lib",
      exportPath.slice(DIST_PREFIX.length, -STAR_SUFFIX.length),
    );
    libs[theme] = await extractExtraWidgets(extraWidgetsPath);
  }
  const outPath = path.join(import.meta.dirname, "../src/widgets.generated.ts");
  const output = `export const EXTRA_WIDGETS = ${JSON.stringify(libs, null, 2)} as const;`;
  await fs.writeFile(outPath, output, "utf-8");
}

await main();
