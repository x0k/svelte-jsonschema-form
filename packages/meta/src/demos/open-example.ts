import { type CodeTransformer, createComposer } from "../composer/index.ts";
import { sandboxOpen, type SandboxPlatform } from "../sandbox/index.ts";
import type {
  CodegenThemeOrSubTheme,
  CodegenValidator,
} from "../codegen/index.ts";

import {
  EXAMPLE_LAYERS,
  VALIDATOR_TRANSFORMERS,
  type Example,
} from "./model.ts";

export interface OpenExampleOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenValidator;
  platform: SandboxPlatform;
  validatorOverride?: CodegenValidator;
}

export async function openExample(
  example: Example,
  options: OpenExampleOptions,
) {
  const effectiveValidator = options.validatorOverride ?? options.validator;
  const { default: exampleContent } = await EXAMPLE_LAYERS[example]();

  const codeTransformers: CodeTransformer[] = [
    ...exampleContent.codeTransformers,
  ];
  const validatorTransformer = VALIDATOR_TRANSFORMERS[effectiveValidator]?.();
  if (validatorTransformer) {
    codeTransformers.push((await validatorTransformer).default);
  }

  const files = createComposer({
    name: example,
    language: "ts",
    themeOrSubTheme: options.themeOrSubTheme,
    icons: "none",
    validatorWithSuffix: effectiveValidator,
    sveltekit: exampleContent.sveltekit,
    widgets: exampleContent.widgets,
    extraFiles: exampleContent.files,
    extraDependencies: exampleContent.dependencies,
    codeTransformers,
  });

  await sandboxOpen({ name: example, platform: options.platform, files });
}
