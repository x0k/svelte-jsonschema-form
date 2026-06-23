import type { Schema, UiOptions, UiSchema } from "@sjsf/form";
import { pickSchemaType, typeOfValue } from "@sjsf/form/core";
import {
  jsonSchemaToValibot,
  type JsonSchema as ValibotJsonSchema,
} from "json-schema-to-valibot";
import { jsonSchemaToZod } from "json-schema-to-zod";
import type { ExtraFieldFileName } from "meta";
import {
  type BuilderValidator2,
  type BuilderValidatorName,
  type WidgetType,
  NodeType,
  type AbstractNode,
  NUMBER_NODE_OPTIONS_SCHEMA,
  STRING_NODE_OPTIONS_SCHEMA,
  builderValidators2,
  builderValidatorId,
  builderValidatorTitle,
  type BuilderValidatorId,
} from "meta/builder";
import type { PlaygroundResolver, PlaygroundTheme } from "meta/playground";
import { WIDGET_EXTRA_FIELD } from "meta/playground";

import {
  BOOLEAN_NODE_OPTIONS_SCHEMA,
  buildEnumValues,
  ENUM_OPTIONS_SCHEMA,
  FILE_NODE_OPTIONS_SCHEMA,
  MULTI_ENUM_OPTIONS_SCHEMA,
  TAGS_NODE_OPTIONS_SCHEMA,
  type Node,
  type TextWidgetParams,
  type WidgetNode,
  type WidgetNodeType,
} from "$lib/builder/index.js";
import { constant } from "$lib/function.js";
import type { SupportedLanguage } from "$lib/shiki";

import type { BuilderDraggable } from "./context.svelte.js";

export const VALIDATOR_ITEMS = Array.from(
  builderValidators2(),
  builderValidatorId
);
export const VALIDATOR_LABELS = Object.fromEntries(
  Array.from(builderValidators2(), (v) => [
    builderValidatorId(v),
    builderValidatorTitle(v),
  ])
) as Record<BuilderValidatorId, string>;

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractNode<T>>;
  draggable: BuilderDraggable;
  showRequired: boolean;
  unmount: () => void;
}

export enum RouteName {
  Editor = "editor",
  Preview = "preview",
}

export interface AbstractRoute<N extends RouteName> {
  name: N;
}

export interface EditorRoute extends AbstractRoute<RouteName.Editor> {}

export enum PreviewSubRouteName {
  Code = "code",
  Schema = "schema",
}

export interface PreviewRoute extends AbstractRoute<RouteName.Preview> {
  subRoute?: PreviewSubRouteName;
}

export type Route = EditorRoute | PreviewRoute;

function basicTextOptions(params: TextWidgetParams): UiOptions {
  return { text: { ...params } };
}

export const TEXT_WIDGET_OPTIONS: Record<
  PlaygroundTheme,
  (params: TextWidgetParams) => UiOptions
> = {
  basic: basicTextOptions,
  pico: basicTextOptions,
  daisyui5: basicTextOptions,
  flowbite3: (params) => ({ flowbite3Text: { ...params } }),
  skeleton4: basicTextOptions,
  shadcn4: (params) => ({ shadcn4Text: { ...params } }),
  svar: (params) => ({
    svarText: { placeholder: params.placeholder, type: params.type as any },
  }),
  beercss: basicTextOptions,
  "shadcn-extras": (params) => ({ shadcn4Text: { ...params } }),
};

export const CHECKBOXES_WIDGET_OPTIONS: Record<
  PlaygroundTheme,
  (inline: boolean) => UiOptions
> = {
  basic: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "display: flex; flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  pico: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "display: flex; flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  daisyui5: (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 0.5rem;",
            },
          },
        }
      : {},
  flowbite3: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  skeleton4: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  shadcn4: (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 1rem;",
            },
          },
        }
      : {},
  svar: (inline) =>
    inline
      ? {
          svarCheckboxes: {
            type: "inline",
          },
        }
      : {},
  beercss: (inline) =>
    inline
      ? {}
      : {
          beercssCheckboxesContainer: {
            class: "vertical",
          },
        },
  "shadcn-extras": (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 1rem;",
            },
          },
        }
      : {},
};

export const RADIO_WIDGET_OPTIONS: Record<
  PlaygroundTheme,
  (inline: boolean) => UiOptions
> = {
  ...CHECKBOXES_WIDGET_OPTIONS,
  shadcn4: (inline) =>
    inline
      ? {
          shadcn4RadioGroup: {
            style: "grid-auto-flow: column; grid-auto-columns: max-content;",
          },
        }
      : {},
  svar: (inline) =>
    inline
      ? {
          svarRadio: {
            type: "inline",
          },
        }
      : {},
  beercss: (inline) =>
    inline
      ? {}
      : {
          beercssRadioContainer: {
            class: "vertical",
          },
        },
  "shadcn-extras": (inline) =>
    inline
      ? {
          shadcn4RadioGroup: {
            style: "grid-auto-flow: column; grid-auto-columns: max-content;",
          },
        }
      : {},
};

export const DEFAULT_COMPONENTS: Record<
  PlaygroundResolver,
  {
    [T in WidgetNodeType]: (
      node: Extract<WidgetNode, AbstractNode<T>>
    ) => UiSchema["ui:components"];
  }
