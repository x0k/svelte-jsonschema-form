import { transforms, type SvelteAst, js as jsUtils } from "@sveltejs/sv-utils";

import { themePackage } from "../themes.ts";
import {
  shadcn4ExtraWidgetComponents,
  shadcnExtrasExtraWidgetComponents,
  shadcnRequiredComponents,
  shadcnNewYorkThemeSubPath,
  shadcnExtrasUiSubPath,
} from "../shadcn.ts";
import { getTopLevelFunction } from "./lib.ts";
import type { CodegenThemeOrSubTheme, PathFactory } from "./model.ts";

export interface ShadcnComponentMeta {
  /** Component name */
  name: string;
  /** Import path (e.g. "@sjsf/shadcn4-theme/new-york" or a local path) */
  importPath: string;
  /** Whether this component is actively used or commented-out for discoverability */
  active: boolean;
}

export type ShadcnPathResolver = (folder: string, libPath: string) => string;

export interface ShadcnLibOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  resolveImportPath: ShadcnPathResolver;
  widgets: string[];
}

const SET_SHADCN_THEME_CONTEXT_FN_NAME = "setShadcnThemeContext";

export function createShadcnLib({
  themeOrSubTheme,
  resolveImportPath,
  widgets,
}: ShadcnLibOptions) {
  return transforms.script(({ ast, js, comments }) => {
    if (themeOrSubTheme !== "shadcn4" && themeOrSubTheme !== "shadcn-extras") {
      return false;
    }
    const isShadcnExtras = themeOrSubTheme === "shadcn-extras";

    js.imports.addNamed(ast, {
      imports: ["setThemeContext"],
      from: themePackage("shadcn4").name,
    });

    const byPath = new Map<string, { active: string[]; commented: string[] }>();
    const activeComponents: string[] = [];
    const commentedComponents: string[] = [];
    const seen = new Set<string>();
    const activeWidgets = new Set(widgets);

    function addComponent(name: string, importPath: string, active: boolean) {
      let group = byPath.get(importPath);
      if (!group) {
        group = { active: [], commented: [] };
        byPath.set(importPath, group);
      }
      if (active) {
        group.active.push(name);
        activeComponents.push(name);
      } else {
        group.commented.push(name);
        commentedComponents.push(name);
      }
    }

    for (const { folder, components } of shadcnRequiredComponents()) {
      const importPath = resolveImportPath(folder, shadcnNewYorkThemeSubPath);
      for (const name of components) {
        seen.add(name);
        addComponent(name, importPath, true);
      }
    }

    for (const widget of shadcn4ExtraWidgetComponents()) {
      const isActive = activeWidgets.has(widget.widget);
      for (const [folder, components] of Object.entries(widget.components)) {
        const importPath = resolveImportPath(folder, shadcnNewYorkThemeSubPath);
        const list = Array.isArray(components)
          ? components
          : Object.values(components);
        for (const c of list) {
          if (!seen.has(c)) {
            seen.add(c);
            addComponent(c, importPath, isActive);
          }
        }
      }
    }

    if (isShadcnExtras) {
      for (const widget of shadcnExtrasExtraWidgetComponents()) {
        const isActive = activeWidgets.has(widget.widget);
        for (const [folder, components] of Object.entries(widget.components)) {
          const importPath = resolveImportPath(folder, shadcnExtrasUiSubPath);
          const list = Array.isArray(components)
            ? components
            : Object.values(components);
          for (const c of list) {
            if (!seen.has(c)) {
              seen.add(c);
              addComponent(c, importPath, isActive);
            }
          }
        }
      }
    }

    for (const [
      importPath,
      {
        active: activeNames,
        // commented: commentedNames
      },
    ] of byPath) {
      if (activeNames.length > 0) {
        js.imports.addNamed(ast, {
          imports: activeNames,
          from: importPath,
        });
      }
      // if (commentedNames.length > 0) {
      //   comments.add(ast, {
      //     type: "Line",
      //     value: `import { ${commentedNames.join(", ")} } from "${importPath}";`,
      //   });
      // }
    }

    if (getTopLevelFunction(ast, SET_SHADCN_THEME_CONTEXT_FN_NAME)) {
      return;
    }

    js.common.appendFromString(ast, {
      code: `// https://x0k.dev/svelte-jsonschema-form/themes/shadcn4/#components
export function ${SET_SHADCN_THEME_CONTEXT_FN_NAME}() {
  setThemeContext({
    components: {
      ${activeComponents.join(", ")}\n${commentedComponents
        .map((c) => `// ${c}`)
        .join(",\n")}
    }
  })
}`,
      comments,
    });
  });
}

export interface SetupShadcnContextOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  lib: PathFactory;
  instance: SvelteAst.Script;
  js: typeof jsUtils;
}

export function setupShadcnContext({
  themeOrSubTheme,
  lib,
  instance,
  js,
}: SetupShadcnContextOptions) {
  if (themeOrSubTheme !== "shadcn4" && themeOrSubTheme !== "shadcn-extras") {
    return;
  }

  js.imports.addNamed(instance.content, {
    imports: [SET_SHADCN_THEME_CONTEXT_FN_NAME],
    from: lib("sjsf/shadcn"),
  });
  const statement = js.common.parseStatement(
    `${SET_SHADCN_THEME_CONTEXT_FN_NAME}();`,
  );
  js.common.appendStatement(instance.content, { statement });
}
