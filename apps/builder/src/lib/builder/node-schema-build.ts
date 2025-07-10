import type { Schema } from "@sjsf/form";

import {
  NodeType,
  type AbstractNode,
  type Node,
  type NodeId,
  type ObjectPropertyDependencyNode,
} from "./node.js";
import { isCustomizableNode } from "./node-guards.js";

export type Uniquifier = (str: string) => string;

export interface SchemaBuilderRegistries {
  parent: Node;
  uniquifier: Uniquifier;
}

function handleChildren<R>(
  ctx: SchemaBuilderContext,
  self: Node,
  build: () => R
) {
  using _parent = ctx.push("parent", self);
  return build();
}

export interface SchemaBuilderContext {
  push<K extends keyof SchemaBuilderRegistries>(
    registry: K,
    value: SchemaBuilderRegistries[K]
  ): Disposable;
  peek<K extends keyof SchemaBuilderRegistries>(
    registry: K
  ): SchemaBuilderRegistries[K] | undefined;
}

function createUniquifier() {
  const counter = new Map<string, number>();
  return (str: string) => {
    let count = counter.get(str);
    if (count === undefined) {
      counter.set(str, 1);
      return str;
    }
    counter.set(str, ++count);
    return `${str}_${count}`;
  };
}

interface BuildDependenciesOptions {
  triggerPropertyName: string;
  dependencies: ObjectPropertyDependencyNode[];
  complementId: NodeId | undefined;
}

function buildPropertyDependencies(
  ctx: SchemaBuilderContext,
  { complementId, dependencies, triggerPropertyName }: BuildDependenciesOptions
) {
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
}

const NODE_SCHEMA_BUILDERS: {
  [T in NodeType]: (
    ctx: SchemaBuilderContext,
    node: Extract<Node, AbstractNode<T>>
  ) => Schema;
} = {
  [NodeType.Object]: (ctx, node) => {
    const unique = createUniquifier();
    using _unique = ctx.push("uniquifier", createUniquifier());
    const properties = handleChildren(ctx, node, () =>
      node.properties.map((p) => {
        if (!isCustomizableNode(p.property)) {
          throw new Error();
        }
        const name = unique(p.property.options.title);
        return {
          name,
          schema: buildSchema(ctx, p.property),
          dependencies: [],
        };
      })
    );
    return {
      type: "object",
      properties: {},
    };
  },
  [NodeType.ObjectProperty]: () => {
    throw new Error("Unexpected node");
  },
  [NodeType.ObjectPropertyDependency]: (ctx, node) => {
    return {};
  },
  [NodeType.Predicate]: (ctx, node) => {
    return {};
  },
  [NodeType.Operator]: (ctx, node) => {
    return {};
  },
  [NodeType.Array]: (ctx, node) => {
    return {};
  },
  [NodeType.Grid]: (ctx, node) => {
    const unique = createUniquifier();
    using _unique = ctx.push("uniquifier", unique);
    return {};
  },
  [NodeType.Enum]: (ctx, node) => {
    return {};
  },
  [NodeType.MultiEnum]: (ctx, node) => {
    return {};
  },
  [NodeType.EnumItem]: (ctx, node) => {
    return {};
  },
  [NodeType.String]: (ctx, node) => {
    return {};
  },
  [NodeType.Number]: (ctx, node) => {
    return {};
  },
  [NodeType.Boolean]: (ctx, node) => {
    return {};
  },
  [NodeType.File]: (ctx, node) => {
    return {};
  },
  [NodeType.Tags]: (ctx, node) => {
    return {};
  },
};

export function buildSchema(ctx: SchemaBuilderContext, node: Node): Schema {
  return NODE_SCHEMA_BUILDERS[node.type](ctx, node as never);
}
