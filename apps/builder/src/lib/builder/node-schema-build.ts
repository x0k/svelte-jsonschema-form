import { identity } from "@sjsf/form/lib/function";
import { mergeSchemas } from "@sjsf/form/core";
import type { Schema } from "@sjsf/form";

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
import { isCustomizableNode } from "./node-guards.js";

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

function assetThing<T>(thing: T | undefined, name: string): asserts thing is T {
  if (thing === undefined) {
    throw new Error(`${name} is undefined`);
  }
}

export interface SchemaBuilderRegistries {
  scope: Scope;
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
    assetThing(d.predicate, "predicate");
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
  assetThing(scope, "scope");
  const properties = new Map<string, Schema>();
  const dependencies = new Map<string, Schema>();
  const required: string[] = [];
  for (let i = 0; i < node.properties.length; i++) {
    const p = node.properties[i];
    if (!isCustomizableNode(p.property)) {
      throw new Error();
    }
    const name = scope.id(p.property.options.title);
    properties.set(name, buildSchema(ctx, p.property));
    ctx.propertyNames.set(p.property.id, name);
    if (p.property.options.required) {
      required.push(name);
    }
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
    assetThing(op.operand, "not operand");
    return { not: buildOperator(ctx, op.operand) };
  },
  // Shared
  [OperatorType.Eq]: (ctx, op) => ({ const: JSON.parse(op.value) }),
  [OperatorType.In]: (ctx, op) => ({
    enum: op.values.map((v) => JSON.parse(v)),
  }),
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
  [OperatorType.Contains]: (ctx, op) => {
    assetThing(op.operand, "contains operant");
    return { contains: buildOperator(ctx, op.operand) };
  },
  [OperatorType.MinItems]: (ctx, op) => ({ minItems: op.value }),
  [OperatorType.MaxItems]: (ctx, op) => ({ maxItems: op.value }),
  [OperatorType.UniqueItems]: (ctx, op) => ({ uniqueItems: true }),
  // Object
  [OperatorType.HasProperty]: (ctx, op) => {
    assetThing(op.propertyId, "property id in hasProperty operator");
    const name = ctx.propertyNames.get(op.propertyId);
    assetThing(name, "property name in hasProperty operator");
    return { required: [name] };
  },
  [OperatorType.Property]: (ctx, op) => {
    assetThing(op.propertyId, "property id in property operator");
    const name = ctx.propertyNames.get(op.propertyId);
    assetThing(name, "property name in property operator");
    assetThing(op.operator, "nested operator in property operator");
    return {
      properties: {
        [name]: buildOperator(ctx, op.operator),
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
    assetThing(node.operator, "operator");
    return buildSchema(ctx, node.operator);
  },
  [NodeType.Operator]: buildOperator,
  [NodeType.Array]: (ctx, node) => {
    const {
      item,
      options: { required, ...rest },
    } = node;
    assetThing(item, "array item");
    return {
      type: "array",
      items: buildSchema(ctx, item),
      ...rest,
    };
  },
  [NodeType.Grid]: (ctx, node) => {
    const scope = createScope();
    using _scope = ctx.push("scope", scope);
    const properties = new Map<string, Schema>();
    const required: string[] = [];
    for (let i = 0; i < node.cells.length; i++) {
      const p = node.cells[i].node;
      if (!isCustomizableNode(p)) {
        throw new Error();
      }
      const name = scope.id(p.options.title);
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
    return obj;
  },
  [NodeType.Enum]: (
    _,
    {
      items,
      valueType,
      options: { defaultValue, required, widget, help, ...rest },
    }
  ) => {
    return {
      ...rest,
      oneOf: buildEnumItems(valueType, items),
      default: defaultValue && JSON.parse(defaultValue),
    };
  },
  [NodeType.MultiEnum]: (
    ctx,
    {
      items,
      options: { required, widget, defaultValue, help, ...rest },
      valueType,
    }
  ) => {
    return {
      ...rest,
      type: "array",
      uniqueItems: true,
      items: {
        oneOf: buildEnumItems(valueType, items),
      },
      default: defaultValue?.map((v) => JSON.parse(v)),
    };
  },
  [NodeType.EnumItem]: () => {
    throw new Error(`Unexpected enum item node`);
  },
  [NodeType.String]: (
    _,
    { options: { widget, required, defaultValue, help, ...rest } }
  ) => {
    return {
      type: "string",
      ...rest,
      default: defaultValue,
    };
  },
  [NodeType.Number]: (
    ctx,
    { options: { widget, required, defaultValue, integer, help, ...rest } }
  ) => {
    return {
      type: integer ? "integer" : "number",
      ...rest,
      default: defaultValue,
    };
  },
  [NodeType.Boolean]: (
    ctx,
    { options: { widget, required, defaultValue, help, ...rest } }
  ) => {
    return {
      type: "boolean",
      ...rest,
      default: defaultValue,
    };
  },
  [NodeType.File]: (
    _,
    {
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
  [NodeType.Tags]: (
    _,
    { options: { required, widget, defaultValue, help, ...rest } }
  ) => {
    return {
      type: "array",
      ...rest,
      uniqueItems: true,
      items: {
        type: "string",
      },
      default: defaultValue,
    };
  },
};

export function buildSchema(ctx: SchemaBuilderContext, node: Node): Schema {
  return NODE_SCHEMA_BUILDERS[node.type](ctx, node as never);
}
