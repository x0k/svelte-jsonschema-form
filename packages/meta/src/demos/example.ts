import type {
  CodegenThemeOrSubTheme,
  CodegenValidator,
} from "../codegen/index.ts";
import { type CodeTransformer, createComposer } from "../composer/index.ts";
import { sandboxOpen, type SandboxPlatform } from "../sandbox/index.ts";

import type { Example } from "./example.generated.ts";
import {
  type ExampleMetadata,
  type ExampleContent,
  ExampleCategory,
} from "./model.ts";

export const EXAMPLE_METADATA = import.meta.glob("./*.js", {
  base: "./examples",
  eager: true,
  import: "meta",
}) as Record<Example, ExampleMetadata>;

export const EXAMPLE_CONTENT = import.meta.glob("./*.js", {
  base: "./examples",
  eager: false,
  import: "default",
}) as Record<Example, () => Promise<ExampleContent>>;

export const VALIDATOR_TRANSFORMERS: Partial<
  Record<CodegenValidator, () => Promise<{ default: CodeTransformer }>>
> = {
  zod4: () => import("./schema-transformers/schema-to-zod.ts"),
  valibot: () => import("./schema-transformers/schema-to-valibot.ts"),
  "standard-schema": () =>
    import("./schema-transformers/schema-to-standard-schema.ts"),
};

export interface CreateExampleFilesOptions {
  example: Example;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenValidator;
}

export async function createExampleFiles(
  options: CreateExampleFilesOptions,
): Promise<Record<string, string>> {
  const { example, themeOrSubTheme, validator } = options;
  const meta = EXAMPLE_METADATA[example];
  const content = await EXAMPLE_CONTENT[example]();
  const isValidatorSpecific =
    meta.category === ExampleCategory.ValidatorSpecific;

  const codeTransformers = content.codeTransformers.slice();

  if (isValidatorSpecific) {
    const transformers = VALIDATOR_TRANSFORMERS[validator]?.();
    if (transformers) {
      codeTransformers.push((await transformers).default);
    }
  }

  return createComposer({
    name: `${meta.title} (${themeOrSubTheme}, ${validator})`,
    language: "ts",
    icons: "none",
    themeOrSubTheme,
    validatorWithSuffix: isValidatorSpecific ? content.validator : validator,
    sveltekit: content.sveltekit,
    widgets: content.widgets,
    extraFiles: content.files,
    extraDependencies: content.dependencies,
    codeTransformers,
  });
}

export interface OpenExampleOptions extends CreateExampleFilesOptions {
  platform: SandboxPlatform;
}

export async function openExample(options: OpenExampleOptions) {
  const files = await createExampleFiles(options);
  await sandboxOpen({
    name: options.example,
    platform: options.platform,
    files,
  });
}
