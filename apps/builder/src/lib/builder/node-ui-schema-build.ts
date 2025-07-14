import type {
  ComponentProps,
  ComponentType,
  UiOptions,
  UiSchema,
} from "@sjsf/form";
import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

import { assertThing } from "$lib/assert.js";
import { mergeUiSchemas } from "$lib/sjsf/theme.js";

import {
  NodeType,
  type AbstractNode,
  type Node,
  type NodeId,
  type WidgetNode,
} from "./node.js";

export type WidgetType = {
  [T in ComponentType]: ComponentProps[T] extends WidgetCommonProps<any>
    ? T
    : never;
}[ComponentType];

export interface TextWidgetParams {
  type: string | undefined;
  placeholder: string | undefined;
}

export interface UiSchemaBuilderContext {
  propertyNames: Map<NodeId, string>;
  uiComponents: (node: WidgetNode) => UiSchema["ui:components"];
  textWidgetOptions: (params: TextWidgetParams) => UiOptions;
  radioWidgetOptions: (inline: boolean) => UiOptions;
  checkboxesWidgetOptions: (inline: boolean) => UiOptions;
}

const UI_OPTIONS_KEYS = ["help"] as const satisfies (keyof UiOptions)[];

function assignUiOptions<
  T extends Pick<UiOptions, (typeof UI_OPTIONS_KEYS)[number]> | {},
>(target: UiOptions, source: T) {
  for (const key of UI_OPTIONS_KEYS) {
    if (!(key in source)) {
      continue;
    }
    const v = source[key];
    if (v === undefined) {
      continue;
    }
    target[key] = v;
  }
  return target;
}

const invalidNode = () => {
  throw new Error("Invalid node");
};

function leafNode(
  ctx: UiSchemaBuilderContext,
  node: WidgetNode,
  options: UiOptions = {}
) {
  return {
    "ui:components": ctx.uiComponents(node),
    "ui:options": assignUiOptions(options, node.options),
  };
}

const NODE_UI_SCHEMA_BUILDERS: {
  [T in NodeType]: (
    ctx: UiSchemaBuilderContext,
    node: Extract<Node, AbstractNode<T>>
  ) => UiSchema | undefined;
} = {
  [NodeType.Object]: (ctx, { options, properties }) => {
    const schema: UiSchema = {
      "ui:options": assignUiOptions({}, options),
    };
    for (const prop of properties) {
      Object.assign(schema, buildUiSchema(ctx, prop));
    }
    return schema;
  },
  [NodeType.ObjectProperty]: (ctx, { dependencies, property }) => {
    const name = ctx.propertyNames.get(property.id);
    assertThing(name, "object property name");
    return Object.assign(
      { [name]: buildUiSchema(ctx, property) },
      ...dependencies.map((d) => buildUiSchema(ctx, d))
    );
  },
  [NodeType.ObjectPropertyDependency]: (ctx, { properties }) => {
    const schema: UiSchema = {};
    for (const prop of properties) {
      Object.assign(schema, buildUiSchema(ctx, prop));
    }
    return schema;
  },
  [NodeType.Predicate]: invalidNode,
  [NodeType.Operator]: invalidNode,
  [NodeType.Array]: (ctx, { options, item }) => {
    assertThing(item, "array item");
    return {
      "ui:options": assignUiOptions({}, options),
      items: buildUiSchema(ctx, item),
    };
  },
  [NodeType.Grid]: (ctx, { options, height, width, cells }) =>
    Object.assign(
      {
        "ui:options": assignUiOptions(
          {
            layouts: {
              "object-properties": {
                style: `display: grid; grid-template-columns: repeat(${width}, ${options.cellSize}); grid-template-rows: repeat(${height}, ${options.cellSize}); gap: ${options.gap};`,
              },
            },
          },
          options
        ),
      },
      ...cells.map(({ node, x, y, w, h }) => {
        const schema = buildUiSchema(ctx, node);
        const name = ctx.propertyNames.get(node.id);
        assertThing(name, "grid cell name");
        return (
          schema && {
            [name]: mergeUiSchemas(schema, {
              "ui:options": {
                layouts: {
                  "object-property": {
                    style: `grid-column: ${x + 1} / span ${w}; grid-row: ${y + 1} / span ${h};`,
                  },
                },
              },
            }),
          }
        );
      })
    ),
  [NodeType.Enum]: (ctx, node) =>
    leafNode(
      ctx,
      node,
      node.options.widget == "radioWidget"
        ? ctx.radioWidgetOptions(node.options.inline ?? false)
        : {}
    ),
  [NodeType.MultiEnum]: (ctx, node) =>
    leafNode(
      ctx,
      node,
      node.options.widget === "checkboxesWidget"
        ? ctx.checkboxesWidgetOptions(node.options.inline ?? false)
        : {}
    ),
  [NodeType.EnumItem]: invalidNode,
  [NodeType.String]: (ctx, node) =>
    leafNode(
      ctx,
      node,
      node.options.widget === "textWidget"
        ? ctx.textWidgetOptions({
            type: node.options.inputType,
            placeholder: node.options.placeholder,
          })
        : {}
    ),
  [NodeType.Number]: leafNode,
  [NodeType.Boolean]: leafNode,
  [NodeType.File]: leafNode,
  [NodeType.Tags]: leafNode,
};

export function buildUiSchema(
  ctx: UiSchemaBuilderContext,
  node: Node
): UiSchema | undefined {
  const schema = NODE_UI_SCHEMA_BUILDERS[node.type](ctx, node as never);
  if (schema) {
    if (
      schema["ui:options"] &&
      Object.keys(schema["ui:options"]).length === 0
    ) {
      delete schema["ui:options"];
    }
    if (
      schema["ui:components"] &&
      Object.keys(schema["ui:components"]).length === 0
    ) {
      delete schema["ui:components"];
    }
  }
  return schema;
}
