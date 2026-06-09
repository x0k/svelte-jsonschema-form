import type { Schema, UiSchema } from "@sjsf/form";
import type { PlaygroundIconSet, PlaygroundResolver, PlaygroundTheme } from "meta/playground";
import type { BuilderValidator, WidgetType } from "meta/builder";
import { sandboxOpen, SandboxPlatform } from "meta/sandbox";

export interface OpenSandboxOptions {
  platform: SandboxPlatform;
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

  await sandboxOpen({
    name: "Sandbox",
    files: {},
    platform
  });
}
