import fs from "node:fs/promises";
import path from "node:path";

import {
  isLegacyTheme,
  isTheme,
  isThemeClientSideOnlyExtraWidget,
  isThemeExtension,
  themeExtensionOrigin,
  themePackage,
  themes,
  type AbstractPackage,
  type ExtraWidgetFileNames,
  type Theme,
} from "../src/index.ts";
import { extractComponentPropsIndex, resolveComponentName } from "./analyze.ts";

const RELATIVE_IMPORT_RE =
  /(?:^|[\s;])(?:import|export)\b[^;"']*?["'](\.{1,2}\/[^"']+)["']/g;

async function resolveLocalImport(
  importer: string,
  specifier: string
): Promise<string | undefined> {
  const filepath = path.resolve(path.dirname(importer), specifier);
  const candidates = [filepath];
  if (path.extname(filepath) === ".js") {
    candidates.push(filepath.slice(0, -".js".length) + ".ts");
  }
  for (const suffix of [".svelte", ".ts", ".js"]) {
    candidates.push(filepath + suffix);
  }
  for (const candidate of candidates) {
    try {
      if ((await fs.stat(candidate)).isFile()) {
        return candidate;
      }
    } catch {
      // Try the next candidate
    }
  }
  return undefined;
}

/**
 * Extra widgets may be split into local components. Collect the source of
 * local imports (within the extra widgets directory) so optional dependencies
 * used by subcomponents are still attributed to the widget.
 */
async function collectWidgetSource(
  filepath: string,
  extraWidgetsDir: string,
  seen = new Set<string>()
): Promise<string> {
  if (seen.has(filepath)) {
    return "";
  }
  seen.add(filepath);
  const content = await fs.readFile(filepath, { encoding: "utf-8" });
  let result = content;
  for (const match of content.matchAll(RELATIVE_IMPORT_RE)) {
    const imported = await resolveLocalImport(filepath, match[1]!);
    if (
      imported === undefined ||
      !imported.startsWith(extraWidgetsDir + path.sep)
    ) {
      continue;
    }
    result +=
      "\n" + (await collectWidgetSource(imported, extraWidgetsDir, seen));
  }
  return result;
}

async function extractWidgetData(
  extraWidgetsDir: string,
  themeOptionalDeps: AbstractPackage[]
) {
  const widgets: Record<string, string> = {};
  const widgetOptionalDeps: Record<string, string[]> = {};
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
        `Failed to detect component name for "${widgetFilepath}"`
      );
    }
    const widgetFileName = path.basename(e.name, ".svelte");
    widgets[widgetFileName] = name;
    const source = await collectWidgetSource(widgetFilepath, extraWidgetsDir);
    const optionalDeps: string[] = [];
    for (const d of themeOptionalDeps) {
      if (!source.includes(d.name)) {
        continue;
      }
      optionalDeps.push(d.name);
    }
    if (optionalDeps.length > 0) {
      widgetOptionalDeps[widgetFileName] = optionalDeps;
    }
  }
  return [widgets, widgetOptionalDeps] as const;
}

const DIST_PREFIX = "./dist/";
const STAR_SUFFIX = "/*";

function getExportPath(pkg: any, exportName: "extra-widgets" | "widgets") {
  return pkg.exports[`./${exportName}/*`]?.["svelte"];
}

function formatExportPath(theme: Theme, exportPath: string) {
  if (
    typeof exportPath !== "string" ||
    !exportPath.startsWith(DIST_PREFIX) ||
    !exportPath.endsWith(STAR_SUFFIX)
  ) {
    throw new Error(
      `Unexpected extra widgets export path: "${exportPath}", expected string starting with '${DIST_PREFIX}' and ends with '${STAR_SUFFIX}' in "${theme}" theme`
    );
  }
  return exportPath.slice(DIST_PREFIX.length, -STAR_SUFFIX.length);
}

interface LibMeta {
  widgets: Record<string, string>;
  extraWidgets: Record<string, string>;
  optionalDeps: Record<string, string[]>;
}

