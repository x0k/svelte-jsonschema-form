import { identity } from "@sjsf/form/lib/function";
import type { UiOptions, UiSchema } from "@sjsf/form";

import { assertThing } from "$lib/assert.js";
import { mergeUiSchemas } from "$lib/sjsf/theme.js";

import {
  NodeType,
  type AbstractNode,
  type EnumItemNode,
  type Node,
  type NodeId,
  type WidgetNode,
} from "./node.js";
import { EnumValueType } from "./enum.js";

export interface TextWidgetParams {
  type: string | undefined;
  placeholder: string | undefined;
}

export interface UiSchemaBuilderContext {
  readonly propertyNames: Map<NodeId, string>;
  propertiesOrder: string[];
  uiComponents: (node: WidgetNode) => UiSchema["ui:components"];
  textWidgetOptions: (params: TextWidgetParams) => UiOptions;
  radioWidgetOptions: (inline: boolean) => UiOptions;
  checkboxesWidgetOptions: (inline: boolean) => UiOptions;
  useLabelOptions: (node: WidgetNode) => UiOptions;
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
    "ui:options": assignUiOptions(
      Object.assign(ctx.useLabelOptions(node), options),
      node.options
    ),
  };
}

function buildEnumNames(type: EnumValueType, items: EnumItemNode[]): UiOptions {
  const toValue = type === EnumValueType.JSON ? JSON.stringify : identity;
  if (items.every((item) => toValue(item.label) === item.value)) {
    return {};
  }
  return {
    enumNames: items.map((item) => item.label),
  };
}

const NODE_UI_SCHEMA_BUILDERS: {
  [T in NodeType]: (
    ctx: UiSchemaBuilderContext,
    node: Extract<Node, AbstractNode<T>>
  ) => UiSchema | undefined;
} = {
  [NodeType.Object]: (ctx, { options, properties }) => {
    const prevOrder = ctx.propertiesOrder;
    ctx.propertiesOrder = [];
    const schema: UiSchema = {};
    let haveDependencies = false;
    for (const prop of properties) {
      haveDependencies ||= prop.dependencies.length > 0;
      Object.assign(schema, buildUiSchema(ctx, prop));
    }
    schema["ui:options"] = assignUiOptions(
      haveDependencies
        ? {
            order: ctx.propertiesOrder,
          }
        : {},
      options
    );
    ctx.propertiesOrder = prevOrder;
    return schema;
  },
  [NodeType.ObjectProperty]: (ctx, { dependencies, property }) => {
    const name = ctx.propertyNames.get(property.id);
    assertThing(name, "object property name");
    ctx.propertiesOrder.push(name);
    const schema: UiSchema = { [name]: buildUiSchema(ctx, property) };
    for (const dep of dependencies) {
      Object.assign(schema, buildUiSchema(ctx, dep));
    }
    return schema;
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
                style: `display: grid; grid-template-columns: repeat(${width}, ${options.cellSize}); grid-template-rows: repeat(${height}, ${options.cellSize}); gap: ${options.gap};${options.additionalStyles ?? ""}`,
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
        const uiSchema = {
          "ui:options": {
            layouts: {
              "object-property": {
                style: `grid-column: ${x + 1} / span ${w}; grid-row: ${y + 1} / span ${h};`,
              },
            },
          },
        };
        return {
          [name]: schema ? mergeUiSchemas(schema, uiSchema) : uiSchema,
        };
      })
    ),
  [NodeType.Enum]: (ctx, node) =>
    leafNode(
      ctx,
      node,
      Object.assign(
        buildEnumNames(node.valueType, node.items),
        node.options.widget == "radioWidget"
          ? ctx.radioWidgetOptions(node.options.inline ?? false)
          : undefined
      )
    ),
  [NodeType.MultiEnum]: (ctx, node) => {
    const schema: UiSchema = leafNode(
      ctx,
      node,
      node.options.widget === "checkboxesWidget"
        ? ctx.checkboxesWidgetOptions(node.options.inline ?? false)
        : {}
    );
    const itemsOptions = buildEnumNames(node.valueType, node.items);
    if (Object.keys(itemsOptions).length > 0) {
      schema.items = { "ui:options": itemsOptions };
    }
    return schema;
  },
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
    const entries = Object.entries(schema).filter(
      ([_, v]) => v !== undefined && Object.keys(v as {}).length > 0
    );
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  return schema;
}
