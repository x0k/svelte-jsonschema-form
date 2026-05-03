import {
  shadcn4ExtraWidgetComponents,
  shadcnExtrasExtraWidgetComponents,
  shadcnExtrasUiSubPath,
  shadcnNewYorkThemeSubPath,
  shadcnRequiredComponents,
  themePackage,
  type WidgetComponentsApproximation,
} from "meta";

import {
  fileExists,
  getTopLevelFunction,
  importsAddNamed,
  transforms,
} from "./sv-utils.js";
import type { Context } from "./model.js";

export function shadcnTs({ options, sv, directory, language, cwd }: Context) {
  const isShadcn4 = options.themeOrSubTheme === "shadcn4";
  const isShadcnExtras = options.themeOrSubTheme === "shadcn-extras";
  if (!isShadcn4 && !isShadcnExtras) {
    return;
  }

  let isConfigEmpty = false;
  let realUiPath = `${directory.lib}/components/ui`;

  sv.file(
    "components.json",
    transforms.json(({ data }) => {
      if (
        data === null ||
        typeof data !== "object" ||
        Object.keys(data).length === 0
      ) {
        isConfigEmpty = true;
        return;
      }
      const configUiPath = data.aliases?.ui;
      if (typeof configUiPath !== "string") {
        return;
      }
      // TODO: Support for custom aliases
      realUiPath = configUiPath.replace("$lib", directory.lib);
      return false;
    }),
  );

  const importedComponents: string[] = [];
  const libImports: string[] = [];
  const localImports: [path: string, imports: string[]][] = [];

  for (const { folder, components } of shadcnRequiredComponents()) {
    const uiComponentIndexFilePath = `${realUiPath}/${folder}/index.ts`;
    if (!isConfigEmpty && fileExists(cwd, uiComponentIndexFilePath)) {
      localImports.push([uiComponentIndexFilePath, components.slice()]);
    } else {
      libImports.push(...components);
    }
    importedComponents.push(...components);
  }

  const importedComponentsSet = new Set(importedComponents);
  const extraLocalImports = new Map<string, string[]>();

  const isNotImported = (c: string) =>
    !importedComponentsSet.has(c) && Boolean(importedComponentsSet.add(c));
  function handleExtraWidgetComponents(
    data: WidgetComponentsApproximation,
    extraLibImports: string[],
  ) {
    for (const [folder, components] of Object.entries(data)) {
      const uiComponentIndexFilePath = `${realUiPath}/${folder}/index.ts`;
      const isComponentsArray = Array.isArray(components);
      if (!isConfigEmpty && fileExists(cwd, uiComponentIndexFilePath)) {
        const toImport = isComponentsArray
          ? components.filter(isNotImported)
          : Object.entries(components)
              .filter(([_, c]) => isNotImported(c))
              .map(([name, alias]) => `${name} as ${alias}`);
        if (toImport.length > 0) {
          const imports = extraLocalImports.get(uiComponentIndexFilePath);
          if (imports) {
            imports.push(...toImport);
          } else {
            extraLocalImports.set(uiComponentIndexFilePath, toImport);
          }
        }
      } else {
        extraLibImports.push(
          ...(isComponentsArray
            ? components
            : Object.values(components)
          ).filter(isNotImported),
        );
      }
    }
  }

  const shadcn4ExtraLibImports: string[] = [];
  for (const c of shadcn4ExtraWidgetComponents()) {
    handleExtraWidgetComponents(c.components, shadcn4ExtraLibImports);
  }
  const shadcnExtrasExtraLibImports: string[] = [];
  for (const c of shadcnExtrasExtraWidgetComponents()) {
    handleExtraWidgetComponents(c.components, shadcnExtrasExtraLibImports);
  }
  for (const c of importedComponents) {
    importedComponentsSet.delete(c);
  }

  sv.file(
    `${directory.lib}/sjsf/shadcn.${language}`,
    transforms.script(({ ast, js, comments }) => {
      importsAddNamed(ast, {
        imports: ["setThemeContext"],
        from: themePackage("shadcn4").name,
      });

      if (libImports.length > 0) {
        importsAddNamed(ast, {
          imports: libImports,
          from: shadcnNewYorkThemeSubPath,
        });
      }
      for (const [source, imports] of localImports) {
        importsAddNamed(ast, {
          from: source,
          imports,
        });
      }

      const FN_NAME = "setShadcnThemeContext";

      if (getTopLevelFunction(ast, FN_NAME)) {
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
export function ${FN_NAME}() {
  setThemeContext({
    components: {
      ${importedComponents.join(", ")}\n${Array.from(importedComponentsSet)
        .map((c) => `// ${c}`)
        .join(",\n")}
    }
  })
}`,
        comments,
      });
    }),
  );
}
