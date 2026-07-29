---
"@sjsf/form": patch
---

Rewrite `omitExtraData` internals for correctness and fix several bugs:

- Replace recursive `getKnownProperties` with local-only property tracking (`computeObjectSchema`/`localProperties`) so `additionalProperties` only considers sibling `properties` and `patternProperties`, matching Draft 07 semantics
- Add `materializeSource` parameter to prevent source aliasing in compositional branches (`allOf`, `oneOf`, `anyOf`, `if/then/else`, `dependencies`) — fixes infinite loops and data mutation when a permissive branch (e.g. `allOf: [true]`) is used
- Rewrite array handling from push-based to index assignment with `target.length` truncation — fixes `undefined` holes when tuple data is shorter than tuple items, and handles shrinking arrays correctly
- Add post-processing step to prune properties not in `localProperties` or `patterns` when `additionalProperties: false`, ensuring extra properties are removed after all schema composition
- Remove incorrect `propertyNames` blanket inclusion — `propertyNames` validates property names but does not declare allowed properties
- Preserve arrays without item constraints instead of returning source directly
