# Schema introspection — interface draft

**Status:** discussion draft. The name and vocabulary are provisional. The
specification is expressed only as a TypeScript file, like other portable
schema protocols.

## Rationale

- **Why not convert to JSON Schema.** Conversion cannot represent every node
  type of every schema library, and converted nodes cannot be mapped back to
  the original schema, e.g. to validate a single field.
- **Adoption.** The protocol lives on a sibling key, not inside a schema
  object. Until schema libraries implement it, `schema -> introspectable`
  factories provide it; a factory may capture a validator to resolve
  value-dependent structure.
- **Vocabulary.** Kinds, relations and annotations below are examples; the
  interface comes first and the common vocabulary is defined separately.

```ts
/**
 * Expose a schema one node at a time. Each node reports a local kind and
 * direct relationship edges; an edge exposes its child node on demand. A
 * library or adapter declares the protocol on the schemas it can describe;
 * the `vendor` field identifies it and its vocabulary.
 *
 * Unprefixed kind, relation and annotation names are reserved for the
 * common vocabulary; others take the form `namespace:name`. Consumers treat
 * a kind they do not recognize as `unknown`, and a relation they do not
 * recognize as absent, i.e. its coverage as unknown.
 */

export interface AbstractRelation<T extends string> {
  /** Identifies this relationship; its other fields are relation-specific. */
  readonly relation: T;
}

/** An explicitly non-narrowed relation shape. */
export type AnyRelation = AbstractRelation<string>;

/**
 * Example kinds; an implementation defines its own. Exactly one kind per
 * node; `unknown` is always available and means no single kind can be
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
 *
 * A node is either structural (a concrete kind with structural edges) or a
 * combinator (kind `unknown` with combinator or conditional edges). Local
 * structure combined with combinators is an `all-of` node whose children
 * are the structural node and the combinators.
 */
export type CommonRelation =
  // Structural relations.
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
      /** Applies its child to positions no `item` edge covers. */
      readonly relation: "items";
    }
  // Combinator relations.
  | {
      /** Exactly one child matches. An enum is `one-of` over `const` nodes. */
      readonly relation: "one-of";
    }
  | {
      /** One or more children match. */
      readonly relation: "any-of";
    }
  | {
      /** Every child applies; children are not merged. */
      readonly relation: "all-of";
    }
  // Conditional relations. A conditional node has exactly one edge of each;
  // a branch the schema omits is a child of kind `any`. Several conditions
  // are an `all-of` node over conditional nodes. Property dependencies,
  // e.g. `dependentSchemas` and `dependentRequired`, are conditional nodes
  // whose `if` child requires the dependency property.
  | {
      /** The condition; `then` applies when it matches, `else` otherwise. */
      readonly relation: "if";
    }
  | {
      readonly relation: "then";
    }
  | {
      readonly relation: "else";
    };

/** Shared annotations; implementations may extend this shape. */
export interface CommonAnnotations {
  readonly title?: string;
  readonly description?: string;
  /** A suggested static value; introspection never applies it. */
  readonly default?: unknown;
  /**
   * The only accepted value, present when the key is, so `undefined` is a
   * valid constant. The node keeps the kind of the value, e.g. `string`.
   */
  readonly const?: unknown;
}

/**
 * Annotations per kind, e.g. `{ string: StringAnnotations; ... }`. Kinds are
 * the map's keys; checking `node.kind` narrows `node.annotations`. Kinds
 * missing from the map, including `unknown`, use `CommonAnnotations`.
 */
export type AnnotationMap<A> = {
  readonly [K in keyof A]: CommonAnnotations;
};

/** An example annotation map over the example kinds. */
export type CommonAnnotationMap = {
  readonly [K in Exclude<CommonKind, "unknown">]: CommonAnnotations;
};

/** The kinds of an annotation map, plus the always available `unknown`. */
export type NodeKind<A> = Extract<keyof A, string> | "unknown";

/** The annotations of nodes of kind `K`. */
export type NodeAnnotations<A, K extends string> = K extends keyof A
  ? A[K]
  : CommonAnnotations;

export interface SchemaIntrospectionV1<
  Annotations extends AnnotationMap<Annotations>,
  Relation extends AnyRelation,
> {
  readonly "~introspection": SchemaIntrospectionV1.Props<Annotations, Relation>;
}

export type IntrospectionDirection = "input" | "output";

export interface IntrospectionContext {
  /** Value for the schema node, not a validation input. */
  readonly value?: unknown;
}

export interface IntrospectionOptions {
  /** Defaults to `input`. */
  readonly direction?: IntrospectionDirection;
  /**
   * Resolves value-dependent structure. With a value, an implementation may
   * narrow combinator and conditional edges to those that apply to it,
   * e.g. by scoring `one-of` and `any-of` children against the value, or
   * by reporting only the conditional branch that applies. Without one, it
   * reports every edge.
   */
  readonly context?: IntrospectionContext;
}

export declare namespace SchemaIntrospectionV1 {
  export interface Props<
    Annotations extends AnnotationMap<Annotations>,
    Relation extends AnyRelation,
  > {
    readonly version: 1;
    /** The library or adapter that declares the protocol. */
    readonly vendor: string;
    /**
     * Describes the root node for the requested direction; a view that
     * cannot be described is a node of kind `unknown`. Resolves references
     * on the implementation's side; does not recurse or validate.
     */
    readonly introspect: (
      options?: IntrospectionOptions
    ) => SchemaNode<Annotations, Relation>;
  }
}

/** A node of one kind. */
export interface KindNode<
  Annotations extends AnnotationMap<Annotations>,
  Relation extends AnyRelation,
  Kind extends NodeKind<Annotations>,
> {
  /** Exactly one kind; `unknown` means no single kind can be asserted. */
  readonly kind: Kind;
  /** Descriptive, constraining, or implementation-specific information. */
  readonly annotations?: Readonly<NodeAnnotations<Annotations, Kind>>;
  /**
   * Direct child edges, in stable order. Coverage is exhaustive per
   * relation that applies to the node, so an absent relation is unknown,
   * not zero edges. Unconstrained categories report a child of kind `any`,
   * e.g. implicitly allowed additional properties; rejected categories,
   * kind `never`.
   */
  readonly edges?: readonly SchemaEdge<Annotations, Relation>[];
}

/** A node of any kind of the annotation map, discriminated by `kind`. */
export type SchemaNode<
  Annotations extends AnnotationMap<Annotations>,
  Relation extends AnyRelation,
> = {
  readonly [Kind in NodeKind<Annotations>]: KindNode<
    Annotations,
    Relation,
    Kind
  >;
}[NodeKind<Annotations>];

/**
 * A relation plus the child node it lazily exposes. Following edges from
 * the root maps a validation issue path back to nodes: `property` adds its
 * name, `item` its index, `items` the index of the value; combinator and
 * conditional edges add no segment.
 */
export type SchemaEdge<
  Annotations extends AnnotationMap<Annotations>,
  Relation extends AnyRelation,
> = Relation & {
  /**
   * Returns the child node for the same direction; `context.value` is the
   * child-local value. Calls without a context for the same effective
   * target return the same node object, preserving cycles.
   */
  readonly node: (
    context?: IntrospectionContext
  ) => SchemaNode<Annotations, Relation>;
};

/** Non-narrowed variants for consumers that skip static narrowing. */
export type AnyAnnotationMap = { readonly [kind: string]: CommonAnnotations };
export type AnySchemaIntrospectionV1 = SchemaIntrospectionV1<
  AnyAnnotationMap,
  AnyRelation
>;
export type AnySchemaIntrospectionProps = SchemaIntrospectionV1.Props<
  AnyAnnotationMap,
  AnyRelation
>;
export type AnySchemaNode = SchemaNode<AnyAnnotationMap, AnyRelation>;
```
