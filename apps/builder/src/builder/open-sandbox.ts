import type { Schema, UiSchema } from "@sjsf/form";
import type { PlaygroundIconSet, PlaygroundResolver, PlaygroundTheme } from "meta/playground";
import { defineLayer, projectOpen, type ProjectPlatform } from "meta/composer";
import type { BuilderValidator, WidgetType } from "meta/builder";

import { buildFormDefaults, buildFormDotSvelte } from "./code-builders.js";

export interface OpenSandboxOptions {
  platform: ProjectPlatform;
  theme: PlaygroundTheme;
  validator: BuilderValidator;
  schema: Schema;
  uiSchema: UiSchema | undefined;
  html5Validation: boolean;
  resolver: PlaygroundResolver;
  icons: PlaygroundIconSet;
  widgets: Set<WidgetType>;
  fileFieldMode: number;
}

export async function openSandbox(options: OpenSandboxOptions) {
  const { platform, theme, validator } = options;

  let pageContent = buildFormDotSvelte(options);
  pageContent = pageContent.replace("$lib/form/defaults.js", "$lib/form-defaults");

  const defaultsContent = buildFormDefaults(options);

  const layer = defineLayer({
    files: {
      "src/routes/+page.svelte": pageContent
    },
    codeTransformers: [
      (filepath, code) => {
        if (filepath === "src/lib/form-defaults.ts") {
          return defaultsContent;
        }
        return code;
      }
    ]
  });

  await projectOpen({
    name: `Sandbox`,
    platform,
    theme,
    validator,
    svelteKitIntegration: undefined,
    content: [Promise.resolve({ default: layer })]
  });
}