async function main() {
  const packagesDir = path.join(import.meta.dirname, "../..");
  const labDir = path.join(import.meta.dirname, "../../../lab");
  const legacyDir = path.join(import.meta.dirname, "../../../legacy");
  const libs: Record<string, LibMeta> = {};
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
    const packagePath = (...paths: string[]) =>
      path.join(e.parentPath, e.name, ...paths);
    try {
      await fs.access(packagePath("package.json"));
    } catch {
      // Skip stale directories without sources (only build outputs remain)
      continue;
    }
    const theme = e.name.slice(0, -THEME_SUFFIX.length);
    if (!isTheme(theme)) {
      throw new Error(`Unknown theme: "${theme}"`);
    }
    const packageJsonPath = packagePath("package.json");
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, { encoding: "utf-8" })
    );
    // Kit 3 removed `kit.files.lib`, so there is no config left to read the lib
    // dir from. Take it from the `#lib` subpath import where the package
    // declares one, and otherwise from the layout on disk — themes that keep
    // their sources straight in `src` predate the `src/lib` convention.
    const libDir = await (async () => {
      const subpath = packageJson.imports?.["#lib/*"];
      if (subpath) {
        return subpath.replace(/^\.\//, "").replace(/\/?\*$/, "");
      }
      try {
        return (await fs.stat(packagePath("src/lib"))).isDirectory()
          ? "src/lib"
          : "src";
      } catch {
        return "src";
      }
    })();
    const themeOptionalDeps = themePackage(theme).dependencies.filter(
      (d) => d.optional
    );
    const extract = (path: string) =>
      extractWidgetData(
        packagePath(libDir, formatExportPath(theme, path)),
        themeOptionalDeps
      );

    let widgets: Record<string, string> = {};
    const widgetsExportPath = getExportPath(packageJson, "widgets");
    if (widgetsExportPath) {
      // Standard widgets should not contain optional dependencies
      [widgets] = await extract(widgetsExportPath);
    }

    let extraWidgets: Record<string, string> = {};
    let extraWidgetOptionalDeps: Record<string, string[]> = {};
    const extraWidgetsExportPath = getExportPath(packageJson, "extra-widgets");
    if (extraWidgetsExportPath) {
      [extraWidgets, extraWidgetOptionalDeps] = await extract(
        extraWidgetsExportPath
      );
    }

    const optionalDeps: Record<string, string[]> = {};
    for (const [widget, deps] of Object.entries(extraWidgetOptionalDeps)) {
      for (const d of deps) {
        let widgets = optionalDeps[d];
        if (widgets === undefined) {
          widgets = [];
          optionalDeps[d] = widgets;
        }
        widgets.push(widget);
      }
    }
    libs[theme] = { widgets, extraWidgets, optionalDeps };
  }
  const widgetsOutPath = path.join(
    import.meta.dirname,
    "../src/widgets.generated.ts"
  );
  const widgetsContent = `export const WIDGETS = ${JSON.stringify(libs, null, 2)} as const;\n`;
  await fs.writeFile(widgetsOutPath, widgetsContent, "utf-8");
  const themesOutPath = path.join(
    import.meta.dirname,
    "../src/playground/themes.generated.ts"
  );
  const themesContent = `import { extendByRecord } from "@sjsf/form/lib/resolver";
import { clientOnly } from "@sjsf/form/lib/env";

import { fields } from "./fields.generated.ts";
import "./fields.generated.ts";

${Object.entries(libs)
  .map(([theme, { extraWidgets }]) => {
    if (!isTheme(theme)) {
      throw new Error(
        `Unknown theme "${theme}", expected: "${Array.from(themes()).join('" | "')}"`
      );
    }
    if (isLegacyTheme(theme) && theme !== "skeleton4") {
      return `// skip "${theme}" theme`;
    }
    const themeEscaped = escapeTheme(theme);
    const themePkgName = themePackage(theme).name;
    const importedWidgets = new Set<string>();
    const exportedWidgets = new Set<string>();
    const isExtension = isThemeExtension(theme);
    return `${isExtension ? "// " : ""}import { theme as ${themeEscaped}Base } from "${themePkgName}";
${Object.entries(extraWidgets)
  .map(([filename, widgetName]) => {
    if (importedWidgets.has(widgetName)) {
      return `// skip ${widgetName} (${filename})`;
    }
    importedWidgets.add(widgetName);
    return isThemeClientSideOnlyExtraWidget(
      theme,
      filename as ExtraWidgetFileNames[typeof theme]
    )
      ? `export type * as ${themeEscaped}_${widgetName} from "${themePkgName}/extra-widgets/${filename}.svelte";`
      : `import ${themeEscaped}_${widgetName} from "${themePkgName}/extra-widgets/${filename}.svelte";
import "${themePkgName}/extra-widgets/${filename}.svelte";`;
  })
  .join("\n")}
export const ${themeEscaped}Theme = extendByRecord(${isExtension ? `${escapeTheme(themeExtensionOrigin(theme))}Theme` : `${themeEscaped}Base`}, {
  ...fields,
  ${Object.entries(extraWidgets)
    .map(([filename, widgetName]) => {
      const definition = isThemeClientSideOnlyExtraWidget(
        theme,
        filename as ExtraWidgetFileNames[typeof theme]
      )
        ? `${widgetName}: clientOnly(() => import("${themePkgName}/extra-widgets/${filename}.svelte"))`
        : `${widgetName}: ${themeEscaped}_${widgetName}`;
      if (exportedWidgets.has(widgetName)) {
        return `// skip ${definition}`;
      }
      exportedWidgets.add(widgetName);
      return definition;
    })
    .join(",\n  ")}
});`;
  })
  .join("\n\n")}
`;
  await fs.writeFile(themesOutPath, themesContent, "utf-8");
}

function escapeTheme(theme: Theme) {
  return theme.replaceAll("-", "_");
}

await main();
