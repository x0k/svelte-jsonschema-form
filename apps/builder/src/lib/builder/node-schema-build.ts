import { identity } from "@sjsf/form/lib/function";
import { mergeSchemas } from "@sjsf/form/core";
import type { Schema } from "@sjsf/form";

import { assertThing } from "$lib/assert.js";

import {
  NodeType,
  type AbstractNode,
  type EnumItemNode,
  type Node,
  type NodeId,
  type ObjectNode,
  type ObjectPropertyDependencyNode,
  type ObjectPropertyNode,
  type OperatorNode,
} from "./node.js";
import { EnumValueType } from "./enum.js";
import { OperatorType, type AbstractOperator } from "./operator.js";
import {
  isCustomizableNode,
  isFileNode,
  isGridNode,
  isMultiEnumNode,
  isObjectNode,
} from "./node-guards.js";

export interface Scope {
  id: (str: string) => string;
}

function createScope(): Scope {
  const counter = new Map<string, number>();
  return {
    id(str: string) {
      let count = counter.get(str);
      if (count === undefined) {
        counter.set(str, 1);
        return str;
      }
      counter.set(str, ++count);
      return `${str}_${count}`;
    },
  };
}

export interface SchemaBuilderRegistries {
  scope: Scope;
  affectedNode: Node;
}

export interface SchemaBuilderContext {
  propertyNames: Map<NodeId, string>;
  push<K extends keyof SchemaBuilderRegistries>(
    registry: K,
    value: SchemaBuilderRegistries[K]
  ): Disposable;
  peek<K extends keyof SchemaBuilderRegistries>(
    registry: K
  ): SchemaBuilderRegistries[K] | undefined;
}

// TODO: Should we merge inner dependencies into root?
function buildPropertyDependencies(
  ctx: SchemaBuilderContext,
  triggerPropertyName: string,
  { complementary: complementId, dependencies }: ObjectPropertyNode
): Schema | undefined {
  if (dependencies.length === 0) {
    return undefined;
  }
  if (dependencies.length === 1) {
    if (dependencies[0].id !== complementId) {
      throw new Error(`Invalid node dependencies`);
    }
    return buildSchema(ctx, dependencies[0]);
  }
  let complementIndex = -1;
  const predicates: Schema[] = [];
  const oneOf = dependencies.map((d, i): Schema => {
    if (d.id === complementId) {
      complementIndex = i;
      return buildSchema(ctx, d);
    }
    assertThing(d.predicate, "predicate");
    const predicate = buildSchema(ctx, d.predicate);
    predicates.push(predicate);
    return mergeSchemas(
      {
        properties: {
          [triggerPropertyName]: predicate,
        },
      },
      buildSchema(ctx, d)
    );
  });
  if (complementIndex >= 0) {
    const complementSchema = oneOf[complementIndex];
    const props = (complementSchema.properties ??= {});
    props[triggerPropertyName] = {
      not:
        predicates.length === 1
          ? predicates[0]
          : {
              anyOf: predicates,
            },
    };
  }
  return { oneOf };
}

function buildObjectSchema(
  ctx: SchemaBuilderContext,
  node: ObjectNode | ObjectPropertyDependencyNode
): Schema {
  const scope = ctx.peek("scope");
  assertThing(scope, "scope");
  const properties = new Map<string, Schema>();
  const dependencies = new Map<string, Schema>();
  const required: string[] = [];
  for (let i = 0; i < node.properties.length; i++) {
    const p = node.properties[i];
    if (!isCustomizableNode(p.property)) {
      throw new Error();
    }
    const name = scope.id(p.property.options.title);
    ctx.propertyNames.set(p.property.id, name);
    properties.set(name, buildSchema(ctx, p.property));
    if (p.property.options.required) {
      required.push(name);
    }
    using _affected = ctx.push("affectedNode", p.property);
    const deps = buildPropertyDependencies(ctx, name, p);
    if (deps !== undefined) {
      dependencies.set(name, deps);
    }
  }
  const obj: Schema = {
    type: "object",
    properties: Object.fromEntries(properties),
  };
  if (required.length > 0) {
    obj.required = required;
  }
  if (dependencies.size > 0) {
    obj.dependencies = Object.fromEntries(dependencies);
  }
  return obj;
}

