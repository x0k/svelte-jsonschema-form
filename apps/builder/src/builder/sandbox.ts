import type { Schema, UiSchema } from "@sjsf/form";
import type {
  PlaygroundIconSet,
  PlaygroundResolver,
  PlaygroundTheme,
} from "meta/playground";
import {
  createSandboxFiles,
  type BuilderValidator,
  type WidgetType,
} from "meta/builder";
import { sandboxOpen, SandboxPlatform } from "meta/sandbox";

import { fileFieldModeToFields, type FileFieldMode } from "./model.js";

export interface OpenSandboxOptions {
  platform: SandboxPlatform;
  theme: PlaygroundTheme;
  validator: BuilderValidator;
  schema: Schema;
  uiSchema: UiSchema;
  html5Validation: boolean;
  resolver: PlaygroundResolver;
  icons: PlaygroundIconSet;
  widgets: Set<WidgetType>;
  fileFieldMode: FileFieldMode;
}

export async function openSandbox({
  platform,
  theme,
  validator,
  schema,
  uiSchema,
  icons,
  widgets,
  fileFieldMode,
}: OpenSandboxOptions) {
  const name = `Builder (${theme}, ${validator})`;
  const files = createSandboxFiles({
    name,
    theme,
    validator,
    schema,
    uiSchema,
    icons,
    widgets: Array.from(widgets),
    fields: fileFieldModeToFields(fileFieldMode),
  });
  await sandboxOpen({ name, platform, files });
}
