import type { Schema, UiSchema } from "@sjsf/form";
import {
  createSandboxFiles,
  type BuilderValidator,
  type WidgetType,
} from "meta/builder";
import type {
  PlaygroundIconSet,
  PlaygroundResolver,
  PlaygroundTheme,
} from "meta/playground";
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
  const files = await createSandboxFiles({
    name,
    theme,
    validator,
    schema: JSON.stringify(schema),
    uiSchema,
    icons,
    widgets: Array.from(widgets),
    fields: fileFieldModeToFields(fileFieldMode),
  });
  await sandboxOpen({ name, platform, files });
}