const OPERATOR_SCHEMA_BUILDERS: {
  [T in OperatorType]: (
    ctx: SchemaBuilderContext,
    operator: Extract<OperatorNode, AbstractOperator<T>>
  ) => Schema;
} = {
  [OperatorType.And]: (ctx, op) => ({
    allOf: op.operands.map((o) => buildOperator(ctx, o)),
  }),
  [OperatorType.Or]: (ctx, op) => ({
    anyOf: op.operands.map((o) => buildOperator(ctx, o)),
  }),
  [OperatorType.Xor]: (ctx, op) => ({
    oneOf: op.operands.map((o) => buildOperator(ctx, o)),
  }),
  [OperatorType.Not]: (ctx, op) => {
    assertThing(op.operand, "not operand");
    return { not: buildOperator(ctx, op.operand) };
  },
  // Shared
  [OperatorType.Eq]: (ctx, op) => {
    const affected = ctx.peek("affectedNode");
    assertThing(affected, "in affected node");
    const schema = { const: JSON.parse(op.value) };
    return isMultiEnumNode(affected) ||
      (isFileNode(affected) && affected.options.multiple)
      ? {
          items: schema,
          minItems: 1,
        }
      : schema;
  },
  [OperatorType.In]: (ctx, op) => {
    const affected = ctx.peek("affectedNode");
    assertThing(affected, "in affected node");
    const schema: Schema = {
      enum: op.values.map((v) => JSON.parse(v)),
    };
    return isMultiEnumNode(affected) ||
      (isFileNode(affected) && affected.options.multiple)
      ? {
          items: schema,
          minItems: 1,
        }
      : schema;
  },
  // String
  [OperatorType.Pattern]: (ctx, op) => ({ pattern: op.value }),
  [OperatorType.MinLength]: (ctx, op) => ({ minLength: op.value }),
  [OperatorType.MaxLength]: (ctx, op) => ({ maxLength: op.value }),
  // Number
  [OperatorType.Less]: (ctx, op) => ({ exclusiveMaximum: op.value }),
  [OperatorType.LessOrEq]: (ctx, op) => ({ maximum: op.value }),
  [OperatorType.Greater]: (ctx, op) => ({ exclusiveMinimum: op.value }),
  [OperatorType.GreaterOrEq]: (ctx, op) => ({ minimum: op.value }),
  [OperatorType.MultipleOf]: (ctx, op) => ({ multipleOf: op.value }),
  // Array
  [OperatorType.Contains]: (ctx, { operand }) => {
    assertThing(operand, "contains operant");
    const child = ctx.peek("affectedNode");
    assertThing(child, "contains affected node");
    using _affected = ctx.push("affectedNode", child);
    return { contains: buildOperator(ctx, operand) };
  },
  [OperatorType.MinItems]: (ctx, op) => ({ minItems: op.value }),
  [OperatorType.MaxItems]: (ctx, op) => ({ maxItems: op.value }),
  [OperatorType.UniqueItems]: (ctx, op) => ({ uniqueItems: true }),
  // Object
  [OperatorType.HasProperty]: (ctx, op) => {
    assertThing(op.propertyId, "property id in hasProperty operator");
    const name = ctx.propertyNames.get(op.propertyId);
    assertThing(name, "property name in hasProperty operator");
    return { required: [name] };
  },
  [OperatorType.Property]: (ctx, { propertyId, operator }) => {
    assertThing(propertyId, "property id");
    const name = ctx.propertyNames.get(propertyId);
    assertThing(name, "property name");
    assertThing(operator, "property operator");
    const affected = ctx.peek("affectedNode");
    assertThing(affected, "property affected node");
    let prop: Node | undefined;
    if (isObjectNode(affected)) {
      prop = affected.properties.find((p) => p.id === propertyId)?.property;
    } else if (isGridNode(affected)) {
      prop = affected.cells.find((c) => c.node.id === propertyId)?.node;
    }
    if (prop === undefined) {
      throw new Error(
        "The property operator can only be applied to group or grid field"
      );
    }
    using _affected = ctx.push("affectedNode", prop);
    return {
      properties: {
        [name]: buildOperator(ctx, operator),
      },
    };
  },
};

function buildOperator(ctx: SchemaBuilderContext, node: OperatorNode): Schema {
  return OPERATOR_SCHEMA_BUILDERS[node.op](ctx, node as never);
}

function buildEnumItems(type: EnumValueType, items: EnumItemNode[]) {
  const toConst = type === EnumValueType.JSON ? JSON.parse : identity;
  return items.map((item) => ({
    title: item.label,
    const: toConst(item.label),
  }));
}

