import type {
  CodegenDraft7Validator,
  CodegenIconSet,
  CodegenThemeOrSubTheme,
} from "../codegen/index.ts";
import { createComposer } from "../composer/index.ts";
import type { AbstractPackage } from "../package.ts";
import type { ExtraFieldFileName } from "../fields.ts";
import type { ExtraWidgetFileNames } from "../widgets.ts";
import type { ToTheme } from "../themes.ts";
import { sandboxOpen, type SandboxPlatform } from "../sandbox/index.ts";

import { COMPOSER_DEFAULTS } from "./model.ts";

export interface OpenDemoOptions {
  name: string;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenDraft7Validator;
  icons: CodegenIconSet;
  extraFiles: Record<string, string>;
  extraDependencies: AbstractPackage[];
  fields: ExtraFieldFileName[];
  widgets: ExtraWidgetFileNames[ToTheme<CodegenThemeOrSubTheme>][];
  platform: SandboxPlatform;
}

export async function openDemo({
  name,
  themeOrSubTheme,
  validator,
  icons,
  extraFiles,
  extraDependencies,
  fields,
  widgets,
  platform,
}: OpenDemoOptions) {
  const files = createComposer({
    ...COMPOSER_DEFAULTS,
    name,
    icons: icons,
    themeOrSubTheme,
    validator,
    extraFiles,
    extraDependencies,
    fields,
    widgets,
  });
  await sandboxOpen({ name, platform, files });
}
