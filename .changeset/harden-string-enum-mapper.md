---
"@sjsf/form": major
---

Harden `StringEnumValueMapperBuilder`:

- Reject non-primitive enum values without serializing them, so a cyclic object or a BigInt no longer makes the error message throw.
- Throw when two enum values map to the same string, such as `1` and `"1"`, `null` and `"null"`, or `true` and `"true"`, instead of silently mapping one value to the other. Use `IdEnumValueMapperBuilder` for object values and enum values that are not string-unique.
