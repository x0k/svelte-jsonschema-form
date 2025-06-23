import type { DirectoryNode, FileSystemTree } from "@webcontainer/api";
import sdk from "@stackblitz/sdk";
import lz from "lz-string";
import { getParameters } from "codesandbox/lib/api/define";

import {
  Example,
  VALIDATOR_PACKAGES,
  VALIDATOR_VERSIONS,
  VALIDATORS,
  VERSION,
  type ActualTheme,
  type Validator,
} from "@/shared";

import { buildLayers, type Layer, type LayerFiles } from "./layer";

type LayerPromise = Promise<{ layer: Layer }>;

const INITIAL_FILE = "src/routes/+page.svelte";

export enum Platform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
  CodeSandbox = "CodeSandbox",
}

export const PLATFORMS = Object.values(Platform);

export interface ProjectOptions {
  platform: Platform;
  example: Example;
  theme: ActualTheme;
  validator: Validator;
}

const VALIDATOR_LAYERS = Object.fromEntries(
  VALIDATORS.map(
    (validator) =>
      [
        validator,
        Promise.resolve({
          layer: {
            formDefaults: {
              validator,
            },
            package: {
              dependencies: {
                [VALIDATOR_PACKAGES[validator]]: VALIDATOR_VERSIONS[validator],
                [`@sjsf/${validator}-validator`]: VERSION,
              },
            },
          },
        }),
      ] as const
  )
) as Record<Validator, LayerPromise>;

const THEME_LAYERS: Record<ActualTheme, () => LayerPromise[]> = {
  basic: () => [import("./layers/basic")],
  daisyui5: () => [import("./layers/tailwind4"), import("./layers/daisyui5")],
  flowbite3: () => [import("./layers/tailwind4"), import("./layers/flowbite3")],
  shadcn4: () => [import("./layers/tailwind4"), import("./layers/shadcn4")],
  skeleton3: () => [import("./layers/tailwind4"), import("./layers/skeleton3")],
};

const EXAMPLE_LAYERS: Record<Example, () => LayerPromise> = {
  [Example.Starter]: () => import("./examples/starter"),
  [Example.AnimatedArray]: () => import("./examples/animated-array"),
  [Example.MarkdownDescription]: () =>
    import("./examples/markdown-description"),
  [Example.TabbedLayout]: () => import("./examples/tabbed-layout"),
  [Example.AsyncCombobox]: () => import("./examples/async-combobox"),
  [Example.Formulas]: () => import("./examples/formulas"),
  [Example.PatternPropertiesValidator]: () =>
    import("./examples/pattern-properties-validator"),
  [Example.NativeForm]: () => import("./examples/native-form"),
  [Example.DecomposedField]: () => import("./examples/decomposed-field"),
  [Example.MultiStepNativeForm]: () =>
    import("./examples/multi-step-native-form"),
  [Example.LayoutSlots]: () => import("./examples/layout-slots"),
};

export async function openProject({
  example,
  theme,
  validator,
  platform,
}: ProjectOptions) {
  const layers: Awaited<LayerPromise>[] = await Promise.all([
    import("./layers/sveltekit"),
    ...THEME_LAYERS[theme](),
    VALIDATOR_LAYERS[validator],
    EXAMPLE_LAYERS[example](),
  ]);
  const files = buildLayers(layers.map((l) => l.layer));
  switch (platform) {
    case Platform.StackBlitz:
      return sdk.openProject(
        {
          title: `${example} (${theme}, ${validator})`,
          files,
          template: "node",
        },
        {
          openFile: INITIAL_FILE,
        }
      );
    case Platform.SvelteLab:
      return openSvelteLab(files);
    case Platform.CodeSandbox: {
      return openCodeSandbox(files);
    }
  }
}

function openSvelteLab(files: LayerFiles) {
  const encoded = lz.compressToEncodedURIComponent(
    JSON.stringify(convertToFileSystemTree(files))
  );
  const params = new URLSearchParams([["code", encoded]]);
  const url = `https://www.sveltelab.dev/#${params.toString()}`;
  window.open(url);
}

function convertToFileSystemTree(
  flatFiles: Record<string, string>
): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const [path, content] of Object.entries(flatFiles)) {
    const parts = path.split("/");
    let current = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i];
      let dir: FileSystemTree[string] | undefined = current[dirName];
      if (dir === undefined || !("directory" in dir)) {
        dir = {
          directory: {},
        } satisfies DirectoryNode;
        current[dirName] = dir;
      }
      current = dir.directory!;
    }
    const fileName = parts[parts.length - 1];
    current[fileName] = {
      file: {
        contents: content,
      },
    };
  }
  return tree;
}

function openCodeSandbox(flatFiles: Record<string, string>) {
  const form = document.createElement("form");
  form.action = "https://codesandbox.io/api/v1/sandboxes/define";
  form.method = "POST";
  form.target = "_blank";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "parameters";
  input.value = getParameters({
    files: convertToCodeSandboxFiles(flatFiles),
    template: "node",
  });
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

type CodeSandboxFiles = Parameters<typeof getParameters>["0"]["files"];

function convertToCodeSandboxFiles(
  flatFiles: Record<string, string>
): CodeSandboxFiles {
  return Object.fromEntries(
    Object.entries(flatFiles).map(([key, content]) => [
      key,
      {
        content:
          key === "package.json"
            ? fixPackageJsonForCodeSandbox(content)
            : content,
        isBinary: false,
      },
    ])
  );
}

function fixPackageJsonForCodeSandbox(content: string): string {
  const {
    dependencies,
    devDependencies,
    scripts: { dev, ...restScripts },
    ...rest
  } = JSON.parse(content);
  return {
    ...rest,
    scripts: {
      ...restScripts,
      start: dev,
      dev,
    },
    dependencies: {
      ...devDependencies,
      ...dependencies,
    },
  };
}
