---
"@sjsf/form": patch
---

Fix defaults not being populated when a property schema wraps a `$ref` in a single-element `allOf` and `experimental_defaultFormStateBehavior.allOf` is set to `"populateDefaults"` (rjsf issue #5177)
