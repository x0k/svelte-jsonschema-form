---
"@sjsf/form": patch
---

Keep a value or default of another type a `type` list allows: `null` and other listed non-container values are no longer filled in with the resolved container's defaults, and `omitExtraData` no longer prunes or drops them as that container.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5428>
