---
"@sjsf/form": patch
---

Fix JSON Schema merge edge cases ported from `@x0k/json-schema-merge` v1.1.1: keep a schema-valued `items` constraint in `additionalItems` when merging with a tuple, match property names containing line terminators in merged `patternProperties`, stop `additionalProperties` from leaking into the other branch's `patternProperties`, and treat prototype-named schema keys such as `constructor` and `__proto__` as own properties.

Port <https://github.com/x0k/json-schema-merge/releases/tag/v1.1.1>
