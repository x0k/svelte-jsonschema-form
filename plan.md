# Precompiled validator targets plan

## Goal

Make precompiled validators for the JSON-Schema-compiling backends cover every
schema shape that the form can hand to validation: schemas changed by allOf,
overlapping patternProperties, schema-valued additionalProperties, dynamic
additional-property stubs, and data-selected branches. The compiler-only
planner must not enter a normal application bundle.

## Prerequisites and upstream status

This plan is blocked on the RJSF schema-graph port. Do not start phase 1 until
it lands and this plan has been re-scoped against it.

Verified in `/home/roman/Projects/react-jsonschema-form` (`v7` at `4a147cd1e`)
and against RJSF `main` (`bf3a748eb`, 7.0.0-beta.1):

- #5535 and #5536 merged on 2026-10-21 and are on main:
  `packages/utils/src/schema/graph/validationTargets.ts` and
  `packages/utils/src/parser/schemaParser.ts` (`getValidationSchemas()`) exist,
  and the expand-all resolver (`retrieveSchemaInternal`, `resolveCondition`,
  `resolveDependencies`, …) is gone from `retrieveSchema.ts`.
- #5536 hands validators `{ $ref: '#/<pointer>' }` into the parsed root, so the
  compile list depends on the root alone, never on form data. It fixes the
  precompile crashes #5452–#5455 and deletes the branch expansion this plan
  proposes under "Planning and resolution policy".
- #5371, which introduced the merged-schema variant IDs that the stashed
  `prepareMergedFragment` and ADR 0012 port, is taken back by #5536:
  `SchemaParserOptions`/`customMergeAllOf` expansion and pattern-combination
  coverage are removed. ADR 0012 must not land as written.
- #5530 (nested `$id` against its parent resource), #5429 and #5620 (extra-key
  stubs and `additionalPropertiesWhenAbsent`), #5652 (dependency `oneOf`
  merging), #5756 and #5811 (recursive option scoring) change exactly the
  behavior this plan relies on. All are merged upstream.

After the port, re-scope instead of implementing the whole plan:

- drop the planner policy, branch/pattern enumeration, caps, and fingerprints
  of resolved copies; use root-derived pointer targets plus derived scoring
  schemas;
- replace the target-ID machinery in this plan with upstream `schemaKey()` and
  `?rjsf=<hash>` variant IDs unless SJSF needs a distinct key contract;
- rebase local refs with the ported `withRootIdRefPrefix()` and resource-aware
  resolution, not a new rebase rule;
- change the validator interface so it can resolve a pointer against the root;
  SJSF's `isValid(schema, value)` currently receives no root;
- keep the compiler/runtime split, the bundle/metafile test, typed fail-closed
  errors, and the major changeset.

Upstream still does not compile schemas a merge makes (custom mergers, pattern
merges). Re-decide whether that gap is in scope after the port; do not treat it
as covered by pointer targets alone.

## Terminology and invariant

A runtime target is any schema passed to validatorRetriever: normally a schema
retrieveSchema() resolved for a field and its current data, but also the raw
root passed by createFormValueValidator() and synthetic condition/combination
probes. A compiled fragment is the compiler's rewritten representation of that
target: its descendants may be replaced by $refs and its local $refs may be
rebased.

Target identity is:

```text
origin + fingerprint(canonical runtime target)
```

The fingerprint is always computed before descendant extraction, $ref
rewriting, or replacing the target's $id. The planner must compile exactly the
runtime targets it keys. It must never fingerprint an emitted fragment and
expect that key to identify the different object seen at runtime.

The model emitted by insertSubSchemaIds() is shipped as-is after origins are
inserted. Planning always operates on copies:

```text
raw schema -> insert origin ids -> shipped model
                                  -> planner copies -> targets -> fragments
```

This ensures form rendering and ordinary $ref resolution continue to use the
original model, while compiled validators represent its possible resolutions.

## IDs, names, and $refs

### Target IDs

