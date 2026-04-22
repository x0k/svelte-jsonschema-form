import {
  shadcnNewYorkThemeSubPath,
  shadcnRequiredComponents,
  themePackage,
} from "meta";

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
      localImports.push([uiComponentIndexFilePath, components]);
    } else {
      libImports.push(...components);
    }
    importedComponents.push(...components);
  }

  sv.file(
    `${directory.lib}/sjsf/shadcn.${language}`,
    transforms.script(({ ast, js, comments }) => {
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

      const expression = js.common.parseExpression(`() => {
  setThemeContext({
    components: {
      ${importedComponents.join(", ")}
    }
  })
}`);
      const declaration = js.variables.declaration(ast, {
        kind: "const",
        name: "setShadcnThemeContext",
        value: expression,
      });
      comments.add(declaration, {
        type: "Line",
        value:
          "https://x0k.dev/svelte-jsonschema-form/themes/shadcn4/#components",
      });
      js.exports.createNamed(ast, {
        name: "setShadcnThemeContext",
        fallback: declaration,
      });
    }),
  );
}
