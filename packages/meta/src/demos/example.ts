import type { CatalogEntry } from "../catalog.ts";
import type {
  CodegenThemeOrSubTheme,
  CodegenValidator,
} from "../codegen/index.ts";
import { type CodeTransformer, createComposer } from "../composer/index.ts";
import { sandboxOpen, type SandboxPlatform } from "../sandbox/index.ts";

import {
  type ExampleMetadata,
  type ExampleContent,
  ExampleCategory,
} from "./model.ts";

const EXAMPLE_METADATA = import.meta.glob("./examples/*.js", {
  import: "meta",
  eager: true,
});

const EXAMPLE_LOADERS = import.meta.glob("./examples/*.js", {
  import: "default",
  eager: false,
});

export type ExampleEntry = CatalogEntry<ExampleMetadata, ExampleContent>;

export const EXAMPLE_ENTRIES: ExampleEntry[] = Object.keys(EXAMPLE_LOADERS)
  .map((path) => ({
    meta: EXAMPLE_METADATA[path] as ExampleMetadata,
    path,
    load: EXAMPLE_LOADERS[path] as () => Promise<ExampleContent>,
  }))
  .sort((a, b) => a.meta.title.localeCompare(b.meta.title));

export const GROUPED_EXAMPLES = Object.groupBy(
  EXAMPLE_ENTRIES,
  (e) => e.meta.category,
) as Partial<Record<ExampleCategory, ExampleEntry[]>>;

export const VALIDATOR_TRANSFORMERS: Partial<
  Record<CodegenValidator, () => Promise<{ default: CodeTransformer }>>
> = {
  zod4: () => import("./schema-transformers/schema-to-zod.ts"),
  valibot: () => import("./schema-transformers/schema-to-valibot.ts"),
  "standard-schema": () =>
    import("./schema-transformers/schema-to-standard-schema.ts"),
};

export interface CreateExampleFilesOptions {
  entry: ExampleEntry;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenValidator;
}

function exampleName({
  entry: { meta },
  themeOrSubTheme,
  validator,
}: CreateExampleFilesOptions) {
  return `${meta.title} (${themeOrSubTheme}, ${validator})`;
}

export async function createExampleFiles(
  options: CreateExampleFilesOptions,
): Promise<Record<string, string>> {
  const { entry, themeOrSubTheme, validator } = options;
  const { meta, load } = entry;
  const content = await load();
  const isValidatorSpecific = meta.isValidatorSpecific ?? false;

  const codeTransformers = content.codeTransformers.slice();

  if (isValidatorSpecific) {
    const transformers = VALIDATOR_TRANSFORMERS[validator]?.();
    if (transformers) {
      codeTransformers.push((await transformers).default);
    }
  }

  return createComposer({
    name: exampleName(options),
    language: "ts",
    icons: "none",
    themeOrSubTheme,
    validatorWithSuffix: isValidatorSpecific ? content.validator : validator,
    sveltekit: content.sveltekit,
    widgets: content.widgets,
    extraFiles: content.files,
    extraDependencies: content.dependencies,
    codeTransformers,
    modelName: "model",
    fieldsValidationMode: 0,
  });
}

export interface OpenExampleOptions extends CreateExampleFilesOptions {
  platform: SandboxPlatform;
}

export async function openExample(options: OpenExampleOptions) {
  const files = await createExampleFiles(options);
  await sandboxOpen({
    name: exampleName(options),
    platform: options.platform,
    files,
  });
}
