---
"@sjsf/sveltekit": patch
---

[**Potentially breaking change**] Utilize `hydratable` API for initial data parsing (Remote functions only).

This change may result in incorrect initial data being rendered if there is an `idPrefix` collision between multiple forms.
When rendering multiple forms on the same page, make sure to use a unique `idPrefix` (for example, `$props.id()`).
