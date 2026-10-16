# Standard Schema Introspection — interface draft

**Status:** discussion draft. The name and vocabulary are provisional.

## Design target

Expose a schema one node at a time. Each node reports a local kind and direct
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

/** Common kinds; an implementation can also define namespaced kinds. */
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

/** Version 1 relation registry entries; implementations can report any subset. */
export type CommonRelation =
  | {
      readonly relation: "property";
      readonly name: string;
      readonly required?: boolean;
    }
  | {
      readonly relation: "pattern-property";
      readonly pattern: string;
      readonly flags?: string;
    }
  | { readonly relation: "additional-property" }
  | { readonly relation: "property-name" }
  | { readonly relation: "item"; readonly index?: number }
  | { readonly relation: "rest-item" }
  | { readonly relation: "one-of"; readonly index?: number }
  | { readonly relation: "any-of"; readonly index?: number }
  | { readonly relation: "all-of"; readonly index?: number };

/** Shared descriptive annotations; implementations may extend this shape. */
export interface CommonAnnotations {
  readonly title?: string;
  readonly description?: string;
  /** Suggested value for consumers; introspection does not apply it. */
  readonly default?: unknown;
}

export interface StandardSchemaIntrospectionV1<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> {
  readonly "~standard": StandardSchemaIntrospectionV1.Props<
    Kind,
    Relation,
    NodeAnnotations
  >;
}

export type IntrospectionDirection = "input" | "output";

export interface IntrospectionContext {
  /** Value for the schema node being introspected; this is not validated. */
  readonly value?: unknown;
}

export interface IntrospectionOptions {
  /** Defaults to `input`. */
  readonly direction?: IntrospectionDirection;
  /** Context for schemas whose structure depends on the value being inspected. */
  readonly context?: IntrospectionContext;
}

export declare namespace StandardSchemaIntrospectionV1 {
  export interface Props<
    Kind extends string,
    Relation extends AnyRelation,
    NodeAnnotations extends CommonAnnotations,
  > {
    readonly version: 1;
    readonly vendor: string;
    /** Describes the root node for the requested value direction. */
    readonly introspect: (
      options?: IntrospectionOptions
    ) => SchemaNode<Kind, Relation, NodeAnnotations> | undefined;
  }
}

// Protocols share the same `~standard` object by combining their Props.
export interface CombinedProps<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
>
  extends
    StandardSchemaV1.Props,
    StandardSchemaIntrospectionV1.Props<Kind, Relation, NodeAnnotations> {}

export interface SchemaNode<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> {
  /** Exactly one kind; `unknown` means no single portable kind can be asserted. */
  readonly kind: Kind | "unknown";
  /** Descriptive or implementation-specific node-local information. */
  readonly annotations?: Readonly<NodeAnnotations>;
  /** Direct child edges, in stable order for this view. */
  readonly edges?: readonly SchemaEdge<Kind, Relation, NodeAnnotations>[];
}

/** A relation plus the child node it lazily exposes. */
export type SchemaEdge<
  Kind extends string,
  Relation extends AnyRelation,
  NodeAnnotations extends CommonAnnotations,
