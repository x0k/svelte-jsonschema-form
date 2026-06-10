import type {
  CodegenIconSet,
  CodegenThemeOrSubTheme,
} from "../codegen/index.ts";
import { createComposer } from "../composer/index.ts";
import { sandboxOpen, type SandboxPlatform } from "../sandbox/index.ts";

import { COMPOSER_DEFAULTS, type DemosValidator } from "./model.ts";

export interface OpenDemoOptions {
  name: string;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: DemosValidator["name"];
  icons?: CodegenIconSet;
  extraFiles: Record<string, string>;
  platform: SandboxPlatform;
}

export async function openDemo({
  name,
  themeOrSubTheme,
  validator,
  icons = "none",
  extraFiles,
  platform,
}: OpenDemoOptions) {
  const files = createComposer({
    ...COMPOSER_DEFAULTS,
    name,
    icons: icons,
    themeOrSubTheme,
    validator: { name: validator, draft2020: false, precompiled: false },
    extraFiles,
  });
  await sandboxOpen({ name, platform, files });
}
