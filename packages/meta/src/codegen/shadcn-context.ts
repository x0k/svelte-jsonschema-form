import { transforms, type SvelteAst, js as jsUtils } from "@sveltejs/sv-utils";

import { themePackage } from "../themes.ts";
import { shadcnExtrasUiSubPath, shadcnNewYorkThemeSubPath } from "../shadcn.ts";
import { getTopLevelFunction } from "./lib.ts";
import type { PathFactory } from "./model.ts";

export interface ShadcnContextOptions {
  importedComponents: Iterable<string>[];
  nonImportedComponents: Iterable<string>;

  localImports: Iterable<[path: string, imports: string[]]>;
  extraLocalImports: Iterable<[path: string, imports: string[]]>;

  libImports: string[];
  shadcn4ExtraLibImports: string[];
  shadcnExtrasExtraLibImports: string[];
}

const SET_SHADCN_THEME_CONTEXT_FN_NAME = "setShadcnThemeContext";

export function createShadcnContext({
  importedComponents,
  nonImportedComponents,
  localImports,
  extraLocalImports,
  libImports,
  shadcn4ExtraLibImports,
  shadcnExtrasExtraLibImports,
}: ShadcnContextOptions) {
  return transforms.script(({ ast, js, comments }) => {
    js.imports.addNamed(ast, {
      imports: ["setThemeContext"],
      from: themePackage("shadcn4").name,
    });

    if (libImports.length > 0) {
      js.imports.addNamed(ast, {
        imports: libImports,
        from: shadcnNewYorkThemeSubPath,
      });
    }
    for (const [source, imports] of localImports) {
      js.imports.addNamed(ast, {
        from: source,
        imports,
      });
    }

    if (getTopLevelFunction(ast, SET_SHADCN_THEME_CONTEXT_FN_NAME)) {
      return;
    }

    if (shadcn4ExtraLibImports.length > 0) {
      comments.add(ast, {
        type: "Line",
        value: `import { ${shadcn4ExtraLibImports.join(", ")} } from "${shadcnNewYorkThemeSubPath}";`,
      });
    }
    if (shadcnExtrasExtraLibImports.length > 0) {
      comments.add(ast, {
        type: "Line",
        value: `import { ${shadcnExtrasExtraLibImports.join(", ")} } from "${shadcnExtrasUiSubPath}";`,
      });
    }
    for (const [path, components] of extraLocalImports) {
      comments.add(ast, {
        type: "Line",
        value: `import { ${components.join(", ")} } from "${path}";`,
      });
    }

    js.common.appendFromString(ast, {
      code: `// https://x0k.dev/svelte-jsonschema-form/themes/shadcn4/#components
export function ${SET_SHADCN_THEME_CONTEXT_FN_NAME}() {
  setThemeContext({
    components: {
      ${Array.from(importedComponents).join(", ")}\n${Array.from(
        nonImportedComponents,
      )
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
  theme: "shadcn4";
  lib: PathFactory;
  instance: SvelteAst.Script;
  js: typeof jsUtils;
}

export function setupShadcnContext({
  lib,
  instance,
  js,
}: SetupShadcnContextOptions) {
  js.imports.addNamed(instance.content, {
    imports: [SET_SHADCN_THEME_CONTEXT_FN_NAME],
    from: lib("sjsf/shadcn"),
  });
  const statement = js.common.parseStatement(
    `${SET_SHADCN_THEME_CONTEXT_FN_NAME}();`,
  );
  js.common.appendStatement(instance.content, { statement });
}
