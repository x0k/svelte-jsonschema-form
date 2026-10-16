# Schema introspection — interface draft

**Status:** discussion draft. The name and vocabulary are provisional. The
specification is expressed only as a TypeScript file, like other portable
schema protocols.

```ts
/**
 * Expose a schema one node at a time. Each node reports a local kind and
 * direct relationship edges; an edge exposes its child node on demand. A
 * library or adapter declares the protocol on the schemas it can describe;
 * the `vendor` field identifies it and its vocabulary.
 */

export interface AbstractRelation<T extends string> {
  /** Identifies this relationship; its other fields are relation-specific. */
  readonly relation: T;
}

/** An explicitly non-narrowed relation shape. */
export type AnyRelation = AbstractRelation<string>;

/**
 * Common kinds; an implementation can also define namespaced kinds. Exactly
 * one kind per node; `unknown` means no single portable kind can be
 * asserted, not that every value is accepted. `any` accepts every value,
 * `never` accepts none, and `integer` is a refinement of `number`.
 */
export type CommonKind =
  | "unknown"
  | "any"
  | "never"
  | "object"
  | "array"
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "null";

/**
 * Common relation registry entries. Implementations report any subset,
 * possibly combined with their own namespaced relations.
 */
export type CommonRelation =
  | {
      /** A named property. */
      readonly relation: "property";
      readonly name: string;
      readonly required: boolean;
    }
  | {
      /** Applies its child to property values whose names match `pattern`. */
      readonly relation: "pattern-property";
      readonly pattern: string;
      readonly flags?: string;
    }
  | {
      /** Applies its child to names neither `property` nor `pattern-property` matches. */
      readonly relation: "additional-property";
    }
  | {
      /** Applies its child to property names as strings. */
      readonly relation: "property-name";
    }
  | {
      /** A tuple position. */
      readonly relation: "item";
      readonly index: number;
    }
  | {
      /** The schema for every item position. */
      readonly relation: "items";
    }
  | {
      /** Items after fixed tuple positions. */
      readonly relation: "rest-item";
    }
  | {
      /** Exactly one child matches. */
      readonly relation: "one-of";
    }
  | {
      /** One or more children match. */
      readonly relation: "any-of";
    }
  | {
      /** Every child applies. */
      readonly relation: "all-of";
    };

/** Shared annotations; implementations may extend this shape. */
export interface CommonAnnotations {
  readonly title?: string;
  readonly description?: string;
  /** A suggested static value; introspection never applies it. */
  readonly default?: unknown;
}

export interface SchemaIntrospectionV1<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> {
  readonly "~introspection": SchemaIntrospectionV1.Props<
    Kind,
    Relation,
    NodeAnnotations
  >;
}

export type IntrospectionDirection = "input" | "output";

export interface IntrospectionContext {
  /** Value for the schema node, not a validation input. */
  readonly value?: unknown;
}

export interface IntrospectionOptions {
  /** Defaults to `input`. */
  readonly direction?: IntrospectionDirection;
  /** Resolves value-dependent structure, such as conditional branches; a
   * static view reports only value-independent facts. */
  readonly context?: IntrospectionContext;
}

export declare namespace SchemaIntrospectionV1 {
  export interface Props<
    Kind extends string,
    Relation extends AnyRelation,
    NodeAnnotations extends CommonAnnotations,
  > {
    readonly version: 1;
    /** The library or adapter that declares the protocol. */
    readonly vendor: string;
    /**
     * Describes the root node for the requested direction, or returns
     * `undefined` when that view cannot be described. Resolves references
     * on the implementation's side; does not recurse or validate.
     */
    readonly introspect: (
      options?: IntrospectionOptions
    ) => SchemaNode<Kind, Relation, NodeAnnotations> | undefined;
  }
}

export interface SchemaNode<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> {
  /** Exactly one kind; `unknown` means no portable kind can be asserted. */
  readonly kind: Kind | "unknown";
  /** Descriptive or implementation-specific node-local information. */
  readonly annotations?: Readonly<NodeAnnotations>;
  /**
   * Direct child edges, in stable order. Coverage is exhaustive per
   * relation, so an absent relation is unknown, not zero edges.
   * Unconstrained categories report a child of kind `any`; rejected
   * categories, kind `never`.
   */
  readonly edges?: readonly SchemaEdge<Kind, Relation, NodeAnnotations>[];
}

/** A relation plus the child node it lazily exposes. */
export type SchemaEdge<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> = Relation & {
  /**
   * Returns the child node for the same direction. `context.value` is the
   * child-local value; calls for the same effective target and context
   * return the same node object, preserving cycles.
   */
  readonly node: (
    context?: IntrospectionContext
  ) => SchemaNode<Kind, Relation, NodeAnnotations>;
};

/** Non-narrowed variants for consumers that skip static narrowing. */
export type AnySchemaIntrospectionV1 = SchemaIntrospectionV1<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnySchemaIntrospectionProps = SchemaIntrospectionV1.Props<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnySchemaNode = SchemaNode<string, AnyRelation, CommonAnnotations>;
```
