import { createShadcnLib } from "meta/codegen";

import { POST_EXTRA_WIDGETS, type Context } from "./model.js";
import { fileExists, transforms } from "./sv-utils.js";

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
    })
  );

  sv.file(
    `${directory.lib}/sjsf/shadcn.${language}`,
    createShadcnLib({
      themeOrSubTheme: options.themeOrSubTheme,
      resolveImportPath: (folder, libPath) => {
        const localPath = `${realUiPath}/${folder}/index.ts`;
        return !isConfigEmpty && fileExists(cwd, localPath)
          ? localPath
          : libPath;
      },
      widgets: POST_EXTRA_WIDGETS,
    })
  );
}