$id is a URI-reference, and generated fragments necessarily use their target
IDs in compiler-generated $ref values. A derived ID is therefore opaque and
backend-internal, rather than "not a URI". It is allowed in generated $id and
$ref values, but is neither a stable public URI nor something a user should
author in the model.

The standard identifier-oriented strategy derives a valid ESM binding name:

```text
<originId>__sjsf_m<128-bit-fingerprint>
```

For an IdFactory origin such as v12,
v12__sjsf_m7fa3c91d4b2e6a10c8d5f9031e7b42ac is both a valid ESM binding and a
valid relative URI-reference. These names are suitable for Ajv, ATA, and
SchemaSafe code generation. The identifier strategy requires an ESM-safe
origin; a user-authored URI origin uses the URI strategy or a custom strategy
rather than silently stripping characters.

Not every backend has that constraint. Hyperjump currently uses absolute URL
IDs (for example https://example.com/v0) as registry keys, not ESM exports.
Target planning must therefore accept a backend TargetIdStrategy:

- identifier strategy: append the ESM-safe suffix above;
- URI strategy: `<origin-without-fragment>?sjsf-target=m<fingerprint>`, built
  with URLSearchParams so existing query parameters are preserved; reject an
  origin with a fragment or an existing `sjsf-target` parameter, and require
  an absolute URI;
- registry lookup always uses the backend's target ID, not an assumed ESM
  export name.

A custom TargetIdStrategy has a stable `id` and a `derive(origin, fingerprint)`
method. Its output must be a valid `$id` and registry key (and an ESM binding
when the backend exports one), and it must be injective over origin plus
fingerprint; the compiler rejects collisions. The source IdFactory contract
remains valid for the identifier strategy; Hyperjump keeps its existing URL
factory and uses the URI strategy. This avoids forcing a URL through an
ESM-name API or breaking URI reference resolution.

### Fingerprint and canonicalization

Add a shared `validatorTargetFingerprint()` helper. It UTF-8 encodes the
canonical representation and always uses the same portable, synchronous
128-bit hash: two BigInt FNV-1a 64-bit lanes with the FNV prime, the standard
FNV offset basis and the fixed alternate seed 0x84222325cbf29ce4. Concatenate
the two zero-padded 16-digit lower-case hexadecimal lanes and prefix them with
m. It must not use the exported 32-bit schemaHash() (which remains unchanged as
a cache hash and can contain -). Preserve array order and sort object keys
deterministically.

Canonicalization is specified as follows:

- remove the target root's $id only, so the ID is not self-referential;
- retain descendant $ids and raw $ref strings, because they affect scope and
  the fragment graph;
- run before compiler-only $ref rebasing and descendant extraction;
- remove internal resolution symbols, including reference and
  additional-property markers;
- for a parent object, remove properties entries carrying
  ADDITIONAL_PROPERTY_FLAG, since those are current-data UI stubs rather than
  part of the static parent target;
- preserve every JSON Schema keyword and its values otherwise.

Canonicalization sorts object keys, but target IDs are not stable across
object-key reordering when generated descendant `$id`s or counter-based origins
change with traversal order. `createIdFactory()` is a counter and
`insertSubSchemaIds()` traverses `Object.keys()` insertion order; retaining
descendant `$id`s in the fingerprint then changes the parent hash. The guarantee
is therefore deterministic target IDs for the same shipped model, same
IdFactory, and same idAugmentations, with byte-identical repeated compilation.
Key-order-stable target IDs would require path/content-derived origins plus
canonical descendant-ID placeholders, both of which would rename model `$id`s;
that is a non-goal.

The planner records each derived ID to its canonical target, rejects a distinct
canonical target with an already-used full derived ID, including an alias
collision, and rejects a derived ID that equals a raw model `$id`. No silent
overwrite and no compiler-only disambiguation path are allowed: a detected
128-bit collision is a hard compilation error. Runtime always derives the one
fixed form.

### Origins

Raw validatable nodes receive origins from insertSubSchemaIds(). Synthetic
schemas need explicit origins; they cannot rely on a missing root $id:

- condition schemas use the existing property-derived condition origin;
- augmented combination schemas use the existing combination origin;
- schema-valued additionalProperties and each pattern variant inherit a
  recorded owner/origin descriptor; a pattern variant also records its ordered
  pattern subset;
- additionalProperties: true stubs map to a finite global family of generic
  JSON-type targets, including the empty `{}` target for unknown/undefined
  values, or carry an explicit owner target marker. They are not identified by
  hashing the mutated parent schema.

Pass such descriptors explicitly through resolution or attach an internal
symbol marker when a stub or pattern-derived child is created. A marker on the
parent is insufficient because validation receives the child schema. The
marker is runtime metadata only and is excluded from fingerprints and JSON
Schema evaluation.

## Architecture

Split the current mixed validators/precompile responsibility into two one-way
layers.

### Runtime: validators/precompiled.ts

This lightweight browser-safe module owns:

- fromValidators and createValidatorRetriever;
- target-ID canonicalization, fingerprinting, and WeakMap memoization; and
- typed missing-target diagnostics.

It does not enumerate branches, run the merger, or manufacture candidate
schemas. Given a schema retrieveSchema() already produced (and any internal
origin marker), it derives one registry key and looks it up.

Fingerprinting is synchronous and O(schema size) per distinct schema object.
Memoize canonicalization and the fixed hash in a WeakMap keyed by object
identity; resolved schemas are often fresh objects, so this is a per-validation
cache, not a global one. Never hash emitted fragments at runtime. Benchmark a
large model and document the cost; do not claim O(1) lookup.

This target scheme applies to the JSON-Schema-compiling backends. zod4 and
valibot keep their native schema registries and only share the runtime helpers
and idAugmentations contract; cfworker compiles at runtime and does not consume
the manifest.

The generated application passes an explicit manifest to the new overload:

```ts
fromValidators(validators, {
  manifest: {
    protocol: 1,
    plannerVersion: 1,
    mode: "legacy" | "target-v1",
    targetIdStrategy: "identifier" | "uri-query" | TargetIdStrategy,
    idAugmentationsFingerprint: string,
  },
  idAugmentations,
});
```

The manifest is generated beside the validator table and does not repeat the
target list. The validator table's keys are the registry; the generated plan
sidecar carries the target IDs and effective caps, and development asserts it
matches `Object.keys(validators)` as a set in both directions. No `targetIds`
list is emitted into the runtime manifest.

`protocol` is the compatibility gate and changes only for an incompatible
manifest or target-ID contract. `plannerVersion` identifies the planner
algorithm for diagnostics and changes when planning output changes without a
protocol break. `mode: "legacy"` keeps the current retriever; `mode:
"target-v1"` is fail-closed only in phase 4. A target-v1 manifest is never
silently downgraded to legacy: a runtime that does not support it rejects the
manifest at factory creation. Generated apps in phases 1–3 pass `legacy` or
omit the options.

`targetIdStrategy` is a built-in name or a custom TargetIdStrategy
implementation. The compiler and runtime must use the same implementation;
built-ins are serialized by name, and a custom strategy is passed as an object.
Existing public idAugmentations are applied while deriving condition and
combination origins, before target-ID derivation. Augmentations must be pure.
Generated apps import one shared augmentation constant for both compiler and
runtime; development compares outputs for fixed probe IDs (for example
`combination("v0")` and `condition("v0")`) with
`idAugmentationsFingerprint` and fails on a mismatch.

This explicit contract deliberately changes generated demo/factory shape; do
not infer a strategy from whether an origin happens to look like a URL or put
transition mode only in unrelated generated metadata.

### Compiler: validators/precompile.ts

This compiler-only module owns:

- origin insertion;
- target planning and data-branch enumeration;
- merging with the configured merger;
- target-ID allocation and collision checks; and
- fragment preparation and compilation input.

The legacy compiler path may re-export runtime helpers from
validators/precompiled during migration. The runtime module must never import
or re-export the compiler module. A normal application importing the new
runtime entry consequently cannot retain the planner through an import cycle.

packages/meta/src/playground/validator-factory.ts is an intentional dev-tool
exception: it compiles in the browser and may import the compiler entry. It is
not evidence that normal consumers should bundle that entry.

Place the dependency-free canonicalizer, fixed hash, and built-in strategies
in validators/precompiled/target-id.ts. The compiler imports this runtime leaf;
the runtime leaf never imports the planner. This avoids making private
sortedJSONStringify() part of the core public API and gives the bundle test a
clear one-way dependency boundary.

## Planning and resolution policy

Create an explicit shared resolution policy instead of invoking the ordinary
resolver with a fake isValid() result.

- Runtime policy selects one if branch, oneOf/anyOf option, and dependency
  outcome from form data, as retrieveSchema() does today.
- Planning policy follows the same transition rules but enumerates every legal
  successor: both conditional branches, every option, and every
  dependency-present/dependency-absent outcome. For dependencies this includes
  the present-but-zero-or-more-than-one-matching-option outcome, which leaves
  the schema unmerged. Nested decisions form a bounded cross product.

Refactor the resolver transition engine to accept that policy. Runtime invokes
it with a selecting policy; the planner invokes the same engine with an
enumerating policy and merely collects its emitted targets. The shared engine,
not a second planner merger, performs all existing reference, allOf, pattern,
additional-property, option, and dependency merges. This replaces the current
accidental behavior where a fake validator always selects else, the first
option, or no dependency merge. Add a property test that, for representative
form data, the canonical runtime target appears in the set planned from the
same model.

Every selected oneOf/anyOf alternative means the remaining schema merged with
that option, exactly as the runtime resolver does; planning an option by itself
is insufficient. Likewise, for each declared property name, enumerate the
merge of every matching patternProperties schema followed by the declared
property schema. That path is distinct from an extra-key stub. The declared
property's own origin remains the target origin; the matching pattern subset is
part of the fingerprint.

### Dynamic object keys

For each object target with patternProperties:

1. Plan the zero-matching-pattern path, which uses the applicable
   additionalProperties target.
2. Plan every non-empty matching-pattern subset, merged in declaration order.
3. Preserve the owner descriptor and ordered pattern subset so a runtime
   extra-key stub maps to the exact merged target instead of to the
   data-mutated parent or a sibling subset.

Arbitrary JavaScript regexp intersection is not safely decidable in general,
so the planner compiles a conservative superset rather than trying to omit
unreachable subsets. Pattern variants grow as 2^n - 1; the zero-match path is
separate and always planned. Defaults:

- maxPatternsPerObject = 8: at most eight patternProperties entries are
  enumerated;
- maxPatternVariants = 255: at most 2^n - 1 non-empty subsets per object;
- maxBranchVariants = 64: at most 64 distinct successors at one decision
  frontier (if has 2, oneOf/anyOf has N, and dependency outcomes charge their
  own frontier);
- maxTargets = 512: at most 512 unique targets per root after local
  deduplication.

All are compiler options validated as positive integers. Exceeding any is a
hard compilation error naming the root path, object/decision path, observed
count, and configured cap. Higher limits require explicit opt-in and never
silently emit a subset. The generated plan sidecar records the effective caps
so a build can be reproduced. Nested frontiers are bounded by maxTargets; the
planner must not claim a bounded cross product without enforcing it.

For additionalProperties: true, plan generic targets for the finite JSON types
inferred by stubExistingAdditionalProperties(), including the empty `{}` target
used when the value is undefined. The stub returns `{}` before calling
typeOfValue() for an undefined value; for a present value whose type is not a
JSON Schema type, typeOfValue() returns "unknown" and isJsonSchemaType() rejects
it, so the stub is also `{}`.

For a schema-valued additional property, plan the schema target and every
applicable merged/pattern variant. Parent target canonicalization strips
concrete dynamic stubs, while field validation selects the child/generic target
through its marker. Each pattern-derived child carries the owner origin and the
ordered pattern subset; a marker only on the parent is insufficient because
validation receives the child.

For additionalProperties: false with patternProperties, plan the explicit
forbidden-extra-key stub target `{ type: "null" }` that the runtime returns for
a key matching none of the patterns. The same stub is returned when
additionalProperties is absent but patternProperties are present and the key
matches none of them: stubExistingAdditionalProperties() falls through to
`{ type: "null" }` for both false and undefined. Plan that target for both
cases and map the stub marker to it. When there are no pattern properties,
retrieveSchemaInternal() returns before stubbing for both false and absent
additionalProperties, so no null stub target is needed.

## Deduplication and fragment graph

An origin is part of a target's identity. Initially deduplicate only identical
candidates for the same origin and full derived ID. Do not collapse two origins
merely because their pre-rewrite JSON happens to be equal: they may resolve
relative refs differently or require separate fragment roots.

Cross-origin aliasing is a later optimization only if both the canonical
runtime target and the fully prepared fragment graph are equivalent. It must
register every origin-specific target ID as an alias; it cannot make one ID
silently stand for another origin.

The compilation pipeline is therefore:

1. Choose an origin and a runtime-visible target.
2. Allocate its target ID from the canonical runtime target.
3. Prepare a separate compiled fragment, replacing descendants with generated
   $ref: "<derived-descendant-target-id>#" edges. Rebase every local #/... ref
   inside the fragment to the derived target ID of the origin root it was
   originally relative to (normally the model root target), never to the
   fragment's own derived ID and never to the raw origin ID. A local ref names
   a location in the document the fragment was extracted from, not in the
   fragment itself; rebasing to the fragment's own ID would make
   fragmentId#/definitions/x resolve inside a schema that does not contain the
   document's definitions.
4. Set that fragment's $id to the allocated target ID.
5. Compile the resulting graph.

The raw root is a target too. createFormValueValidator() validates the shipped
model root, so the runtime retriever derives the root target ID from that raw
model and must find the fragment allocated before its refs were rewritten.
When the root has allOf or other mergeable content, compile both the raw root
target and the materialized root target; the materialized form must never
replace the only raw-root fragment. Phase 1 keeps the raw root under its raw
$id and emits the materialized root under a temporary ID; phase 2 replaces
that temporary ID with the content-derived target.

## Diagnostics and failure behavior

The current validator adapters catch retriever errors and turn them into a
warning plus false. That is not an acceptable missing-target signal.

Introduce MissingPrecompiledValidatorTargetError, containing the origin,
derived key, strategy id, protocol, planner version, and a safe target
description. Adapters must rethrow that error (rather than report a generic
invalid value); they retain existing handling for validator execution
failures. Development tooling validates the generated plan sidecar against
Object.keys(validators) at factory creation and reports missing or extra IDs
with the schema path and planner version. A manifest protocol mismatch is a
startup error, not a warning; a plannerVersion mismatch is reported as a
diagnostic and is fatal only when the development sidecar check is enabled.

Do not enable this fail-closed behavior until the full planner is in place and
its runtime-coverage property tests pass. The transition retains the legacy
retrieval path with a development diagnostic, and generated apps pass legacy
mode until phase 4. It must never make an unknown derived target silently fall
back to a potentially weaker base validator.

## Implementation phases

### 0. Upstream prerequisite (blocking)

- Port #5530, #5535, and #5536 from RJSF, including #5429, #5620, #5652,
  #5756, and #5811 where they change the resolution behavior this plan assumes.
- Re-read this plan against the ported code and remove the superseded sections
  before implementing phase 1.
- Leave the stashed ADR 0012 unlanded; the new ADR supersedes it (see Migration
  and bookkeeping).

### 1. Static allOf groundwork, without changing runtime lookup

- Add merger/normalizer and logger options to the compiler entry point and
  update every compiler call site.
- On planner copies made after origin insertion, deeply materialize static
  allOf results before fragmentSchema() extracts descendants.
- Keep the raw root target compiled. When the root itself has allOf, keep an
  unmodified root fragment under its raw $id and emit the materialized root
  under a temporary distinct $id allocated from the same IdFactory. Phase 2
  replaces that temporary ID with the content-derived target. Materialization
  must never overwrite the only fragment registered for the raw root.
- Materialization changes paths, so build an origin-id-to-SchemaMeta map from
  the model's original SubSchemas trie, then re-index the normalized copy into
  a fresh path trie by the copied node $ids. Do not use the original path trie
  against the normalized tree. Phase 2 replaces this bridge with origin
  descriptors.
- Keep the shipped model unchanged and preserve the current retriever.
- Complete the staged property, array-item, and nested-object tests; remove
  it.only. Add a raw-root-with-allOf test proving both the raw root and the
  materialized root remain compiled.

This is explicitly a partial capability. A shared $ref in two merged contexts,
extra-key stubs, and overlapping patterns are not yet covered.

### 2. Establish target representations and split imports

- Add runtime-target canonicalization, origin descriptors, target-ID strategy,
  and typed target records, retaining legacy lookup behavior.
- Create validators/precompiled.ts and validators/precompiled/target-id.ts so
  the existing ./validators/* wildcard resolves both the runtime entry and the
  leaf. Do not add a directory index that the wildcard maps to a nonexistent
  dist/validators/precompiled.js; otherwise add explicit export entries and an
  export-resolution test.
- Make validators/precompile re-export runtime helpers only in that direction
  for compatibility.
- Add the manifest protocol/plannerVersion/mode/strategy and generated plan
  sidecar; generated apps pass legacy mode until phase 4.
- Update normal validator packages and generated app imports to the new runtime
  path. Migrate zod4/valibot registries to the runtime helpers; keep the
  playground's intentional compiler import isolated.

### 3. Full planner and coverage audit

- Implement the planning policy for refs/allOf first, then dynamic additional
  properties and patterns, then conditions, options, and dependencies.
- Compile all targets with their allocated IDs, including both the raw root and
  the materialized root, and validate fragment refs.
- Add the planner/runtime property test and manifest coverage checks.
- Make cap exceedance and derived-ID collision failures explicit build errors.

### 4. Enable fail-closed lookup and release

- Enable target-v1 only after phase 3 coverage is complete. Before phase 4,
  the runtime rejects a target-v1 manifest instead of silently using legacy
  lookup.
- Rethrow the typed missing-target error in all validator adapters.
- Remove the legacy fallback.
- Publish the import split, merger contract, cap behavior, and diagnostics.
- Add a changeset for the major-version API/import change and generated-name
  change.

## Required tests

- The staged ancestor-allOf tests: property, array item, nested object.
- Raw-root-with-allOf: createFormValueValidator() still finds the raw root
  validator, and the materialized root target is compiled separately.
- One $ref used from two differently merged contexts, including the compiled
  $ref graph between the targets and local refs rebased to the origin root
  target's derived ID, not the fragment's own ID.
- patternProperties: zero, one, and two matching patterns; a key matching both
  patterns; a declared property matching patterns; deterministic declaration
  ordering; and pattern origin markers selecting the exact subset.
- additionalProperties: true with data of every inferred JSON type, including
  the empty `{}` target for undefined values; schema-valued
  additionalProperties with data after an ancestor merge; and the
  `{ type: "null" }` stub for a non-matching key under additionalProperties:
  false with patternProperties and under absent additionalProperties with
  patternProperties.
- Parent fingerprints exclude dynamic ADDITIONAL_PROPERTY_FLAG properties;
  child stubs select their additional-property or pattern target.
- oneOf/anyOf with a non-first option, both if branches, and dependency
  present/exactly-one, present-but-no-merge, and absent outcomes;
  property-test each runtime result against the planner's target set.
- Id-less condition and augmentation schemas, plus cyclic/recursive $refs.
- Determinism: repeated compilation of the same model, IdFactory, and
  idAugmentations is byte-identical. Canonical fingerprints ignore object-key
  insertion order when no generated descendant $id changes; key-order-stable
  target IDs are explicitly not promised while origins and descendant $ids are
  counter-assigned.
- Identifier-strategy IDs are legal ESM bindings; URI-strategy IDs are valid
  URIs, preserve existing query parameters, and reject a fragment or an
  existing sjsf-target parameter.
- Full-derived-ID collision handling; no fallback from a missing variant to a
  base target.
- Pattern, branch, and global-target cap exceedance are explicit compilation
  errors with decision-path diagnostics; test the exact boundary, the
  zero-match path excluded from the variant count, and per-frontier versus
  per-root accounting.
- Generated manifest protocol/plannerVersion, target-ID strategy, plan-sidecar
  completeness, legacy mode, target-v1 mode, and a custom TargetIdStrategy are
  all exercised. Verify idAugmentations changes both condition and combination
  origins identically in compiler and runtime.
- A normal-consumer bundle/metafile test proving the new runtime entry excludes
  planner and merger-expansion modules, including through the legacy compiler
  entry's one-way re-export. Do not run this assertion against the playground.
- The existing ./validators/* export resolves both validators/precompiled and
  validators/precompiled/target-id, with types, in a package-consumer test.
- Every precompiling JSON-Schema backend (ajv8, ata, hyperjump, schemasafe)
  compiles and retrieves the same planned target set. zod4 and valibot keep
  native registries and are tested for matching combination/condition IDs;
  cfworker is runtime-compiled and excluded.

## Migration and bookkeeping

- Update packages/meta/src/codegen/compile-validators-script.ts to emit the
  manifest (protocol, plannerVersion, mode, strategy) and the plan sidecar
  (target IDs, effective caps); keep targetIds out of the production manifest.
- Update playground factories, generated application fixtures (including
  packages/sv test output), and the precompiling backends ajv8, ata, hyperjump,
  and schemasafe. The playground passes the same manifest and idAugmentations
  to its in-browser compiler and runtime.
- Migrate zod4 and valibot schemas-registry.ts to the new runtime entry for
  DEFAULT_ID_AUGMENTATIONS and conditionSchemaEntries; they keep their native
  registries and receive the same augmentations. cfworker remains
  runtime-compiled and does not consume the manifest.
- Use validators/precompiled.ts plus validators/precompiled/target-id.ts and
  verify the existing ./validators/* wildcard resolves both; add a
  package-consumer export-resolution test rather than a redundant export-map
  entry.
- Grep and update all affected public API examples and prose under skills/ and
  apps/docs2/; regenerate committed generated metadata when required.
- Add an ADR when implementation begins after the upstream port. Do not land
  the stashed 0012-merged-schema-ids.md: RJSF #5536 removed the merged-variant-
  ID design it documents. Use 0013, link to 0012, and state that it supersedes
  that decision.
- The ADR records the root-pointer target model, compiler/runtime package
  boundaries, the target-ID contract, and how merge-made schemas are treated.
- Add a major-version changeset for the resulting import/API change after the
  upstream port: new runtime import path, manifest protocol or its upstream
  equivalent, generated target names, delayed fail-closed behavior, and any
  remaining requirement that compiler and runtime use equivalent merger
  semantics. This is the 3.10 to 4.0 release and must bump the entire fixed
  Changesets group, not only @sjsf/form.

## Non-goals

- Treating compiler-generated IDs as user-facing stable schema URIs.
- Guessing which regular-expression combinations are reachable.
- Dynamically compiling a missing validator in the browser.
- Supporting a runtime custom merger that differs from the compilation merger.
- Key-order-stable generated origin IDs while preserving counter-based
  createIdFactory and descendant $id retention; that would rename model IDs.
- Applying the target planner to native zod4/valibot registries or
  runtime-compiling cfworker.
