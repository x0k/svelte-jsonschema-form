# Standard Schema Introspection — interface draft

**Status:** discussion draft. The name and vocabulary are provisional.

## Design target

Expose a schema one node at a time. Each node reports local traits and direct
relationships; an edge provides a function to inspect its child on demand. Do
not translate the structure to a canonical schema language or require a
consumer to understand a particular library's object layout.

This keeps the protocol complementary to [Standard Schema](https://standardschema.dev/schema)
(validation) and [Standard JSON Schema](https://standardschema.dev/json-schema)
(conversion).

## Proposed interface

```ts
export interface AbstractRelation<T extends string> {
  /** Identifies this relationship; its other fields are relation-specific. */
  readonly relation: T;
}

/** An explicitly non-narrowed relation shape. */
export type AnyRelation = AbstractRelation<string>;

/** Optional shared relation shapes; implementations can report any subset. */
export type CommonRelation =
  | {
      readonly relation: "property";
      readonly name: string;
      readonly required?: boolean;
    }
  | { readonly relation: "item"; readonly index?: number }
  | { readonly relation: "alternative"; readonly index?: number }
  | { readonly relation: "member"; readonly index?: number };

/** Shared descriptive annotations; implementations may extend this shape. */
export interface CommonAnnotations {
  readonly title?: string;
  readonly description?: string;
  /** Suggested value for consumers; introspection does not apply it. */
  readonly default?: unknown;
}

export interface StandardSchemaIntrospectionV1<
  Trait extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> {
  readonly "~standard": StandardSchemaIntrospectionV1.Props<
    Trait,
    Relation,
    NodeAnnotations
  >;
}

export type IntrospectionDirection = "input" | "output";

export interface IntrospectionOptions {
  /** Defaults to `input`. */
  readonly direction?: IntrospectionDirection;
}

export declare namespace StandardSchemaIntrospectionV1 {
  export interface Props<
    Trait extends string,
    Relation extends AnyRelation,
    NodeAnnotations extends CommonAnnotations,
  > {
    readonly version: 1;
    readonly vendor: string;
    /** Describes the root node for the requested value direction. */
    readonly introspect: (
      options?: IntrospectionOptions
    ) => SchemaNode<Trait, Relation, NodeAnnotations> | undefined;
  }
}

// Protocols share the same `~standard` object by combining their Props.
export interface CombinedProps<
  Trait extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
>
  extends
    StandardSchemaV1.Props,
    StandardSchemaIntrospectionV1.Props<Trait, Relation, NodeAnnotations> {}

export interface SchemaNode<
  Trait extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> {
  /** Traits this implementation can report; this may be empty. */
  readonly traits: readonly Trait[];
  /** Descriptive or implementation-specific node-local information. */
  readonly annotations?: Readonly<NodeAnnotations>;
  /** Direct child edges; each edge can describe its child on demand. */
  readonly edges?: readonly SchemaEdge<Trait, Relation, NodeAnnotations>[];
}

/**
 * Relation-specific edge data is defined by each member of the `Relation` union.
 */
export type SchemaEdge<
  Trait extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> = Readonly<Relation> & {
  /** Lazily describes the child in the parent's introspection direction. */
  readonly node: () => SchemaNode<Trait, Relation, NodeAnnotations>;
};

/**
 * Explicitly opts into portable, non-narrowed vocabularies. Implementations
 * should use the generic forms above to preserve their own vocabularies.
 */
export type AnyStandardSchemaIntrospectionV1 = StandardSchemaIntrospectionV1<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnyStandardSchemaIntrospectionProps = StandardSchemaIntrospectionV1.Props<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnyCombinedProps = CombinedProps<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnySchemaNode = SchemaNode<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnySchemaEdge = SchemaEdge<
  string,
  AnyRelation,
  CommonAnnotations
>;
```

An implementation can narrow the type-level vocabularies to the values it
reports. Each relation is a typed object, so its edge-local data narrows with
its `relation` discriminator:

```ts
type MyTraits = "object" | "string" | "example:coerced";
type MyRelations =
  | CommonRelation
  | {
      readonly relation: "example:unwrap";
      readonly kind: "optional" | "nullable";
    };
type MyAnnotations = CommonAnnotations & {
  readonly "example:source": string;
  readonly "example:minLength"?: number;
};
type MySchema = StandardSchemaIntrospectionV1<
  MyTraits,
  MyRelations,
  MyAnnotations
>;
```

An implementation's protocol type lists only values it can report and supplies
all three generic arguments, so it does not silently erase that vocabulary.
`NodeAnnotations` narrows node-local annotation data; relation-specific edge
facts are part of the `Relation` union. All three generics affect TypeScript
only. An implementation can use all of `CommonRelation`, select only the cases
it supports with `Extract`, or combine those cases with its own relation types.
Custom annotation keys should be namespaced. A consumer that intentionally
does not need static narrowing can use an `Any*` alias.

Implementations may report only a subset of the common names, or return no
traits or edges for a node. A list allows a schema to have multiple reported
traits without inventing combined tags such as `"nullable-object"`.

## Optional common vocabulary

For cross-library consumers, this draft recommends a small set of names, but
does not require an implementation to report any of them:

- Traits: `object`, `array`, `string`, `number`, `integer`, `boolean`, `null`.
- Relations: `property`, `item`, `alternative`, `member`.

`property` uses `name` for its name and `required` when known. `item` may use a
numeric `index` for a tuple position. `alternative` may use `index` for a
choice branch; `member` may use it for a conjunct in a composition, where all
members participate. An omitted index means the source does not expose a stable
position. `integer` is a refinement of `number`.
Implementations may report a more specific namespaced relation when these
conventions lose source semantics.

## Local contract

- Each successful root `introspect()` call defines one introspection view.
  `introspect()` describes its root node and direct edges; it does not validate
  data, mutate the schema, or recursively inspect child schemas.
- `direction` selects whether the view describes values accepted as input or
  values produced as output. It defaults to `input`; an implementation returns
  `undefined` when it cannot describe the requested root view.
- `annotations.default`, when present, is a static suggested value associated
  with this schema node, not a description of the source parser's fallback
  behavior. Introspection does not apply it, and consumers choose whether or
  how to use it (for example, as initial form data). An adapter should not
  execute a default factory to produce this annotation.
- Each edge's `node()` returns a child node for the same direction selected on
  the root `introspect()` call. The function retains that view's schema and
  reference-resolution context.
- Implementations apply the source schema's semantics and resolve references
  available in their schema context. Within one view, calls to `node()` for
  the same effective resolved target return the same node object, so recursive
  references form cycles. A later root `introspect()` call may create a new
  view with different node identities. Consumers do not need to understand
  `$ref` or another library's reference mechanism.
- If an implementation uses one of the common relations, it follows the
  conventions above. Implementations are not required to report those
  relations.
- Edges expose child-node functions, not source schema objects. Implementations
  should memoize nodes within a view so repeated and recursive references
  preserve identity. Consumers can avoid infinite traversal by tracking node
  identity.
- If a root schema cannot itself carry `~standard`, an adapter may expose the
  protocol for it. `introspect()` returns its root node, and the adapter can
  keep child nodes lazy. This lets plain JSON Schema use the protocol without
  adding functions to the JSON document.
- If an edge's child cannot be resolved from the implementation's available
  context, `node()` should return an opaque leaf rather than throw solely
  because the target is unavailable. The leaf can carry source-specific
  information in namespaced traits or annotations. A malformed source schema
  may still be reported as an implementation error. Introspection does not
  fetch remote references as a side effect.
- Implementations should namespace custom trait, relation, and annotation
  names. Consumers ignore values they do not recognize.

## Example: cycle-safe traversal

```ts
function walk(node: AnySchemaNode, seen = new WeakSet<object>()): void {
  if (seen.has(node)) return;
  seen.add(node);

  for (const edge of node.edges ?? []) {
    if (
      edge.relation === "property" &&
      "name" in edge &&
      typeof edge.name === "string"
    ) {
      // This relation reports a property named edge.name.
    }
    walk(edge.node(), seen);
  }
}

const root = schema["~standard"].introspect({ direction: "input" });
if (root) walk(root);
```

`introspect()` returns one local node for the requested direction, not a
pre-built graph. Consumers choose which child nodes to inspect by calling
`edge.node()`; implementations do not expose source schema objects. A node's
generic `annotations` object can hold local facts such as a source-specific
minimum length without changing the shared node shape.

The same consumer can continue through Zod, Valibot, or JSON Schema child
schemas without knowing how each library stores its object shape. A library
can expose other local facts in `annotations`; it does not need to translate
its entire schema into a second AST.

## Intentionally deferred

- A standard catalog for every constraint or additional annotation key. Common
  annotation keys can be added once several implementations agree on semantics.
- A complete output description for arbitrary transforms. Implementations
  expose an output view only when they can describe it structurally.
- Runtime branch selection for unions and conditional schemas.
- Executable default factories and fallback behavior, whose trigger and
  input/output timing differ between schema libraries.
- A serialized graph format, stable IDs, or remote reference loading.
- Presentation concepts such as widgets, layout, and labels beyond portable
  annotations.

These are open because they are easy ways to make the protocol resemble one
existing schema language or one consumer's needs. The first design test is
whether the `traits` + `edges` graph is enough to map JSON Schema, Zod, and
Valibot while preserving their structure without exposing source objects.

## Decisions for this draft

- Keep `introspect()` on the schema's `~standard` object. Adapters wrap sources
  such as raw JSON Schema that cannot carry the method and return a node with
  lazy child-node functions.
- Resolve references within the implementation's available context. Preserve
  repeated and recursive targets as shared node objects; represent an
  unavailable child as an opaque leaf; do not fetch remote references as a
  side effect.
- Keep trait and relation names open strings. The common vocabulary above is
  optional guidance, not a required capability set.
- Require a declared implementation to supply its trait, relation, and
  annotation vocabularies. An `Any*` alias explicitly opts a consumer into the
  portable, non-narrowed view.
- Support input and output introspection views; output may be unavailable when
  a transformation has no structural description.
- Standardize `title`, `description`, and a static suggested `default` as
  common annotation keys. This does not standardize parser default or fallback
  behavior. Implementations may add namespaced annotation keys for source-
  specific metadata, including `format`; default factories and fallback
  behavior remain non-standard.
- Keep annotations extensible for source-specific information; standardize
  additional common annotation keys later when multiple implementations share
  their meaning.

## Repository motivation

The form package currently traverses a JSON Schema-shaped tree and the Zod and
Valibot integrations convert to Draft 7 before form generation. This proposal
would let a future adapter inspect each source schema locally, while leaving
the form's mapping from reported traits and edges to fields as a consumer choice.
