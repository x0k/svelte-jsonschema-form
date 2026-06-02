import { neverError } from "../errors.ts";
import { playgroundThemes, type PlaygroundTheme } from "../playground/index.ts";
import type { SubTheme, ToTheme } from "../themes.ts";
import type { Generated } from "../types.ts";
import {
  externalValidatorPackage,
  isInternalValidator,
  isJsonSchemaValidator,
  isPrecompiledOnlyValidator,
  isSchemaValidator,
  validators,
} from "../validators.ts";
import {
  buildLayers,
  defineLayer,
  type Layer,
  type LayerFiles,
} from "./layer.ts";
import type { SchemaTransformer } from "./schema-transform.ts";

export enum ProjectPlatform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
}

export const PROJECT_PLATFORMS = Object.values(ProjectPlatform);

export type ImportPromise<T> = Promise<{ default: T }>;

export const INITIAL_FILE = "src/routes/+page.svelte";

export const THEME_LAYERS: {
  [T in ProjectTheme]: () => ImportPromise<
    Layer<T extends SubTheme ? "basic" : T>
  >[];
} = {
  basic: () => [import("./layers/basic.ts")],
  pico: () => [import("./layers/pico.ts")],
  daisyui5: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/daisyui5.ts"),
  ],
  flowbite3: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/flowbite3.ts"),
  ],
  skeleton4: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/skeleton4.ts"),
  ],
  shadcn4: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/shadcn4.ts"),
  ],
  "shadcn-extras": () => [
    import("./layers/tailwind4.ts"),
    import("./layers/shadcn-extras.ts"),
  ],
  svar: () => [import("./layers/svar.ts")],
  beercss: () => [import("./layers/beercss.ts")],
};

export function* projectValidators() {
  for (const v of validators()) {
    if (
      (isJsonSchemaValidator(v) && !isPrecompiledOnlyValidator(v)) ||
      isSchemaValidator(v)
    ) {
      yield v;
    }
  }
}

export type ProjectValidator = Generated<typeof projectValidators>;

const SCHEMA_TRANSFORMERS: Partial<
  Record<ProjectValidator, () => ImportPromise<SchemaTransformer>>
> = {
  valibot: () => import("./schema-transformers/schema-to-valibot.ts"),
  zod4: () => import("./schema-transformers/schema-to-zod.ts"),
};

async function createValidatorLayer(validator: ProjectValidator) {
  const transform = await SCHEMA_TRANSFORMERS[validator]?.();
  const base = defineLayer({
    formDefaults: {
      validator,
    },
    codeTransformers: transform && [transform.default],
  });
  if (isInternalValidator(validator)) {
    return base;
  }
  const pkg = externalValidatorPackage(validator);
  return defineLayer({
    ...base,
    package: {
      dependencies: [pkg, ...pkg.dependencies],
    },
  });
}

function* projectValidatorPackages() {
  for (const v of projectValidators()) {
    yield [v, createValidatorLayer(v).then((l) => ({ default: l }))] as const;
  }
}

export const VALIDATOR_LAYERS = Object.fromEntries(
  projectValidatorPackages(),
) as Record<ProjectValidator, ImportPromise<Layer<any>>>;

export const projectThemes = playgroundThemes;

export type ProjectTheme = Generated<typeof projectThemes>;

export enum ProjectSvelteKitIntegration {
  FormActions = "form-actions",
  RemoteFunctions = "remote-functions",
}

export interface ProjectOptions<T extends ProjectTheme> {
  name: string;
  platform: ProjectPlatform;
  theme: T;
  validator: ProjectValidator;
  content: ImportPromise<Layer<ToTheme<T>>>[];
  svelteKitIntegration: ProjectSvelteKitIntegration | undefined;
}

export type OpenPlatformProject = (
  options: ProjectOptions<any>,
  files: LayerFiles,
) => void;

export const PLATFORM_FACTORIES: Record<
  ProjectPlatform,
  () => ImportPromise<OpenPlatformProject>
> = {
  [ProjectPlatform.StackBlitz]: () => import("./platforms/stackblitz.ts"),
  [ProjectPlatform.SvelteLab]: () => import("./platforms/svelte-lab.ts"),
};

function svelteKitIntegrationLayer(variant: ProjectSvelteKitIntegration) {
  switch (variant) {
    case ProjectSvelteKitIntegration.FormActions:
      return import("./layers/form-actions.ts");
    case ProjectSvelteKitIntegration.RemoteFunctions:
      return import("./layers/remote-functions.ts");
    default:
      throw neverError(variant, "unknown sveltekit integration option");
  }
}

export async function projectOpen<T extends PlaygroundTheme>(
  options: ProjectOptions<T>,
) {
  const { theme, validator, platform, content, svelteKitIntegration } = options;
  const promises = [
    import("./layers/sveltekit.ts"),
    ...THEME_LAYERS[theme](),
    VALIDATOR_LAYERS[validator],
    ...content,
  ];
  if (svelteKitIntegration !== undefined) {
    promises.push(svelteKitIntegrationLayer(svelteKitIntegration));
  }
  const layers = await Promise.all(promises);
  const files = buildLayers(layers.map((l) => l.default));
  const factory = await PLATFORM_FACTORIES[platform]();
  factory.default(options, files);
}
