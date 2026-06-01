import {
  shadcn4ExtraWidgetComponents,
  shadcnExtrasExtraWidgetComponents,
  shadcnRequiredComponents,
  type WidgetComponentsApproximation,
} from "meta";
import { createShadcnContext } from "meta/codegen";

import { fileExists, transforms } from "./sv-utils.js";
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
  if (isShadcnExtras) {
    for (const c of shadcnExtrasExtraWidgetComponents()) {
      handleExtraWidgetComponents(c.components, shadcnExtrasExtraLibImports);
    }
  }
  for (const c of importedComponents) {
    importedComponentsSet.delete(c);
  }

  sv.file(
    `${directory.lib}/sjsf/shadcn.${language}`,
    createShadcnContext({
      importedComponents,
      nonImportedComponents: importedComponentsSet,

      localImports,
      extraLocalImports,

      libImports,
      shadcn4ExtraLibImports,
      shadcnExtrasExtraLibImports,
    }),
  );
}