> = Relation & {
  /** Lazily describes the child; an optional context supplies its value. */
  readonly node: (
    context?: IntrospectionContext
  ) => SchemaNode<Kind, Relation, NodeAnnotations>;
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
export type AnyStandardSchemaIntrospectionProps =
  StandardSchemaIntrospectionV1.Props<string, AnyRelation, CommonAnnotations>;
export type AnyCombinedProps = CombinedProps<
  string,
  AnyRelation,
  CommonAnnotations
>;
export type AnySchemaNode = SchemaNode<string, AnyRelation, CommonAnnotations>;
```

An implementation can narrow the type-level vocabularies to the values it
reports. Every node has exactly one `kind`. Use `unknown` when no single
portable kind can be asserted; it does not mean that every value is accepted.
A schema with multiple possible value categories represents those alternatives
through composition edges. Each relation is a typed object, so its edge-local
data narrows with its `relation` discriminator:

```ts
type MyKinds = CommonKind | "example:coerced";
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
  MyKinds,
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
Custom kinds and annotation keys should be namespaced. A consumer that
intentionally does not need static narrowing can use an `Any*` alias.

Implementations may omit common relations they do not report. A composition
node can use kind `unknown` while its edges preserve the known structure.

## Version 1 vocabulary

The kind names and relation shapes below are portable registry entries. Every
node uses one kind; `unknown` is the fallback. Implementations may report any
subset of the other kinds and relations. Consumers can rely on a registry
entry's meaning when an edge reports it:

- Kinds: `unknown`, `any`, `never`, `object`, `array`, `string`, `number`,
  `integer`, `boolean`, `null`.
- Relations: `property`, `pattern-property`, `additional-property`,
  `property-name`, `item`, `rest-item`, `one-of`, `any-of`, `all-of`.

`unknown` is the required fallback when an implementation cannot report one
portable kind. `any` means the schema accepts every value in its value domain;
`never` means it accepts no values. `integer` is a refinement of `number`, so
consumers that handle `number` should also handle `integer`.

`property` uses `name` for its name and `required` when known.
`pattern-property` applies its child schema to property values whose names
match `pattern`, using ECMAScript regular-expression syntax and search
semantics; `flags` defaults to the empty string. When multiple patterns match,
all corresponding child schemas apply. An implementation that cannot preserve
those semantics should use a namespaced relation. `additional-property` applies
to values for names matched by neither `property` nor `pattern-property`.
`property-name` applies its child schema to property names as strings. `item`
may use a numeric `index` for a tuple position; without an index it describes a
homogeneous item schema. `rest-item` describes items after fixed tuple
positions. Composition relations use `index` for a branch or conjunct position
when the source provides one: `one-of` means exactly one child matches,
`any-of` means one or more children match, and `all-of` means every child
applies. An omitted index means the source does not expose a stable position.

`edges` lists the direct child edges of this node in the requested direction
and effective context. Each edge is a relation object plus the `node`
function that lazily describes its child, so an edge's `relation` field
selects the registry entry and its other fields narrow with it. Coverage is
exhaustive per relation: if the list contains an edge of a relation, it
contains every direct edge of that relation on this node. A relation with no
edges in the list is one the implementation does not support or cannot
enumerate, and consumers must not infer zero edges for it. An implementation
that knows some edges but cannot list them all may expose the known structure
through a namespaced relation instead. The claim is local: it says nothing
about other relations, whether the child nodes themselves are fully
described, or the schema's overall validation behavior. Edge order is stable
within a view; consumers use `index` where supplied for meaningful position.

Reporting an edge describes coverage, not what the source rejects. A closed
object, for example, is expressed by an `additional-property` edge whose
child node has kind `never`, while an unrestricted additional-property schema
has an `additional-property` edge whose child node has kind `any`.

Implementations may report a more specific namespaced relation when these
conventions lose source semantics.

## Local contract

- Each successful root `introspect()` call defines one introspection view.
  `introspect()` describes its root node and direct edges; it does not validate
  data, mutate the schema, or recursively inspect child schemas.
- `direction` selects whether the view describes values accepted as input or
  values produced as output. It defaults to `input`; an implementation returns
  `undefined` when it cannot describe the requested root view.
- Root `context.value`, when supplied, is a value in the selected direction.
  An implementation applies the source's value-dependent structural rules
  that it supports, such as conditional branches or dependent schemas. It is
  context for introspection, not validation input. Without it, the root view
  is not specialized to a particular instance.
- `annotations.default`, when present, is a static suggested value associated
  with this schema node, not a description of the source parser's fallback
  behavior. Introspection does not apply it, and consumers choose whether or
  how to use it (for example, as initial form data). An adapter should not
  execute a default factory to produce this annotation.
- Each edge's `node(context?)` returns a child node for the same direction.
  When supplied, `context.value` is the value for that child; the function
  retains the root context for rules that depend on parent or sibling values.
  When omitted, it uses an inherited child context when one can be derived.
  If no child context can be derived, the child view remains context-
  independent. A supplied child value overrides only the child-local value; a
  changed root value requires a new `introspect()` call if it can change parent
  edges. Callers can supply a child value when a relation applies to multiple
  values, such as an additional-property schema used by several keys.
- Implementations apply the source schema's semantics and resolve references
  available in their schema context. Within one root view, calls to `node()`
  for the same effective target and context return the same node object;
  different child values may return different node objects. This preserves
  cycles for recursive references. A later root `introspect()` call may create
  a new view with different node identities. Consumers do not need to
  understand `$ref` or another library's reference mechanism.
- If an implementation uses one of the common relations, it follows the
  conventions above. Implementations are not required to report those
  relations.
- Edge coverage is exhaustive per relation on a node in the current direction
  and context: if `edges` contains an edge of a relation, it contains every
  direct edge of that relation. Implementations omit a relation's edges when
  they cannot list all of them; consumers treat omission as unknown, not as
  an empty set.
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
  information in namespaced kinds or annotations. A malformed source schema
  may still be reported as an implementation error. Introspection does not
  fetch remote references as a side effect.
- Implementations should namespace custom kind, relation, and annotation
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
- Validation-time selection of matching `one-of` or `any-of` branches; the
  graph exposes all branches. A value context may resolve conditional and
  dependent structure when the implementation supports it.
- Executable default factories and fallback behavior, whose trigger and
  input/output timing differ between schema libraries.
- A serialized graph format, stable IDs, or remote reference loading.
- Presentation concepts such as widgets, layout, and labels beyond portable
  annotations.

These are open because they are easy ways to make the protocol resemble one
existing schema language or one consumer's needs. The first design test is
whether the `kind` + `edges` graph is enough to map JSON Schema, Zod, and
Valibot while preserving their structure without exposing source objects.

## Decisions for this draft

- Keep `introspect()` on the schema's `~standard` object. Adapters wrap sources
  such as raw JSON Schema that cannot carry the method and return a node with
  lazy child-node functions.
- Resolve references within the implementation's available context. Preserve
  repeated and recursive targets as shared node objects; represent an
  unavailable child as an opaque leaf; do not fetch remote references as a
  side effect.
- Define the common names as the version 1 vocabulary registry while keeping
  namespaced extensions open. Relations are optional capabilities, and an
  edge's presence declares the full direct-edge set for its relation.
  `unknown` is the required kind fallback.
- Require exactly one kind per node. `unknown` means no single portable kind
  can be asserted, while `any` and `never` describe the top and bottom value
  domains.
- Standardize common structural relations; an edge claims the complete
  direct-edge set for its relation on its node. Keep edge order stable within
  an introspection view.
- Allow an optional value context for resolving conditional or dependent
  structure without turning introspection into validation.
- Require a declared implementation to supply its kind, relation, and
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
the form's mapping from reported kinds and edges to fields as a consumer choice.
