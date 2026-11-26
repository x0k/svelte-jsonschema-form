---
"@sjsf/form": patch
---

Keep a renamed additional-property key that matches no `patternProperties` pattern editable: an absent `additionalProperties` now permits the key like `true`, so its field is built from the value it holds instead of an unusable `{ type: "null" }`. A forbidden key still gets the `null` stub, and a pattern that names no type keeps its keywords with a type read from the value. `patternProperties` patterns are now compiled with the `u` flag, as validators compile them, with an unflagged fallback for patterns that flag rejects.

`unevaluatedProperties` is now part of the public `Schema` type and is read wherever the core reads `additionalProperties` for extra keys: stubbing a held key, seeding a new one, deciding whether the object expands, and pruning extra data. An explicit `additionalProperties` still takes precedence, and an object naming neither keyword still forbids extra keys when pruning. Merging an option into its parent now also classifies the 2020-12 subschema keywords (`dependentSchemas`, `prefixItems`, `unevaluatedItems`, `unevaluatedProperties`, `contentSchema`) as subschemas. A stub described by `oneOf`/`anyOf` now takes a type only when the options agree on one, instead of falling back to `object`.

Schema type inference now reads `oneOf`/`anyOf` before `allOf` when a schema has both, the same order the additional-property stub uses; `allOf` is still read when the options name no type. This is an SJSF decision to keep both readers consistent, not part of the upstream port.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5429>