> = {
  basic: {
    [NodeType.Enum]: (node) => {
      const items = buildEnumValues(node.valueType, node.items);
      const type = pickSchemaType(items.map(typeOfValue));
      return {
        [`${type}Field`]: "enumField",
      } satisfies UiSchema["ui:components"];
    },
    [NodeType.MultiEnum]: constant({
      arrayField: "multiEnumField",
    }),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: (node): UiSchema["ui:components"] => {
      if (node.options.multiple) {
        return {
          arrayField: node.options.native
            ? "arrayNativeFilesField"
            : "arrayFilesField",
        };
      }
      return node.options.native
        ? {
            unknownField: "unknownNativeFileField",
          }
        : {
            stringField: "fileField",
          };
    },
    [NodeType.Tags]: constant({
      arrayField: "arrayTagsField",
    }),
    [NodeType.Range]: constant({
      objectField: "aggregatedField",
    }),
  },
  compat: {
    [NodeType.Enum]: constant(undefined),
    [NodeType.MultiEnum]: constant(undefined),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: (node): UiSchema["ui:components"] => {
      if (!node.options.native) {
        return undefined;
      }
      return node.options.multiple
        ? {
            arrayField: "arrayNativeFilesField",
          }
        : {
            unknownField: "unknownNativeFileField",
          };
    },
    [NodeType.Tags]: constant({
      arrayField: "arrayTagsField",
    }),
    [NodeType.Range]: constant({
      objectField: "aggregatedField",
    }),
  },
};

export const DEFAULT_WIDGETS: Record<WidgetNodeType, WidgetType> = {
  [NodeType.Enum]: ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.MultiEnum]: MULTI_ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.String]: STRING_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Number]: NUMBER_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Boolean]: BOOLEAN_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.File]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Tags]: TAGS_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Range]: "aggregatedWidget",
};

export type FileFieldMode = number;
export const FILE_FIELD_SINGLE_MODE = 1;
export const FILE_FIELD_MULTIPLE_MODE = FILE_FIELD_SINGLE_MODE << 1;
export const FILE_FIELD_NATIVE_SINGLE_MODE = FILE_FIELD_MULTIPLE_MODE << 1;
export const FILE_FIELD_NATIVE_MULTIPLE_MODE =
  FILE_FIELD_NATIVE_SINGLE_MODE << 1;

export function fileFieldModeToFields(
  mode: FileFieldMode
): ExtraFieldFileName[] {
  const fields: ExtraFieldFileName[] = [];
  if (mode & FILE_FIELD_SINGLE_MODE) {
    fields.push("file");
  }
  if (mode & FILE_FIELD_MULTIPLE_MODE) {
    fields.push("files");
  }
  if (mode & FILE_FIELD_NATIVE_SINGLE_MODE) {
    fields.push("unknown-native-file");
  }
  if (mode & FILE_FIELD_NATIVE_MULTIPLE_MODE) {
    fields.push("array-native-files");
  }
  return fields;
}

export function computeFields(
  widgets: Iterable<WidgetType>,
  fileFieldMode: FileFieldMode
): ExtraFieldFileName[] {
  const fields = new Set<ExtraFieldFileName>(
    fileFieldModeToFields(fileFieldMode)
  );
  for (const w of widgets) {
    const extra = WIDGET_EXTRA_FIELD[w as keyof typeof WIDGET_EXTRA_FIELD];
    if (extra !== undefined) {
      fields.add(extra);
    }
  }
  return [...fields];
}

function defaultSchemaFactory(schema: Schema) {
  return JSON.stringify(schema, null, 2);
}

const SCHEMA_FACTORIES: Record<
  BuilderValidatorName,
  (schema: Schema) => string
> = {
  ajv8: defaultSchemaFactory,
  schemasafe: defaultSchemaFactory,
  cfworker: defaultSchemaFactory,
  ata: defaultSchemaFactory,
  hyperjump: defaultSchemaFactory,
  zod4: (schema) =>
    `import * as z from "zod";\n\nexport default ${jsonSchemaToZod(schema, { noImport: true })}`,
  valibot: (schema) =>
    jsonSchemaToValibot(schema as ValibotJsonSchema).replace(
      "export const schema = ",
      "export default "
    ),
};

export interface PlaygroundSchemaOptions {
  schema: Schema;
  validator: BuilderValidator2;
}

export function buildPlaygroundSchema({
  schema,
  validator,
}: PlaygroundSchemaOptions): string {
  return SCHEMA_FACTORIES[validator.name](schema);
}

export interface PreviewFile {
  filepath: string;
  title: string;
  extension: string;
  htmlContent: string;
}

const FILE_ORDER = [
  "src/routes/+page.svelte",
  "scripts/compile-validators",
  "src/lib/model",
  "src/lib/sjsf/defaults",
  "package.json",
];

export function sortPreviewFilePaths(paths: string[]): string[] {
  return paths.toSorted((a, b) => {
    const ai = FILE_ORDER.findIndex((p) => a.startsWith(p));
    const bi = FILE_ORDER.findIndex((p) => b.startsWith(p));
    const aOrder = ai === -1 ? FILE_ORDER.length : ai;
    const bOrder = bi === -1 ? FILE_ORDER.length : bi;
    return aOrder !== bOrder ? aOrder - bOrder : a.localeCompare(b);
  });
}

export function parseFileNameAndExtension(filepath: string) {
  const extension = filepath.slice(filepath.lastIndexOf(".") + 1);
  const title = filepath.split("/").pop()!;
  return { title, extension };
}

const HIGHLIGHT_LANG: Record<string, SupportedLanguage> = {
  html: "html",
  svelte: "svelte",
  ts: "typescript",
  js: "typescript",
  css: "css",
  json: "json",
};

export function getHighlighterLang(
  extension: string
): SupportedLanguage | undefined {
  return HIGHLIGHT_LANG[extension];
}
