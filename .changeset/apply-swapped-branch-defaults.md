---
"@sjsf/form": major
---

Remove a `dependencies` or `if`/`then`/`else` branch's stale default when the selected branch swaps in a different one, then let the normal defaults pass write the new value.

A value equal to the old branch's declared `default` or `const` is removed even when it came from `initialValue`; a value edited away from it is kept. Values are matched per key of the level that declares the default, and array items are not searched. See the dynamic forms guide for the full replacement rules.

Add the required `FormMerger.dropStaleDefaults` hook. The built-in modern and legacy mergers implement it. Custom `FormMerger` implementations must delegate `dropStaleDefaults` to the new exported helper or implement the pass themselves. The options carry the pass's original form data and resolved schema, plus the paths it has already dropped, so repeated searches within one pass stay consistent.
