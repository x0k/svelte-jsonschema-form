import { shadcnRequiredComponents, themePackage } from "meta";

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

  function uiFolderExists(folder: string) {
    return fileExists(cwd, `${realUiPath}/${folder}/index.ts`);
  }

  for (const { folder, components } of shadcnRequiredComponents()) {
  }

  sv.file(
    `${directory.lib}/sjsf/shadcn.${language}`,
    transforms.script(({ ast, js }) => {
      js.imports.addNamed(ast, {
        imports: ["setThemeContext"],
        from: themePackage("shadcn4").name,
      });
      const expression = js.common.parseExpression(`() => {
  setThemeContext({
    components: {
      
    }
  })
}`);
      js.exports.createNamed(ast, {
        name: "setShadcnThemeContext",
        fallback: js.variables.declaration(ast, {
          kind: "const",
          name: "setShadcnThemeContext",
          value: expression,
        }),
      });
    }),
  );
}