const SCHEMA_OPTIONS_KEYS = [
  "title",
  "description",
  "minItems",
  "maxItems",
  "uniqueItems",
  "default",
  "minLength",
  "maxLength",
  "pattern",
  "minimum",
  "exclusiveMinimum",
  "maximum",
  "exclusiveMaximum",
  "multipleOf",
] as const satisfies (keyof Schema)[];

function assignSchemaOptions<
  T extends Pick<Schema, (typeof SCHEMA_OPTIONS_KEYS)[number]>,
>(target: Schema, source: T) {
  for (const key of SCHEMA_OPTIONS_KEYS) {
    const v = source[key];
    if (v !== undefined) {
      // @ts-expect-error
      target[key] = v;
    }
  }
  return target;
}

const NODE_SCHEMA_BUILDERS: {
  [T in NodeType]: (
    ctx: SchemaBuilderContext,
    node: Extract<Node, AbstractNode<T>>
  ) => Schema;
} = {
  [NodeType.Object]: (ctx, node) => {
    const scope = createScope();
    using _scope = ctx.push("scope", scope);
    return buildObjectSchema(ctx, node);
  },
  [NodeType.ObjectProperty]: () => {
    throw new Error("Unexpected object property node");
  },
  [NodeType.ObjectPropertyDependency]: buildObjectSchema,
  [NodeType.Predicate]: (ctx, node) => {
    assertThing(node.operator, "operator");
    return buildSchema(ctx, node.operator);
  },
  [NodeType.Operator]: buildOperator,
  [NodeType.Array]: (ctx, node) => {
    const {
      item,
      options: { required, ...rest },
    } = node;
    assertThing(item, "array item");
    return {
      type: "array",
      items: buildSchema(ctx, item),
      ...rest,
    };
  },
  [NodeType.Grid]: (ctx, { cells, options }) => {
    const scope = createScope();
    using _scope = ctx.push("scope", scope);
    const properties = new Map<string, Schema>();
    const required: string[] = [];
    for (let i = 0; i < cells.length; i++) {
      const p = cells[i].node;
      if (!isCustomizableNode(p)) {
        throw new Error();
      }
      const name = scope.id(p.options.title);
      ctx.propertyNames.set(p.id, name);
      properties.set(name, buildSchema(ctx, p));
      if (p.options.required) {
        required.push(name);
      }
    }
    const obj: Schema = {
      type: "object",
      properties: Object.fromEntries(properties),
    };
    if (required.length > 0) {
      obj.required = required;
    }
    return assignSchemaOptions(obj, options);
  },
  [NodeType.Enum]: (_, { items, valueType, options }) => {
    return assignSchemaOptions(
      {
        oneOf: buildEnumItems(valueType, items),
        default: options.defaultValue && JSON.parse(options.defaultValue),
      },
      options
    );
  },
  [NodeType.MultiEnum]: (_, { items, options, valueType }) => {
    return assignSchemaOptions(
      {
        type: "array",
        uniqueItems: true,
        items: {
          oneOf: buildEnumItems(valueType, items),
        },
        default: options.defaultValue?.map((v) => JSON.parse(v)),
      },
      options
    );
  },
  [NodeType.EnumItem]: () => {
    throw new Error(`Unexpected enum item node`);
  },
  [NodeType.String]: (_, { options }) => {
    return assignSchemaOptions(
      {
        type: "string",
      },
      options
    );
  },
  [NodeType.Number]: (_, { options }) => {
    return assignSchemaOptions(
      {
        type: options.integer ? "integer" : "number",
      },
      options
    );
  },
  [NodeType.Boolean]: (_, { options }) => {
    return assignSchemaOptions(
      {
        type: "boolean",
      },
      options
    );
  },
  [NodeType.File]: (
    _,
    {
      // TODO: Use `assignSchemaOptions` here after `omitExtraData` fix
      options: {
        widget,
        required,
        multiple,
        title,
        description,
        help,
        ...rest
      },
    }
  ) => {
    const file: Schema = {
      type: "string",
      format: "data-url",
    };
    return multiple
      ? Object.assign(
          {
            type: "array",
            title,
            description,
            items: file,
          } satisfies Schema,
          rest
        )
      : Object.assign(file, { title, description });
  },
  [NodeType.Tags]: (_, { options }) => {
    return assignSchemaOptions(
      {
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
        },
      },
      options
    );
  },
};

export function buildSchema(ctx: SchemaBuilderContext, node: Node): Schema {
  return NODE_SCHEMA_BUILDERS[node.type](ctx, node as never);
}
